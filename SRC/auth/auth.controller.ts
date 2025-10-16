import { Request, Response, NextFunction } from "express";
import HttpError from "../lib/httpError.js";

export interface IUserDTO{
    id:number;
    email:string;
    nickname:string;
    password?:string;
}


export class AuthController {
    async loginController(req:Request, res:Response, next:NextFunction){
        try {
            // 1. 데이터베이스에서 사용자 이메일 및 비밀번호 확인후 토큰 발급
            const{ nickname:rawNickname, email:rawEmail, password:rawPassword } = req.body;
            if (!rawEmail || !rawPassword) {
                throw new HttpError(400, "이메일과 비밀번호를 모두 입력해주세요.");
            }
            if (typeof rawEmail !== "string" || !rawEmail.includes("@")) {
                throw new HttpError(400," 유효한 이메일 형식이 아닙니다.");
            }
            if (typeof rawPassword !== "string" || rawPassword.length< 6 ){
                throw new HttpError(400,"비밀번호는 최소 6자 이상이어야 합니다.");
            }
            if (typeof rawNickname !== "string" || rawNickname.length < 3) {
                throw new HttpError(400, "닉네임은 최소 3자 이상이어야 합니다.");
            }
            
            
        } catch (error) {
            next(error);
        }
    }

    //async siginupController(req:Request, res:Response, next:NextFunction){
}