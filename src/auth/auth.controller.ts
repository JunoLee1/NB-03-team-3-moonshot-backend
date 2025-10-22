import { Request, Response, NextFunction } from "express";
import HttpError from "../lib/httpError.js";
import { AuthService } from "./auth.service.js";
import { generateToken } from "../lib/generateToken.js";
import bcrypt from "bcrypt";
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from '../lib/constants.js';

export enum ProviderType {
  LOCAL = "local",
  GOOGLE = "google"
}
export interface AuthUserDTO{
    id ?: number,
    email: string ,
    password:  string| null,
    nickname?: string |null,
    image?: string |null,
    provider?: ProviderType | null,
    providerId?: string | null
}

const authService =  new AuthService()
export class AuthController{

    // login Controller
    // DB에서 해당 유저의 이메일/ 비밀번호를 확인후 로그인 
    async loginController(req:Request, res: Response, next:NextFunction){
      try {
        const { email,password } = req.body; 
        
        if(!req.user) throw new HttpError(401,"Unauthorized")
        if(!req.user.id)throw new HttpError(401,"Unauthorized")
        
        const{ refreshToken, accessToken } = generateToken(req.user.id);
       
        this.setTokenCookies(res, accessToken, refreshToken);
        if(typeof email !== "string" )throw new HttpError(400,"이메일이 문자열아닙니다") 
        await authService.loginService({ email, password })
        return res.status(200).json({
          message:"성공적인 로그인"
        })
      } catch (error) {
        next(error)
      }
    }

    // logout controller

    async logoutController(req: Request, res: Response, next:NextFunction){
      this.clearTokenCookie(res);
      return res.status(200).send()
    }

    // register controller
    // 데이터상 생성할 이메일 || nickname의 중복유무를 확인후, 중복 x? 데이터 DB에 보내기
    async registerController(req: Request, res: Response, next:NextFunction){
      try {
         const {email, password, nickname, image} = req.body as {
          email : unknown;
          password:unknown;
          nickname: unknown;
          image :unknown;
         }
         if(
          typeof email !== "string" ||
          typeof password !== "string"||
          typeof nickname !== "string"||
          typeof image !== "string" 
         ) throw new HttpError(400, "문자열이어야 합니다")
          const newUser = await authService.createNewUser({email, password, nickname, image})
          return res.status(201).json({
            message:"성공적인 데이터 생성",
            data: newUser
          })
      } catch (error) {
        next(error)
      }

    }

    // refreshtoken Controller
    async refreshtokenController(req: Request, res: Response, next:NextFunction){

    }

    // googleCallback Controller
    async googleCallbackController(req: Request, res: Response, next:NextFunction){

    }

  setTokenCookies(res: Response, accessToken: string, refreshToken: string) {
      res.cookie("access_token", accessToken, { httpOnly: true });
      res.cookie("refresh_token", refreshToken, { httpOnly: true });
    }

    clearTokenCookie(res:Response){
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    }
  }

