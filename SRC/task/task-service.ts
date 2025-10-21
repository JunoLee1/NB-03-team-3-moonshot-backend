import { TaskRepository } from "./task-repository.js";
import {
  TaskBodyDto,
  TaskResponseDto,
  AssigneeDto,
  TaskStatusType,
  TaskQueryDto,
  TaskListResponseDto,
} from "./task-dto.js";
import { PrismaClient, Task } from "@prisma/client"; // prisma 추후 레포지토리 계층에서만 사용할 수 있도록 리팩토링 하는게 좋을 것 같음. (관심사 분리)

// 추후 별도 에러 파일로 분리하는 것이 좋을 거 같음
class ForbiddenException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ForbiddenException";
  }
}

class NotFoundException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
  }
}

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * @param userId 할 일을 생성하려는 사용자의 ID
   * @param projectId 할 일을 추가할 프로젝트의 ID
   * @param taskBodyDto 생성할 할 일의 정보
   * @returns 생성된 할 일 상세 정보 (DTO)
   */
  createTask = async (
    userId: number,
    projectId: number,
    taskBodyDto: TaskBodyDto
  ): Promise<TaskResponseDto> => {
    try {
      // 요청한 유저가 프로젝트의 멤버인지 확인
      const member = await this.prisma.member.findFirst({
        where: {
          user_id: userId,
          projectId: projectId,
        },
      });

      // 멤버가 아니면 에러 발생
      if (!member) {
        throw new ForbiddenException(
          "할 일을 생성할 권한이 없습니다. 프로젝트의 멤버가 아닙니다."
        );
      }

      // member id를 사용하여 레포지토리 호출, member.id가 담당자가 됨
      const rawTaskData = await this.taskRepository.createTask(
        member.id,
        projectId,
        taskBodyDto
      );

      // null 반환 값 검증
      if (!rawTaskData) {
        throw new Error("할 일 생성 후 데이터 조회하는데 실패했습니다.");
      }

      // 반환받은 레포지토리 데이터를 최종 응답 형태에 맞게 가공
      const assigneeUser = rawTaskData.members.users;

      const assignee: AssigneeDto | null = assigneeUser
        ? {
            id: assigneeUser.id,
            name: assigneeUser.nickname,
            email: assigneeUser.email,
            profileImage: assigneeUser.image,
          }
        : null;

      return {
        id: rawTaskData.id,
        projectId: rawTaskData.project_id,
        title: rawTaskData.title,
        startYear: rawTaskData.start_year,
        startMonth: rawTaskData.start_month,
        startDay: rawTaskData.start_day,
        endYear: rawTaskData.end_year,
        endMonth: rawTaskData.end_month,
        endDay: rawTaskData.end_date,
        status: rawTaskData.taskStatus as TaskStatusType,
        assignee: assignee,
        tags: rawTaskData.tags,
        attachments: rawTaskData.attachments,
        createdAt: rawTaskData.createdAt,
        updatedAt: rawTaskData.updatedAt,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * @param userId 요청한 사용자의 ID
   * @param projectId 조회할 프로젝트의 ID
   * @param query 컨트로럴에서 받은 req.query 객체
   * @returns { data: TaskResponseDto[], total: number }
   */
  getTasks = async (
    userId: number,
    projectId: number,
    query: any
  ): Promise<TaskListResponseDto> => {
    try {
      // 요청한 유저가 이 프로젝트의 멤버인지 확인
      const member = await this.prisma.member.findFirst({
        where: {
          user_id: userId,
          projectId: projectId,
        },
      });

      if (!member) {
        throw new ForbiddenException(
          "할 일 목록을 조회할 권한이 없습니다. 프로젝트 멤버가 아닙니다."
        );
      }

      // 쿼리 파라미터 파싱 및 타입 변환, 기본값 우선 정의
      const options: TaskQueryDto = {
        page: query.page ? parseInt(String(query.page), 10) : 1,
        limit: query.limit ? parseInt(String(query.limit), 10) : 10,
        order: query.order ? (query.order as "asc" | "desc") : "desc",
        order_by: query.order_by
          ? (query.order_by as "created_at" | "name" | "end_date")
          : "created_at",
      };

      // 값이 존재하면 객체에 속성 추가
      if (query.status) {
        options.status = query.status as TaskStatusType;
      }
      if (query.assignee) {
        options.assignee = parseInt(String(query.assignee), 10);
      }
      if (query.keyword) {
        options.keyword = String(query.keyword);
      }

      // 파싱된 숫자 유효성 검사
      if (
        Number.isNaN(options.page) ||
        Number.isNaN(options.limit) ||
        (options.assignee && Number.isNaN(options.assignee))
      ) {
        throw new Error("page와 limit는 숫자여야 합니다."); // 추후 커스텀 에러 적용이 좋을 거 같음
      }

      const { data: rawTasks, total } = await this.taskRepository.getTasks(
        projectId,
        options
      );

      // 데이터 가공, createTasks 메서드의 변환로직과 중복, 추후 다른 메서드로 분리하면 좋을 거 같음
      const taskDtos: TaskResponseDto[] = rawTasks.map((task) => {
        const assigneeUser = task.members.users;
        const assignee: AssigneeDto | null = assigneeUser
          ? {
              id: assigneeUser.id,
              name: assigneeUser.nickname,
              email: assigneeUser.email,
              profileImage: assigneeUser.image,
            }
          : null;

        return {
          id: task.id,
          projectId: task.project_id,
          title: task.title,
          startYear: task.start_year,
          startMonth: task.start_month,
          startDay: task.start_day,
          endYear: task.end_year,
          endMonth: task.end_month,
          endDay: task.end_date,
          status: task.taskStatus as TaskStatusType,
          assignee: assignee,
          tags: task.tags,
          attachments: task.attachments,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        };
      });

      // 최종 응답 DTO 반환
      return {
        data: taskDtos,
        total: total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
