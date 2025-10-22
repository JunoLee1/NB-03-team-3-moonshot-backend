import { z } from "zod";
// 하위 할 일 생성 스키마
const createSubtaskSchema = z.object({
    title: z.string().min(1, "Title is required"),
});
// 유효성 검사 미들웨어
export const validateCreateSubtask = (req, res, next) => {
    try {
        createSubtaskSchema.parse(req.body);
        next();
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                message: "Validation error",
                errors: error.errors,
            });
        }
        else {
            next(error);
        }
    }
};
