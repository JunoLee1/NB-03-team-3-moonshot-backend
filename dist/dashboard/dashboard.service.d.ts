export default class DashboardService {
    /** [1] 칸반용 - 상태별 할 일 조회 */
    getKanbanTasks(projectId?: number, memberId?: number, keyword?: string): Promise<Record<string, ({
        members: {
            id: number;
            role: string | null;
        };
        projects: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        project_id: number;
        title: string;
        content: string;
        start_year: number;
        start_month: number;
        start_day: number;
        end_year: number;
        end_month: number;
        end_date: number;
        taskStatus: import("@prisma/client").$Enums.Status;
        member_id: number;
    })[]>>;
    /** [2] 캘린더용 - 월별 할 일 조회 */
    getCalendarTasks(year?: number, month?: number, projectId?: number, memberId?: number, status?: string, keyword?: string): Promise<({
        members: {
            id: number;
            role: string | null;
        };
        projects: {
            name: string;
            id: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        project_id: number;
        title: string;
        content: string;
        start_year: number;
        start_month: number;
        start_day: number;
        end_year: number;
        end_month: number;
        end_date: number;
        taskStatus: import("@prisma/client").$Enums.Status;
        member_id: number;
    })[]>;
}
//# sourceMappingURL=dashboard.service.d.ts.map