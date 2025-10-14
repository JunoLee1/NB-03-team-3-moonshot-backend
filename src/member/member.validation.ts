import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// 멤버 초대 스키마
const inviteMemberSchema = z.object({
  email: z.string().email("Valid email is required"),
  user_id: z.number().int().positive(), // TODO: 인증 미들웨어 구현 후 제거
});

// 멤버 초대 유효성 검사 미들웨어
export const validateInviteMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    inviteMemberSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation error",
        errors: error.errors,
      });
    } else {
      next(error);
    }
  }
};
