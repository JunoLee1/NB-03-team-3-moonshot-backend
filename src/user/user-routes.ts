import express from "express";
import type { Request, Response, NextFunction } from "express";
import UserController from "./user-controller.js";
import {
  updateUserSchema,
  findUserTasksSchema,
  findUserProjectsSchema,
} from "./user-validation.js";
import {
  validateBody,
  validateQuery,
} from "../middleware/validationMiddle.js";
import passport from "../lib/passport/index.js";

const router = express.Router();

// 유저 정보 조회하기 API
//  클라이언트에게서 받은 요청을 컨트롤러로 보내기
// 해당 유저가 맞는지 아닌지 확인 하는 로직작성
// error 핸들러 미들웨어에 작성후 쓰기


const userController = new UserController();
router.get(
  "/me",
  passport.authenticate("access-token", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    userController.userInfoController(req, res, next);
  }
);


// 유저 정보 수정하기 API
// 클라이언트의 정보가 존재하는지 확인

router.patch(
  "/me",
  validateBody(updateUserSchema),
  passport.authenticate("access-token", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
        userController.userUpdateController(req, res, next);
  }
);

// 해당 유저가 참여중인 모든 프로젝트의 할일 목록 조회 API
router.get(
  "/me/projects",
  validateQuery(findUserProjectsSchema),
  passport.authenticate("access-token", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => {
    userController.findUsedrProjectsController(req, res, next);
  }
);
router.get(
  "/me/tasks",
  validateQuery(findUserTasksSchema),
  passport.authenticate("access-token", { session: false }),
  async (req: Request, res: Response, next: NextFunction) => { 
    userController.findUserTasksController(req, res, next);
  }
);

export default router;
