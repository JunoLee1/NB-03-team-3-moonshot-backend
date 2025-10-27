import { Request, Response, NextFunction } from "express";
import HttpError from "../lib/httpError.js";
import { AuthService } from "./auth.service.js";
import { generateToken } from "../lib/generate-token.js";
import { setTokenCookies, clearTokenCookie } from "../lib/token.js";

const authService = new AuthService();
export class AuthController {
  // login Controller
  // DB에서 해당 유저의 이메일/ 비밀번호를 확인후 로그인
  async loginController(req: Request, res: Response, next: NextFunction) {
    try {
       if (!req.user || !req.user.id || !req.user.email) {
        throw new HttpError(401, "Unauthorized");
      }
      const { id, email } = req.user
     
      // 인증된 유저 인덱스랑 유저 이메일, 비밀번호를 서비스로 보낸뒤 서비스 내에서 토큰 생성후, setTokenCookies 한다
      const tokens = await authService.loginService({
        id,
        email,
      });
      res.setHeader("Authorization", `Bearer ${tokens.accessToken}`);
      res.setHeader("Refresh-Token", tokens.refreshToken);
      console.log("accessToken: ", tokens.accessToken)
      console.log("refresh:", tokens.refreshToken)
      return res.status(200).json({ 
        accessToken: tokens.accessToken,
        refreshToken:  tokens.refreshToken
      });
    } catch (error) {
      next(error);
    }
  }

  // logout controller

  async logoutController(req: Request, res: Response, next: NextFunction) {
    clearTokenCookie(res);
    return res.status(200).send();
  }

  // register controller
  // 데이터상 생성할 이메일 || nickname의 중복유무를 확인후, 중복 x? 데이터 DB에 보내기
  async registerController(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, nickname, profile_image } = req.body as {
        email: string;
        password: string;
        nickname: string;
        profile_image: string;
      };
      const newUser = await authService.createNewUser({
        email,
        password,
        nickname,
        profile_image,
      });
      return res.status(201).json({
        message: "성공적인 데이터 생성",
        data: newUser,
      });
    } catch (error) {
      next(error);
    }
  }

  // refreshtoken Controller
  async refreshtokenController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;

      if (!user) throw new HttpError(401, "unathorized");
      if (!user.email) throw new Error();
      const { accessToken, refreshToken: newRefreshToken } = generateToken({
        userId: Number(user.id),
        email: user.email,
      });
      setTokenCookies(res, accessToken, newRefreshToken);
      res.status(200).send({accessToken, newRefreshToken});
    } catch (error) {
      next(error);
    }
  }

  // googleCallback Controller
  async googleCallbackController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      if (!user) throw new HttpError(401, "unathorized");
      if (!user.email) throw new Error();
      const { accessToken, refreshToken } = generateToken({
        userId: Number(user.id),
        email: user.email,
      });
      setTokenCookies(res, accessToken, refreshToken);
      res.redirect('/');
    } catch (error) {
      next(error);
    }
  }
}
