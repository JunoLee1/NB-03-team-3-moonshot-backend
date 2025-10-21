import { PrismaClient } from "@prisma/client";
import { TaskBodyDto } from "./task-dto.js";
export declare class TaskRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * 프로젝트에 새로운 할 일 생성 및 관련 태그와 첨부팡일을 함께 생성
     * @param memberId 할 일을 생성한 멤버의 ID(담당자)
     * @param projectId 할 일이 속한 프로젝트의 ID
     * @param taskBodyDto 생성할 할 일의 정보
     * @returns 생성된 할 일의 상세 정보
     */
    createTask: (memberId: number, projectId: number, taskBodyDto: TaskBodyDto) => Promise<({
        members: {
            users: {
                id: number;
                email: string;
                nickname: string | null;
                password: string | null;
                createdAt: Date;
                updatedAt: Date;
                image: string | null;
                provider: string | null;
                providerId: string | null;
            };
        } & {
            id: number;
            user_id: number;
            status: import("@prisma/client").$Enums.status;
            role: string | null;
            joinedAt: Date;
            projectId: number;
        };
        attachments: {
            id: number;
            name: string | null;
            task_id: number;
            url: string | null;
            uploaded_at: Date;
        }[];
        tags: {
            id: number;
            name: string | null;
            task_id: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        content: string;
        start_year: number;
        start_month: number;
        start_day: number;
        end_year: number;
        end_month: number;
        end_date: number;
        taskStatus: import("@prisma/client").$Enums.Status;
        user_id: number;
        project_id: number;
        member_id: number;
    }) | null>;
}
//# sourceMappingURL=task-repository.d.ts.map