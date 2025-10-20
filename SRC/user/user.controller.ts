import type { Request, Response, NextFunction } from "express";
import UserService from "./user.service.js";
import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import { number } from "zod/v4";

export interface IUserDTO {
  id: number ;
  nickname: string;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const userService = new UserService();
export default class UserController {
  async userInfoController(req: Request, res: Response, next: NextFunction) {
    try {
      // 인증 미들웨어에서 req.query id넣어주기
      const { id, nickname, email } = req.body as {
        id :unknown,
        nickname: unknown,
        email:unknown,
      } ;//validation 미들웨어에서 req.body에 nickname, email 확인후 넣어주기

      if(typeof email !== "string" || !email.includes("@")) 
        throw new HttpError(400, "해당 유저의 이메일은 문자열이어야하고 이메일 형식 이어야합니다")

      if (typeof nickname !== "string")
        throw new HttpError(400, "해당 유저의 닉네임은 문자열이어야합니다");

      const unique_check = await userService.getUserInfoById({
        id: Number(id),
        email,
        nickname,
      });
      // prune
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      };
     
      
      const userInfo = await userService.getUserInfoById({
        id:Number(id),
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
    const { nickname: rawNickname, email: rawEmail } = req.body;
    try {
      if(!req.user?.id) throw new HttpError(401,"unauthorization")

      const userId = req.user.id; // 인증 미들웨어에서 req.query id넣어주기
      const id = Number(userId)
      const nickname = String(rawNickname);
      const email = String(rawEmail);
      const unique_check = await userService.getUserInfoById({
        id,
        email: String(rawEmail),
        nickname: String(rawNickname),
      });
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      }
     

      const updatedUser = await userService.updatedUser({
        id: Number(id),
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
    try {
      if(!req.user?.id) throw new HttpError(401,"unauthorization"); // 인증 미들웨어에서 req.query id넣어주기
      
      const userId = req.user.id
      const projects = await userService.findUserProjects({userId});
      return res.json({
        success: true,
        data: projects,
      });
    } catch (error) {
      next(error);
    }
  }

  async findUserTasksController(req: Request, res: Response, next: NextFunction) {
    if(!req.user?.id) throw new HttpError(401,"unauthorization")
    // 인증 미들웨어에서 req.user id넣어주기
    const userId = req.user.id
    try {
      const taskIdRaw = req.query.task_id;
      if(typeof taskIdRaw !== "string" && isNaN(Number(taskIdRaw))){
        throw new HttpError(404, "Bad request");
      }
      const validatedTask = await prisma.task.findUnique({
        where: { id: Number(taskIdRaw) },
      });
      if (!validatedTask) {
        throw new HttpError(404, "존재하지 않는 태스크입니다");
      }
      const string_task = req.query.task_id;
      
      if (typeof string_task !== "string") {
        throw new HttpError(404, "Bad request");
      }
      const taskId = String(string_task);
      const result = await userService.findUserTasks({ taskId: taskId, userId :Number(userId)});
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}