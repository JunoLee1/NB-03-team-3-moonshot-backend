import express,{ Request, Response, NextFunction } from "express";
import HttpError from "../lib/httpError.js";
import { AuthController } from "./auth.controller.js";
import bcrypt from "bcrypt";

const authController = new AuthController();
const router = express.Router();

// POST /auth/login - 로그인
router.post("/login",async (req: Request, res: Response, next: NextFunction)=>{
    authController.loginController(req, res, next)
});
//회원가입

export default router;
