import { Request, Response, NextFunction } from "express";
export declare enum ProviderType {
    LOCAL = "local",
    GOOGLE = "google"
}
export interface AuthUserDTO {
    id?: number;
    email: string;
    password: string | null;
    nickname?: string | null;
    image?: string | null;
    provider?: ProviderType | null;
    providerId?: string | null;
}
export declare class AuthController {
    loginController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    logoutController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>>;
    registerController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    refreshtokenController(req: Request, res: Response, next: NextFunction): Promise<void>;
    googleCallbackController(req: Request, res: Response, next: NextFunction): Promise<void>;
    setTokenCookies(res: Response, accessToken: string, refreshToken: string): void;
    clearTokenCookie(res: Response): void;
}
//# sourceMappingURL=auth.controller.d.ts.map