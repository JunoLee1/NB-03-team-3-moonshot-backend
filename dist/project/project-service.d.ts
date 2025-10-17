import { ProjectRepository } from "./project-repository.js";
import { ProjectBodyDto, ProjectResponseDto } from "./project-dto.js";
import { PrismaClient } from "@prisma/client";
export declare class ProjectService {
    private projectRepository;
    private prisma;
    constructor(projectRepository: ProjectRepository, prisma: PrismaClient);
    createProject: (userId: number, projectBodyDto: ProjectBodyDto) => Promise<ProjectResponseDto>;
    getProjectDetails: (userId: number, projectId: number) => Promise<ProjectResponseDto>;
    /**
     * 프로젝트 정보 수정
     * @param userId 요청한 사용자의 ID
     * @param projectId 수정할 프로젝트의 ID
     * @param projectBodyDto 수정할 정보 { name, description}
     * @returns 수정된 프로젝트 상세 정보
     */
    updateProject: (userId: number, projectId: number, projectBodyDto: ProjectBodyDto) => Promise<ProjectResponseDto>;
    deleteProject: (userId: number, projectId: number) => Promise<void>;
}
//# sourceMappingURL=project-service.d.ts.map