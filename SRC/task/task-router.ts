import express from "express";
import { TaskController } from "./task-controller.js";
// 추후 인증 미들웨어 import

const taskRouter = (taskController: TaskController) => {
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

export default taskRouter;
