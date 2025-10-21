import express, { Router } from "express";
import { ProjectController } from "./project-controller.js";
// 추후 인증 및 필요한 미들웨어 추가예정

const projectRouter = (
  projectController: ProjectController,
  nestedTaskRouter: Router
  // 미들웨어 추가
) => {
  const router = express.Router();

  router.route("/").post(
    // 미들웨어 추가 가능
    projectController.createProject
  );

  router
    .route("/:projectId") // authMiddleware 추가 필요
    .get(projectController.getProjectById)
    .patch(projectController.updateProject)
    .delete(projectController.deleteProject);

  // /:projectId/tasks 경로로 들어오는 요청은 할 일 생성 및 할 일 목록 조회임
  // 주입받은 taskRouter가 처리할 수 있도록 연결
  router.use("/:projectId/tasks", nestedTaskRouter);

  return router;
};

export default projectRouter;
