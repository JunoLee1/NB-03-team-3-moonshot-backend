import prisma from "../lib/prisma.js";
export default class DashboardService {
    /** [1] 칸반용 - 상태별 할 일 조회 */
    async getKanbanTasks(projectId, memberId, keyword) {
        const tasks = await prisma.task.findMany({
            where: {
                ...(projectId ? { project_id: projectId } : {}),
                ...(memberId ? { member_id: memberId } : {}),
                ...(keyword
                    ? { title: { contains: keyword, mode: "insensitive" } }
                    : {}),
            },
            orderBy: { taskStatus: "asc" },
            include: {
                projects: { select: { id: true, name: true } },
                members: { select: { id: true, role: true } },
            },
        });
        // 상태별 그룹화
        return tasks.reduce((acc, task) => {
            const status = task.taskStatus ?? "todo";
            if (!acc[status])
                acc[status] = [];
            acc[status].push(task);
            return acc;
        }, { todo: [], inprogress: [], done: [] });
    }
    /** [2] 캘린더용 - 월별 할 일 조회 */
    async getCalendarTasks(year, month, projectId, memberId, status, keyword) {
        const targetYear = year ?? new Date().getFullYear();
        const targetMonth = month ?? new Date().getMonth() + 1;
        const tasks = await prisma.task.findMany({
            where: {
                start_year: targetYear,
                start_month: targetMonth,
                ...(projectId ? { project_id: projectId } : {}),
                ...(memberId ? { member_id: memberId } : {}),
                ...(status ? { taskStatus: status } : {}),
                ...(keyword
                    ? { title: { contains: keyword, mode: "insensitive" } }
                    : {}),
            },
            orderBy: [{ start_day: "asc" }, { taskStatus: "asc" }],
            include: {
                projects: { select: { id: true, name: true } },
                members: { select: { id: true, role: true } },
            },
        });
        return tasks;
    }
}
//# sourceMappingURL=dashboard.service.js.map