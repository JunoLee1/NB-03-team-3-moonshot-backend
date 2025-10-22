import { Router } from "express";
import SubtaskController from "./subtask.controller.js";
import { validateCreateSubtask, } from "./subtask.validation.js";
const router = Router();
const subtaskController = new SubtaskController();
// 생성
router.post("/tasks/:taskId/subtasks", validateCreateSubtask, subtaskController.createSubtask.bind(subtaskController));
// 조회
router.get("/tasks/:taskId/subtasks", subtaskController.getSubtasksByTaskId.bind(subtaskController));
// 수정
router.patch("/subtasks/:id/status", subtaskController.toggleSubtaskStatus.bind(subtaskController));
// 삭제
router.delete("/subtasks/:id", subtaskController.deleteSubtask.bind(subtaskController));
export default router;
