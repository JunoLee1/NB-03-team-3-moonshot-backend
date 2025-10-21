import { TaskRepository } from "./task-repository.js";
import { TaskBodyDto, TaskResponseDto, TaskListResponseDto } from "./task-dto.js";
import { PrismaClient } from "@prisma/client";
export declare class TaskService {
    private taskRepository;
    private prisma;
    constructor(taskRepository: TaskRepository, prisma: PrismaClient);
    /**
     * @param userId 할 일을 생성하려는 사용자의 ID
     * @param projectId 할 일을 추가할 프로젝트의 ID
     * @param taskBodyDto 생성할 할 일의 정보
     * @returns 생성된 할 일 상세 정보 (DTO)
     */
    createTask: (userId: number, projectId: number, taskBodyDto: TaskBodyDto) => Promise<TaskResponseDto>;
    /**
     * @param userId 요청한 사용자의 ID
     * @param projectId 조회할 프로젝트의 ID
     * @param query 컨트로럴에서 받은 req.query 객체
     * @returns { data: TaskResponseDto[], total: number }
     */
    getTasks: (userId: number, projectId: number, query: any) => Promise<TaskListResponseDto>;
}
//# sourceMappingURL=task-service.d.ts.map