import { Request, Response, NextFunction } from "express";
import { TaskService } from "./task-service.js";
import { TaskBodyDto, UpdateTaskBodyDto } from "./task-dto.js";

export class TaskController {
  constructor(private taskService: TaskService) {}

  createTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 인증된 사용자 ID 가져오기
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      // 경로 파라미터 가져오기 및 검증
      const { projectId: projectIdParam } = req.params;
      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트의 아이디는 숫자여야 합니다."); // 추후 BadRequestException 같은 커스텀 에러 사용이 좋을 거 같음
      }

      // Request Body 데이터 가져오기
      const taskBodyDto: TaskBodyDto = req.body;

      // Body 유효성 검사, 추후 zod 같은 미들웨어가 좋을 거 같음
      if (!taskBodyDto.title || !taskBodyDto.taskStatus) {
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

  getTasks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 인증된 사용자 ID 가져오기
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      // URL 경로 파라미터 가져오기 및 검증
      const { projectId: projectIdParam } = req.params;
      const projectId = Number(projectIdParam);
      if (Number.isNaN(projectId)) {
        throw new Error("프로젝트 ID는 숫자여야 합니다.");
      }

      // Request Query 데이터 가져오기
      const query = req.query;

      const tasksResponse = await this.taskService.getTasks(
        userId,
        projectId,
        query
      );

      return res.status(200).json(tasksResponse);
    } catch (error) {
      next(error);
    }
  };

  getTaskById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 인증된 사용자 ID 가져오기
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      //경로 파라미터 가져오기 및 검증
      const { taskId: taskIdParam } = req.params;
      const taskId = Number(taskIdParam);
      if (Number.isNaN(taskId)) {
        throw new Error("할 일 ID는 숫자여야 합니다."); // 추후 BadRequestException
      }

      const taskDetails = await this.taskService.getTaskById(userId, taskId);

      return res.status(200).json(taskDetails);
    } catch (error) {
      // 5. 에러 처리 미들웨어로 전달
      next(error);
    }
  };

  updateTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      const { taskId: taskIdParam } = req.params;
      const taskId = Number(taskIdParam);
      if (Number.isNaN(taskId)) {
        throw new Error("할 일 ID는 숫자여야 합니다.");
      }

      const updateTaskBodyDto: UpdateTaskBodyDto = req.body;

      // 추후 미들웨어로 대체 가능, 빈 객체가 들어오는 것을 막고자 함
      if (Object.keys(updateTaskBodyDto).length === 0) {
        throw new Error("수정할 내용을 포함하여 요청해야 합니다.");
      }

      const updatedTask = await this.taskService.updateTask(
        userId,
        taskId,
        updateTaskBodyDto
      );

      return res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  };

  deleteTask = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.user.id) {
        throw new Error("사용자 인증 정보가 없습니다.");
      }
      const userId = req.user.id;

      const { taskId: taskIdParam } = req.params;
      const taskId = Number(taskIdParam);
      if (Number.isNaN(taskId)) {
        throw new Error("할 일 ID는 숫자여야 합니다.");
      }

      await this.taskService.deleteTask(userId, taskId);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
