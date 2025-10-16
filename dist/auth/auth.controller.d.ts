import { Request, Response, NextFunction } from "express";
export interface IUserDTO {
    id?: number;
    email: string;
    nickname?: string;
    password?: string;
    image?: string;
}
export interface ILoginDTO {
    email: string;
    password: string;
}
export declare class AuthController {
    loginController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    siginupController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=auth.controller.d.ts.map