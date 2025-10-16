import express from "express";
// 추후 인증 및 필요한 미들웨어 추가예정
const projectRouter = (projectController) => {
    const router = express.Router();
    router
        .route('/')
        .post(
    // 미들웨어 추가 가능
    projectController.createProject);
    return router;
};
//# sourceMappingURL=project-router.js.map