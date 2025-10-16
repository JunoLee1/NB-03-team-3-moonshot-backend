import { Request, Response, NextFunction } from 'express';
import { ProjectService } from './project-service.js';
import { CreateProjectDto, ProjectResponseDto } from './project-dto.js';

export class ProjectController {
    constructor(
        private projectService: ProjectService,
    ) {}

    createProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // 추후 인증 미들웨어가 res.locals.user에 사용자 정보를 넣어줄 것으로 가정
            const userId = res.locals.user.id;

            // req body에 대한 유효성 검사도 별도 미들웨어로 분리하여 진행하는 것이 좋을 것 같음
            const createProjectDto: CreateProjectDto = req.body;

            const newProject = await this.projectService.createProject(
                userId,
                createProjectDto,
            );
            return res.status(201).json(newProject);
        } catch(error) {
            next(error);
        }
    }
}