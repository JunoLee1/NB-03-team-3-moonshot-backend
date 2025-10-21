import type { Request, Response, NextFunction } from "express";
export default class UserController {
    userInfoController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    userUpdateController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    findUsedrProjectsController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
    findUserTasksController(req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=user.controller.d.ts.map