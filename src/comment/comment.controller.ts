import { Request, Response, NextFunction } from "express";
import CommentService from "./comment.service.js";
import HttpError from "../lib/httpError.js";

const commentService = new CommentService();

export default class CommentController {
  // POST /tasks/:taskId/comments - 댓글 생성
  async createComment(req: Request, res: Response, next: NextFunction) {
    try {
      const task_id = Number(req.params.taskId);

      const user_id = Number(req.user?.id)

      if (!user_id) throw new Error("Invalid user_id");

     
      const { content } = req.body;

      const comment = await commentService.createComment({
        content,
        task_id,
        user_id,
      });
    
      res.status(201).json(comment);
    } catch (error) {
      next(error);
    }
  }

  // GET /tasks/:taskId/comments - 댓글 목록 조회
  async getCommentsByTaskId(req: Request, res: Response, next: NextFunction) {
    try {
      if(!req.user) throw new HttpError(401, "unathurized")
  
      const task_id = Number(req.params.taskId );
  
      const user_id = Number(req.user.id);

      const comments = await commentService.getCommentsByTaskId(task_id, user_id);
    
      res.status(200).json(comments);
    } catch (error) {
      next(error);
    }
  }

  // PATCH /comments/:commentId - 댓글 수정
  async updateComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment_id = Number(req.params.commentId );
      const { content } = req.body;
  
      const user_id = Number(req.user?.id)

      const comment = await commentService.updateComment(comment_id, user_id, { content });

      res.status(200).json(comment);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /comments/:commentId - 댓글 삭제
  async deleteComment(req: Request, res: Response, next: NextFunction) {
    try {
      const comment_id = Number(req.params.commentId);
      
      const user_id = Number(req.user?.id)

      const result = await commentService.deleteComment(comment_id, user_id);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
