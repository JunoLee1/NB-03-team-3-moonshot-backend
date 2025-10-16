import type { Request, Response, NextFunction } from "express";
export interface IUserDTO {
    id: number;
    nickname: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export default class UserController {
    findDuplicateUserController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    userInfoController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    userUpdateController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    findUsedrProjectsController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.controller.d.ts.map