import express  from "express";
import { ProjectController } from "./project-controller.js";
// 추후 인증 및 필요한 미들웨어 추가예정

const projectRouter = (
    projectController: ProjectController,
    // 미들웨어 추가
) => {
    const router = express.Router();

    router
        .route('/')
        .post(
            // 미들웨어 추가 가능
            projectController.createProject,
        );

    router
        .route('/:projectId')
        .get(
            projectController.getProjectById,
        )
        return router;
};