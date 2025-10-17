import HttpError from "../lib/httpError.js";
import { AuthService } from "./auth.service.js";
import bcrypt from "bcrypt";
const authService = new AuthService();
export class AuthController {
    async loginController(req, res, next) {
        try {
            // 1. 데이터베이스에서 사용자 이메일 및 비밀번호 확인후 토큰 발급
            const { nickname: rawNickname, email: rawEmail, password: rawPassword } = req.body;
            const email = rawEmail;
            const user = await authService.findUserEmail(email);
            if (!user)
                throw new HttpError(400, " 유효한 이메일 형식이 아닙니다.");
            if (typeof rawPassword !== "string" || rawPassword.length < 6) {
                throw new HttpError(400, "비밀번호는 최소 6자 이상이어야 합니다.");
            }
            if (!user.password) {
                throw new Error("User has no password set");
            }
            const password = rawPassword;
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                throw new HttpError(401, "비밀번호가 일치하지 않습니다.");
            if (typeof rawNickname !== "string" || rawNickname.length < 3) {
                throw new HttpError(400, "닉네임은 최소 3자 이상이어야 합니다.");
            }
            const result = await authService.loginService({ email, password });
            return res.status(200).json({
                message: "성공적인 로그인",
                data: result
            });
        }
        catch (error) {
            next(error);
        }
    }
    async siginupController(req, res, next) {
        try {
            const { password: rawPassword, email: rawEmail, nickname: rawNickname } = req.body;
            const unique_email = await authService.findUserEmail(rawEmail);
            const unique_nickname = await authService.findUniqueNickname(rawNickname);
            if (!unique_email)
                throw new HttpError(400, "이미 존재하는 이메일입니다");
            if (!unique_nickname)
                throw new HttpError(400, "이미 존재하는 닉네임입니다");
            const hashedPassword = await bcrypt.hash(rawPassword, 10);
            // const [email, password, nickname] = [rawEmail,hashedPassword,rawNickname]
            const result = await authService.createNewUser({ email: rawEmail, password: hashedPassword, nickname: rawNickname });
            return res.status(201).json({
                message: "성공적인 로그인",
                ...result
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=auth.controller.js.map