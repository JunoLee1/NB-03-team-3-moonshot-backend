import { Request, Response, NextFunction } from "express";
export default class DashboardController {
    /** [GET] /dashboard/kanban */
    getKanban(req: Request, res: Response, next: NextFunction): Promise<void>;
    /** [GET] /dashboard/calendar */
    getCalendar(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map