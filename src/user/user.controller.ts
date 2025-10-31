import type { Request, Response, NextFunction } from "express";
import UserService from "./user.service.js";
import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import { Prisma } from "@prisma/client";
const userService = new UserService();
export default class UserController {
  async userInfoController(req: Request, res: Response, next: NextFunction) {
    try {
      // 인증 미들웨어에서 req.query id넣어주기
      const { nickname, email } = req.body as {
        nickname: unknown;
        email: unknown;
      }; //validation 미들웨어에서 req.body에 nickname, email 확인후 넣어주기
      if (!req.user?.id) throw new HttpError(401, "unauthorization");

      const userId = req.user.id; // 인증 미들웨어에서 req.query id넣어주기
      const id = Number(userId);

      const unique_check = await userService.getUserInfoById({ id });

      // prune
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      }

      const userInfo = await userService.getUserInfoById({ id });
      return res.json({
        success: true,
        data: userInfo,
      });
    } catch (error) {
      next(error);
    }
  }

  async userUpdateController(req: Request, res: Response, next: NextFunction) {
    const { email, password, profileImage, nickname } = req.body as {
      email: string;
      password: string;
      profileImage: string;
      nickname: string;
    };
    try {
      if (!req.user?.id) throw new HttpError(401, "unauthorization");
      const userId = req.user.id; // 인증 미들웨어에서 req.query id넣어주기
      const id = Number(userId);

      const unique_check = await userService.getUserInfoById({
        id,
      });
      if (!unique_check) {
        throw new HttpError(404, "해당 유저가 존재하지 않습니다");
      }
      const updatedUser = await userService.updatedUser({
        id,
        email,
        profileImage,
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
      const { page, limit } = req.query;
      const pageNum = Number(page) || 1;
      const limitNum = Number(limit) || 10;
      const take = limitNum;
      const skip = (pageNum - 1) * take;

      if (!req.user?.id) throw new HttpError(401, "unauthorization"); // 인증 미들웨어에서 req.query id넣어주기

      const vOrder = [`asc`, `desc`] as const;
      const vOrderBy = [`createdAt`, `name`] as const;
      function isOrder(value: any): value is "asc" | "desc" {
        return (vOrder as readonly string[]).includes(value);
      }

      function isOrderBy(value: any): value is "created_at" | "name" {
        return (vOrderBy as readonly string[]).includes(value);
      }

      const orderQuery = req.query.order;
      const orderByQuery = req.query.order_by;
      const order: "asc" | "desc" = isOrder(orderQuery) ? orderQuery : "asc";
      const order_by: `created_at` | `name` = isOrderBy(orderByQuery)
        ? orderByQuery
        : `created_at`;

      const userId = req.user.id;
      const projects = await userService.findUserProjects({
        skip,
        take,
        order,
        order_by,
        userId,
      });
      return res.json({
        data: projects,
        total: projects.length,
      });
    } catch (error) {
      next(error);
    }
  }

  async findUserTasksController(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { from, to, projectId, assignee, keyword, status } = req.query;

    const project_id = projectId ? Number(projectId) : undefined;
    const assigneeId = assignee ? Number(assignee) : undefined;
    const fromDate = from ? new Date(from as string) : undefined;
    const toDate = to ? new Date(to as string) : undefined;
    const keywordStr = keyword ? String(keyword) : undefined;

    const validStatus = ["todo", "in_progress", "done"] as const;
    const statusValue = validStatus.includes(status as any)
      ? (status as "todo" | "in_progress" | "done")
      : undefined;

    const filters: Prisma.TaskWhereInput = {
      ...(fromDate || toDate
        ? {
            created_at: {
              ...(fromDate ? { gte: fromDate } : {}),
              ...(toDate ? { lte: toDate } : {}),
            },
          }
        : {}),
      ...(assigneeId ? { member_id: assigneeId } : {}),
      ...(project_id ? { project_id } : {}),
      ...(keywordStr
        ? { title: { contains: keywordStr, mode: "insensitive" } }
        : {}),
      ...(statusValue ? { task_status: statusValue } : {}),
    };
    if (!req.user) throw new HttpError(401, "unauthorization");
    // 인증 미들웨어에서 req.user id넣어주기

    const userId = req.user.id;
    if (!userId) throw new HttpError(401, "unauthorization");

    try {
      const raw_ProjectId = req.query.project_id;
      if (!raw_ProjectId || isNaN(Number(raw_ProjectId))) {
        throw new HttpError(404, "Bad request");
      }
      const projectId = Number(raw_ProjectId);
      const validatedProject = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!validatedProject) {
        throw new HttpError(404, "존재하지 않는 task 입니다");
      }
      const result = await userService.findUserTasks({
        user_id: userId,
        ...filters,
      });
      return res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}
