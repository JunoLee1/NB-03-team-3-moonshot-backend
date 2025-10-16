import DashboardService from "./dashboard.service.js";
const dashboardService = new DashboardService();
export default class DashboardController {
    /** [GET] /dashboard/kanban */
    async getKanban(req, res, next) {
        try {
            const { projectId, memberId, keyword } = req.query;
            const data = await dashboardService.getKanbanTasks(projectId ? Number(projectId) : undefined, memberId ? Number(memberId) : undefined, keyword ? String(keyword) : undefined);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
    /** [GET] /dashboard/calendar */
    async getCalendar(req, res, next) {
        try {
            const { year, month, projectId, memberId, status, keyword } = req.query;
            const data = await dashboardService.getCalendarTasks(year ? Number(year) : undefined, month ? Number(month) : undefined, projectId ? Number(projectId) : undefined, memberId ? Number(memberId) : undefined, status ? String(status) : undefined, keyword ? String(keyword) : undefined);
            res.status(200).json({ success: true, data });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=dashboard.controller.js.map