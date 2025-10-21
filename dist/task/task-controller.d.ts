import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task-service.js";
export declare class TaskController {
    private taskService;
    constructor(taskService: TaskService);
    createTask: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    getTasks: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=task-controller.d.ts.map