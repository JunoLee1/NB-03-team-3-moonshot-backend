import { z } from "zod";
// 사용자 스키마
export class userValidation {
    static userShema = z.object({
        id: z.number().int().positive().optional(),
        email: z.string().email("이메일 형식이 아닙니다"),
        password: z.string().min(6, "비밀번호는 최소 6자 이상이어야합니다"),
        nickname: z.string().min(2).max(20)
    });
    // 사용자 생성 유효성 검사 미들웨어
    static validateUser = (req, res, next) => {
        const result = this.userShema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: result.error
            });
        }
        req.validatedData = result.data;
        next();
    };
}
//# sourceMappingURL=user.validation.js.map