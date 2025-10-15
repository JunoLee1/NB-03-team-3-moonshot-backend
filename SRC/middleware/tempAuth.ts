import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        nickname: string;
        role: string;
      };
    }
  }
}

export function tempAuth(req: Request, res: Response, next: NextFunction) {
    req.user = {
         id: 1, email: "test@example.com", nickname: "TestUser",role: "admin"
        }; // 임시 사용자 정보
    console.log("✅ Temp auth applied:", req.user);
  next();
}
