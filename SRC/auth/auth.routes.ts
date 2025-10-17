import express,{ Request, Response, NextFunction, RequestHandler } from "express";
import { AuthController } from "./auth.controller.js";
import { loginAuth, validateRegister } from "./auth.validation.js";
import passport  from "../lib/passport/index.js";

const authController = new AuthController();
const router = express.Router();

// POST /auth/login - 로그인
router.post("/login",
    loginAuth,
    passport.authenticate('local', { session: false }),
    async (req: Request, res: Response, next: NextFunction)=>{
    authController.loginController(req, res, next)
});
//회원가입
router.post("/register",
    validateRegister,
    passport.authenticate('google', { session: false }),
    async(req: Request, res: Response, next: NextFunction)=>{
    authController.siginupController(req, res, next)
});

export default router;
