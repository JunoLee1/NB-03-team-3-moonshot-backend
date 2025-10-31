import { Router } from "express";
import CommentController from "./comment.controller.js";
import type { Request, Response, NextFunction } from "express";
import { validateCreateComment, validateUpdateComment } from "./comment.validation.js";
import { authMiddleWare } from "../middleware/authMiddle.js";
const router = Router();
const commentController = new CommentController();

// POST /tasks/:taskId/comments - 댓글 생성
router.post(
  "/tasks/:taskId/comments",
  validateCreateComment,
  authMiddleWare,
  (req:Request, res:Response, next : NextFunction) =>{
    console.log(req.body)
    next()
  },
  commentController.createComment.bind(commentController)
);

// GET /tasks/:taskId/comments - 댓글 목록 조회
router.get(
  "/tasks/:taskId/comments",
  authMiddleWare,
  commentController.getCommentsByTaskId.bind(commentController)
);

// PATCH /comments/:commentId - 댓글 수정
router.patch(
  "/comments/:commentId",
  validateUpdateComment,
  authMiddleWare,
  commentController.updateComment.bind(commentController)
);

// DELETE /comments/:commentId - 댓글 삭제
router.delete(
  "/comments/:commentId",
  authMiddleWare,
  commentController.deleteComment.bind(commentController)
);

export default router;
