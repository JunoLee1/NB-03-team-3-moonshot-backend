import { PrismaClient } from '@prisma/client';
import { CreateProjectDto, ProjectResponseDto } from './project-dto.js';
export declare class ProjectRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * @param userId 프로젝트를 생성한 유저의 ID
     * @param CreateProjectDto 프로젝트의 이름과 설명
     * @returns 생성된 프로젝트 정보와 카운트 값
     */
    createProject: (userId: number, createProjectDto: CreateProjectDto) => Promise<ProjectResponseDto>;
}
//# sourceMappingURL=project-repository.d.ts.map