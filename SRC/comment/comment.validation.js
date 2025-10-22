import { z } from "zod";
// 댓글 생성 스키마
const createCommentSchema = z.object({
    content: z.string().min(1, "Content is required"),
    user_id: z.number().int().positive(), // TODO: 인증 미들웨어 구현 후 제거
});
// 댓글 수정 스키마
const updateCommentSchema = z.object({
    content: z.string().min(1, "Content is required"),
    user_id: z.number().int().positive(), // TODO: 인증 미들웨어 구현 후 제거
});
// 댓글 생성 유효성 검사 미들웨어
export const validateCreateComment = (req, res, next) => {
    try {
        createCommentSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.issues,
            });
        }
        else {
            next(error);
        }
    }
};
// 댓글 수정 유효성 검사 미들웨어
export const validateUpdateComment = (req, res, next) => {
    try {
        updateCommentSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.issues,
            });
        }
        else {
            next(error);
        }
    }
};
