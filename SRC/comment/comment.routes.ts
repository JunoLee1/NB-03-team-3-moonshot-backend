import { Router } from "express";
import CommentController from "./comment.controller.js";
import { validateCreateComment, validateUpdateComment } from "./comment.validation.js";

const router = Router();
const commentController = new CommentController();

// POST /api/tasks/:taskId/comments - 댓글 생성
router.post(
  "/tasks/:taskId/comments",
  validateCreateComment,
  commentController.createComment.bind(commentController)
);

// GET /api/tasks/:taskId/comments - 댓글 목록 조회
router.get(
  "/tasks/:taskId/comments",
  commentController.getCommentsByTaskId.bind(commentController)
);

// PATCH /api/comments/:commentId - 댓글 수정
router.patch(
  "/comments/:commentId",
  validateUpdateComment,
  commentController.updateComment.bind(commentController)
);

// DELETE /api/comments/:commentId - 댓글 삭제
router.delete(
  "/comments/:commentId",
  commentController.deleteComment.bind(commentController)
);

export default router;
