import type { Request, Response, NextFunction } from "express";
import UserService from "./user.service.js";
import HttpError from "../lib/httpError.js";

export interface IUserDTO {
  id: number;
  nickname: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userService = new UserService();
export default class UserController {
  async findDuplicateUserController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.body;
    try {
      const user_id = Number(id);
      if (typeof user_id !== "number" && user_id > 0) {
        throw new HttpError(400, "Bad request");
      }
      return res.json({ success: true, message: "사용가능한 아이디입니다" });
    } catch (error) {
      next(error);
    }
  }
  async userInfoController(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("userInfoController의 req.params:", req.params);
      //const user = req.user
      const { id } = req.params;// 인증 미들웨어에서 req.body에 id넣어주기
      // ❌ undefined 오류
      console.log("id", id);
      const { nickname, email } = req.body;//validation 미들웨어에서 req.body에 nickname, email 확인후 넣어주기
      console.log("nickname, email", nickname, email);// ❌ undefined 오류
      const unique_check = await userService.getuUserInfoById({
        num_id: Number(id),
        email,
        nickname,
      });

// User/me
      // prune
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      }
      const num_id = Number(id);
      if (typeof nickname !== "string")
        throw new HttpError(400, "해당 유저의 닉네임은 문자열이어야합니다");
      if (typeof email !== "string" && email.includes("@"))
        throw new HttpError(
          400,
          "해당 유저의 이메일은 문자열이어야하고 이메일 형삭이 아니어야합니다"
        );
      if (typeof num_id !== "number" && num_id > 0)
        throw new HttpError(
          400,
          "해당 유저의 인덱스는 0보다 큰정수이 어야합니다"
        );

      const userInfo = await userService.getuUserInfoById({
        num_id,
        email,
        nickname,
      });
      return res.json({
        success: true,
        data: userInfo,
      });
    } catch (error) {
      next(error);
    }
  }
  async userUpdateController(req: Request, res: Response, next: NextFunction) {
    const { id, nickname: rawNickname, email: rawEmail } = req.body;
    try {
      const unique_check = await userService.getuUserInfoById({
        num_id: Number(id),
        email: String(rawEmail),
        nickname: String(rawNickname),
      });
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      }
      const num_id = Number(id);
      const nickname = String(rawNickname);
      const email = String(rawEmail);
      if (typeof rawNickname !== "string") {
        throw new HttpError(400, "문자열이어야합니다");
      }
      if (typeof rawEmail !== "string") {
        throw new HttpError(400, "문자열이어야합니다");
      }
      if (typeof num_id !== "number" && num_id > 0) {
        throw new HttpError(400, "인덱스는 0보다 큰정수이 어야합니다");
      }
      const updatedUser = await userService.updatedUser({
        num_id,
        email,
        nickname,
      });
      return res.status(200).json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  }
  
  async findUsedrProjectsController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { id } = req.params;
    try {
      const user_id = Number(id);
      if (typeof user_id !== "number" && user_id > 0) {
        throw new HttpError(400, "Bad request");
      }
      const projects = await userService.findUserProjects({ user_id });
      return res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }
}
