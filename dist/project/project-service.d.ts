import { ProjectRepository } from './project-repository.js';
import { CreateProjectDto, ProjectResponseDto } from './project-dto.js';
import { PrismaClient } from '@prisma/client';
export declare class ProjectService {
    private projectRepository;
    private prisma;
    constructor(projectRepository: ProjectRepository, prisma: PrismaClient);
    createProject: (userId: number, createProjectDto: CreateProjectDto) => Promise<ProjectResponseDto>;
}
//# sourceMappingURL=project-service.d.ts.map