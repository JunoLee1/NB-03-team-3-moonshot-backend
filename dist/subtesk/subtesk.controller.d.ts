import { Request, Response, NextFunction } from "express";
export default class SubtaskController {
    createSubtask(req: Request, res: Response, next: NextFunction): Promise<void>;
    getSubtasksByTaskId(req: Request, res: Response, next: NextFunction): Promise<void>;
    toggleSubtaskStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    deleteSubtask(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=subtesk.controller.d.ts.map