import { Router } from "express";
import DashboardController from "./dashboard.controller.js";
import { validateKanbanQuery, validateCalendarQuery } from "./dashboard.validation.js";
const router = Router();
const dashboardController = new DashboardController();
/**
 * [GET] /api/dashboard/kanban
 * 상태별 할 일 목록 조회
 */
router.get("/kanban", validateKanbanQuery, dashboardController.getKanban.bind(dashboardController));
/**
 * [GET] /api/dashboard/calendar
 * 월별 할 일 목록 조회
 */
router.get("/calendar", validateCalendarQuery, dashboardController.getCalendar.bind(dashboardController));
export default router;
//# sourceMappingURL=dashboard.routes.js.map