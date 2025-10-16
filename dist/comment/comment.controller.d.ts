import { Request, Response, NextFunction } from "express";
export default class CommentController {
    createComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    getCommentsByTaskId(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateComment(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteComment(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=comment.controller.d.ts.map