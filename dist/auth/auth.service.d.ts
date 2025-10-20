import type { Response } from "express";
import { AuthUserDTO } from "./auth.controller.js";
export declare class AuthService {
    findUserEmail(email: string): Promise<AuthUserDTO | null>;
    findUniqueNickname(nickname: string): Promise<AuthUserDTO | null>;
    loginService({ email }: AuthUserDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createNewUser({ email, password, nickname, image }: AuthUserDTO): Promise<AuthUserDTO>;
    verifyAccessToken(token: string): {
        userId: string | (() => string) | undefined;
    };
    verifyRefreshToken(token: string): {
        userId: string | (() => string) | undefined;
    };
    clearTokenCookies(res: Response): void;
}
//# sourceMappingURL=auth.service.d.ts.map