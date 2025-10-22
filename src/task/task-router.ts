import express from "express";
import { TaskController } from "./task-controller.js";
import { ta } from "zod/locales";
// 추후 인증 미들웨어 import

// 프로젝트 중첩 라우터 (/projects/:projectId/tasks' 처리)
export const nestedTaskRouter = (taskController: TaskController) => {
  const router = express.Router({ mergeParams: true });

  router
    .route("/")
    .post(
      // 추후 인증 미들웨어 추가 필요
      taskController.createTask
    )
    .get(taskController.getTasks);
  return router;
};

// 메인 라우터, 중첩 라우터와 함께 app.ts에 임포트하여 다른 경로에 연결
export const mainRouter = (taskController: TaskController) => {
  const router = express.Router();

  router
    .route("/:taskId")
    .get(taskController.getTaskById)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

  return router;
};
