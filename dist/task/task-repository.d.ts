import { PrismaClient } from "@prisma/client";
import { TaskBodyDto, TaskQueryDto } from "./task-dto.js";
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
            status: import("@prisma/client").$Enums.status;
            projectId: number;
            user_id: number;
            role: string | null;
            joinedAt: Date;
        };
        attachments: {
            name: string | null;
            id: number;
            url: string | null;
            task_id: number;
            uploaded_at: Date;
        }[];
        tags: {
            name: string | null;
            id: number;
            task_id: number;
        }[];
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
    }) | null>;
    /**
     * 프로젝트의 할 일 목록을 필터링, 정렬, 페이지네이션하여 조회합니다.
     * @param projectId 조회할 프로젝트의 ID
     * @param options 파싱된 쿼리 옵션 (TaskQueryDto)
     * @returns { data: task[], total: number }
     */
    getTasks: (projectId: number, options: TaskQueryDto) => Promise<{
        data: ({
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
                status: import("@prisma/client").$Enums.status;
                projectId: number;
                user_id: number;
                role: string | null;
                joinedAt: Date;
            };
            attachments: {
                name: string | null;
                id: number;
                url: string | null;
                task_id: number;
                uploaded_at: Date;
            }[];
            tags: {
                name: string | null;
                id: number;
                task_id: number;
            }[];
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
        })[];
        total: number;
    }>;
    /**
     * ID를 기준으로 할 일의 상세 정보를 조회
     * 응답 DTO 구성을 위해 담당자, 태그, 첨부파일을 포함
     * 권한 검사를 위해 할 일이 속한 프로젝트의 모든 멤버 목록을 포함
     * @param taskId 조회할 할 일의 ID
     * @returns 할 일 상세 정보 또는 null
     */
    findTaskById: (taskId: number) => Promise<({
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
            status: import("@prisma/client").$Enums.status;
            projectId: number;
            user_id: number;
            role: string | null;
            joinedAt: Date;
        };
        projects: {
            members: {
                id: number;
                status: import("@prisma/client").$Enums.status;
                projectId: number;
                user_id: number;
                role: string | null;
                joinedAt: Date;
            }[];
        } & {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
        };
        attachments: {
            name: string | null;
            id: number;
            url: string | null;
            task_id: number;
            uploaded_at: Date;
        }[];
        tags: {
            name: string | null;
            id: number;
            task_id: number;
        }[];
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
    }) | null>;
}
//# sourceMappingURL=task-repository.d.ts.map