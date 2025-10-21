import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task-service.js";
import { TaskBodyDto } from "./task-dto.js";

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 인증된 사용자 ID 가져오기
      const userId = res.locals.user.id;

      // 경로 파라미터 가져오기 및 검증
      const { projectId: projectIdParam } = req.params;
      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트의 아이디는 숫자여야 합니다."); // 추후 BadRequestException 같은 커스텀 에러 사용이 좋을 거 같음
      }

      // Request Body 데이터 가져오기
      const taskBodyDto: TaskBodyDto = req.body;

      // Body 유효성 검사, 추후 zod 같은 미들웨어가 좋을 거 같음
      if (!taskBodyDto.title || !taskBodyDto.status) {
        throw new Error("할 일 제목과 상태는 필수입니다.");
      }

      // 서비스 레이어 호출
      const newTask = await this.taskService.createTask(
        userId,
        projectId,
        taskBodyDto
      );

      return res.status(201).json(newTask);
    } catch (error) {
      next(error);
    }
  };
}
