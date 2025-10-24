import prisma from "./lib/prisma.js";

// 프로젝트 관련 모듈 임포트
import { ProjectRepository } from "./project/project-repository.js";
import { ProjectService } from "./project/project-service.js";
import { ProjectController } from "./project/project-controller.js";
import projectRouter from "./project/project-router.js";

// 할 일 관련 모듈 임포트
import { TaskRepository } from "./task/task-repository.js";
import { TaskService } from "./task/task-service.js";
import { TaskController } from "./task/task-controller.js";
import { nestedTaskRouter, mainTaskRouter } from "./task/task-router.js";

// 미들웨어 임포트
import { authMiddleWare } from "./middleware/authMiddle.js";

/**
 * 의존성 컨테이너
 */
class Container {
  // 단일 인스턴스 (Singletons)
  // Repository
  public readonly projectRepository: ProjectRepository;
  public readonly taskRepository: TaskRepository;

  // Service
  public readonly projectService: ProjectService;
  public readonly taskService: TaskService;

  // Controller
  public readonly projectController: ProjectController;
  public readonly taskController: TaskController;

  // Middleware
  public readonly authMiddleware: typeof authMiddleWare;

  //  생성자 (인스턴스 생성 및 주입)
  constructor() {
    // Repository 인스턴스 생성
    this.projectRepository = new ProjectRepository(prisma);
    this.taskRepository = new TaskRepository(prisma);

    // Service 인스턴스 생성
    this.projectService = new ProjectService(this.projectRepository, prisma);
    this.taskService = new TaskService(this.taskRepository, prisma);

    // Controller 인스턴스 생성
    this.projectController = new ProjectController(this.projectService);
    this.taskController = new TaskController(this.taskService);

    // Middleware 할당
    this.authMiddleware = authMiddleWare;
  }

  // 라우터 인스턴스 생성 메서드
  public getRouters() {
    // 할 일 라우터 인스턴스 생성
    const nestedTaskRouterInstance = nestedTaskRouter(
      this.taskController,
      this.authMiddleware
    );
    const mainTaskRouterInstance = mainTaskRouter(
      this.taskController,
      this.authMiddleware
    );

    // 프로젝트 라우터 인스턴스 생성
    const projectRouterInstance = projectRouter(
      this.projectController,
      nestedTaskRouterInstance,
      this.authMiddleware
    );

    return {
      projectRouterInstance,
      mainTaskRouterInstance,
    };
  }
}

const container = new Container();
export default container;
