import { IUserDTO, ILoginDTO } from "./auth.controller.js";
export declare class AuthService {
    findUserEmail(email: string): Promise<IUserDTO | null>;
    findUniqueNickname(nickname: string): Promise<IUserDTO | null>;
    loginService({ email }: ILoginDTO): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    createNewUser({ email, password, nickname, image }: IUserDTO): Promise<IUserDTO>;
    generateToken(userId: Number): {
        accessToken: string;
        refreshToken: string;
    };
    verifyAccessToken(token: string): {
        userId: string | (() => string) | undefined;
    };
    verifyRefreshToken(token: string): {
        userId: string | (() => string) | undefined;
    };
}
//# sourceMappingURL=auth.service.d.ts.map