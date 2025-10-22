import CommentService from "./comment.service.js";
const commentService = new CommentService();
export default class CommentController {
    // POST /tasks/:taskId/comments - 댓글 생성
    async createComment(req, res, next) {
        try {
            const task_id = parseInt(req.params.taskId);
            const { content } = req.body;
            // TODO: 인증 미들웨어에서 user_id 가져오기 (현재는 임시로 body에서 받음)
            const user_id = req.body.user_id;
            const comment = await commentService.createComment({
                content,
                task_id,
                user_id,
            });
            res.status(201).json(comment);
        }
        catch (error) {
            next(error);
        }
    }
    // GET /tasks/:taskId/comments - 댓글 목록 조회
    async getCommentsByTaskId(req, res, next) {
        try {
            const task_id = parseInt(req.params.taskId);
            // TODO: 인증 미들웨어에서 user_id 가져오기
            const user_id = parseInt(req.query.user_id);
            const comments = await commentService.getCommentsByTaskId(task_id, user_id);
            res.status(200).json(comments);
        }
        catch (error) {
            next(error);
        }
    }
    // PATCH /comments/:commentId - 댓글 수정
    async updateComment(req, res, next) {
        try {
            const comment_id = parseInt(req.params.commentId);
            const { content } = req.body;
            // TODO: 인증 미들웨어에서 user_id 가져오기
            const user_id = req.body.user_id;
            const comment = await commentService.updateComment(comment_id, user_id, { content });
            res.status(200).json(comment);
        }
        catch (error) {
            next(error);
        }
    }
    // DELETE /comments/:commentId - 댓글 삭제
    async deleteComment(req, res, next) {
        try {
            const comment_id = parseInt(req.params.commentId);
            // TODO: 인증 미들웨어에서 user_id 가져오기
            const user_id = req.body.user_id;
            const result = await commentService.deleteComment(comment_id, user_id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
