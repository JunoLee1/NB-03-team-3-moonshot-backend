import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// 칸반 조회 쿼리 스키마
const kanbanQuerySchema = z.object({
  projectId: z.string().optional(),
  memberId: z.string().optional(),
  keyword: z.string().optional(),
});

// 캘린더 조회 쿼리 스키마
const calendarQuerySchema = z.object({
  year: z.string().optional(),
  month: z.string().optional(),
  projectId: z.string().optional(),
  memberId: z.string().optional(),
  status: z.string().optional(),
  keyword: z.string().optional(),
});

// 칸반 요청 유효성 검사
export const validateKanbanQuery = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    kanbanQuerySchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
    } else {
      next(error);
    }
  }
};

// 캘린더 요청 유효성 검사
export const validateCalendarQuery = (req: Request, res: Response, next: NextFunction) => {
  try {
    calendarQuerySchema.parse(req.query);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
    } else {
      next(error);
    }
  }
};
