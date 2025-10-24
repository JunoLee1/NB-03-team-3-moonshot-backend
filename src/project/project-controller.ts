import { Request, Response, NextFunction } from "express";
import { ProjectService } from "./project-service.js";
import { ProjectBodyDto, ProjectResponseDto } from "./project-dto.js";

export class ProjectController {
  constructor(private projectService: ProjectService) {}

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      // req body에 대한 유효성 검사도 별도 미들웨어로 분리하여 진행하는 것이 좋을 것 같음
      const projectBodyDto: ProjectBodyDto = req.body;

      const newProject = await this.projectService.createProject(
        userId,
        projectBodyDto
      );
      return res.status(201).json(newProject);
    } catch (error) {
      next(error);
    }
  };

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 추후 인증 미들웨어가 res.locals.user에 사용자 정보를 넣어줄 것으로 가정
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;
      const { projectId: projectIdParam } = req.params;

      const projectId = Number(projectIdParam);

      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트는 숫자여야 합니다.");
      }

      const projectDetails = await this.projectService.getProjectDetails(
        userId,
        projectId
      );

      return res.status(200).json(projectDetails);
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 사용자 ID와 경로 파라미터 가져오기
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;
      const { projectId: projectIdParam } = req.params;

      // request body 가져오기
      const projectBodyDto: ProjectBodyDto = req.body;

      // 경로 파라미터 유효성 검사
      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트 ID는 숫자여야 합니다."); // BadRequestException이라는 커스텀 에러를 만들어서 사용하는 것이 더 좋을 것 같음
      }

      // request body 유효성 검사, Zod 같은 라이브러리를 사용한 미들웨어를 통한 구현이 좋을 거 같음
      if (!projectBodyDto.name || !projectBodyDto.description) {
        throw new Error("프로젝트 이름과 설명은 필수입니다.");
      }

      const updateProject = await this.projectService.updateProject(
        userId,
        projectId,
        projectBodyDto
      );

      return res.status(200).json(updateProject);
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;
      const { projectId: projectIdParam } = req.params;

      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트 ID는 숫자여야 합니다.");
      }

      await this.projectService.deleteProject(userId, projectId);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
