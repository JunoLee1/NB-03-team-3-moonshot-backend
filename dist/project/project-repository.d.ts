import { PrismaClient } from "@prisma/client";
import { ProjectBodyDto, ProjectResponseDto } from "./project-dto.js";
export declare class ProjectRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * @param userId 프로젝트를 생성한 유저의 ID
     * @param CreateProjectDto 프로젝트의 이름과 설명
     * @returns 생성된 프로젝트 정보와 카운트 값
     */
    createProject: (userId: number, projectBodyDto: ProjectBodyDto) => Promise<ProjectResponseDto>;
    /**
     * id를 기준으로 프로젝트와 관련된 멤버 및 할 일 목록을 조회함. 응답 객체 구성을 위함
     * @param projectId 조회할 프로젝트의 id
     * @returns 프로젝트 정보 또는 null
     */
    findProjectById: (projectId: number) => Promise<({
        tasks: {
            taskStatus: import("@prisma/client").$Enums.Status;
        }[];
        members: {
            id: number;
            user_id: number;
            status: import("@prisma/client").$Enums.status;
            role: string | null;
            joinedAt: Date;
            projectId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }) | null>;
    /**
     * id를 기준으로 프로젝트의 이름과 설명을 수정하고, 수정된 프로젝트의 상세 정보 반환
     * @param projectId 수정할 프로젝트의 ID
     * @param data 수정할 정보 {name, description}
     * @returns 수정된 프로젝트의 상세 정보 또는 null
     */
    updateProject: (projectId: number, projectBodyDto: ProjectBodyDto) => Promise<({
        tasks: {
            taskStatus: import("@prisma/client").$Enums.Status;
        }[];
        members: {
            id: number;
            user_id: number;
            status: import("@prisma/client").$Enums.status;
            role: string | null;
            joinedAt: Date;
            projectId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }) | null>;
    /**
     * @param projectId 삭제할 프로젝트의 ID
     */
    deleteProjectById: (projectId: number) => Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string;
    }>;
}
//# sourceMappingURL=project-repository.d.ts.map