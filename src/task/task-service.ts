import { TaskRepository } from "./task-repository.js";
import {
  TaskBodyDto,
  TaskResponseDto,
  AssigneeDto,
  TaskStatusType,
  TaskQueryDto,
  TaskListResponseDto,
  UpdateTaskBodyDto,
} from "./task-dto.js";
import {
  PrismaClient,
  Prisma,
  Task,
  Member,
  User,
  Tag,
  Attachment,
} from "@prisma/client"; // prisma 추후 레포지토리 계층에서만 사용할 수 있도록 리팩토링 하는게 좋을 것 같음. (관심사 분리)

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

type RawTaskData = Task & {
  members: Member & { users: User };
  tags: Tag[];
  attachments: Attachment[];
  projects?: { members: Member[] }; // getTaskById에서만 사용됨
};

export class TaskService {
  constructor(
    private taskRepository: TaskRepository,
    private prisma: PrismaClient
  ) {}

  /**
   * 레포지토리에서 받은 Raw Task 데이터를 TaskResponseDto로 변환 (포맷팅)
   * @param rawTaskData 변환할 Raw 데이터
   * @returns TaskResponseDto
   */
  private _transformTaskToDto(rawTaskData: RawTaskData): TaskResponseDto {
    const assigneeUser = rawTaskData.members.users;
    const assignee: AssigneeDto | null = assigneeUser
      ? {
          id: assigneeUser.id,
          name: assigneeUser.nickname, // DTO는 name: string | null 임
          email: assigneeUser.email,
          profileImage: assigneeUser.profileImage, // DTO는 profileImage: string | null 임
        }
      : null;

    return {
      id: rawTaskData.id,
      project_id: rawTaskData.project_id,
      title: rawTaskData.title,
      startYear: rawTaskData.start_year,
      startMonth: rawTaskData.start_month,
      startDay: rawTaskData.start_day,
      endYear: rawTaskData.end_year,
      endMonth: rawTaskData.end_month,
      endDay: rawTaskData.end_date,
      task_status: rawTaskData.task_status as TaskStatusType,
      assignee: assignee,
      tags: rawTaskData.tags,
      attachments: rawTaskData.attachments,
      createdAt: rawTaskData.created_at,
      updatedAt: rawTaskData.updated_at,
    };
  }

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
          project_id: projectId,
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

      return this._transformTaskToDto(rawTaskData);
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
          project_id: projectId,
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
        options.task_status = query.status as TaskStatusType;
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

      const taskDtos: TaskResponseDto[] = rawTasks.map((task) =>
        this._transformTaskToDto(task)
      );

      return {
        data: taskDtos,
        total: total,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * 할 일 상세 조회
   * @param userId 요청한 사용자의 ID
   * @param taskId 조회할 할 일의 ID
   * @returns 가공된 할 일의 상세 정보
   */
  getTaskById = async (
    userId: number,
    taskId: number
  ): Promise<TaskResponseDto> => {
    try {
      // 할 일 권한 검사용 데이터 조회를 위한 레포지토리 호출
      const rawTaskData = await this.taskRepository.findTaskById(taskId);

      // 할 일 존재 여부 검증
      if (!rawTaskData) {
        throw new NotFoundException("할 일을 찾을 수 없습니다.");
      }

      // 요청한 유저의 권한 검사
      const projectMembers = rawTaskData.projects.members;
      const isMember = projectMembers.some(
        (member) => member.user_id === userId
      );
      if (!isMember) {
        throw new ForbiddenException("할 일을 조회할 권한이 없습니다.");
      }

      return this._transformTaskToDto(rawTaskData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * ID로 특정 할 일의 정보를 수정
   * @param userId 요청한 사용자의 ID (권한 검사)
   * @param taskId
   * @param updateTaskBodyDto 수정할 정보
   * @returns 수정된 할 일의 상세 정보
   */
  updateTask = async (
    userId: number,
    taskId: number,
    updateTaskBodyDto: UpdateTaskBodyDto
  ): Promise<TaskResponseDto> => {
    try {
      // 검증을 위해 할 일과 프로젝트 멤버 목록 조회
      const taskData = await this.taskRepository.findTaskById(taskId);

      // 할 일 존재 여부 검증
      if (!taskData) {
        throw new NotFoundException("수정하려는 일을 찾을 수 없습니다.");
      }

      // 권한 검사를 위해 프로젝트 및 멤버 정보 존재 확인 (타입 안정성)
      if (!taskData.projects || !taskData.projects.members) {
        throw new Error("권한 검사에 필요한 프로젝트 멤버 정보가 없습니다.");
      }

      // 요청자가 프로젝트 멤버인지 검증
      const projectMembers = taskData.projects.members;
      const isRequesterMember = projectMembers.some(
        (member) => member.user_id === userId
      );
      if (!isRequesterMember) {
        throw new ForbiddenException("할 일을 수정할 권한이 없습니다.");
      }

      // DTO에 담당자 관련 정보가 있을 때 새 담당자가 유효한 멤버인지 검증
      if (updateTaskBodyDto.assigneeId !== undefined) {
        const isValidAssignee = projectMembers.some(
          (member) => member.id === updateTaskBodyDto.assigneeId
        );
        if (!isValidAssignee) {
          throw new NotFoundException( // 400 bad request 에러가 적합할 수도 있을 거 같음
            "지정하려는 담당자가 해당 프로젝트의 멤버가 아닙니다."
          );
        }
      }

      const updateRawTaskData = await this.taskRepository.updateTask(
        taskId,
        updateTaskBodyDto
      );

      // 반환값 검증
      if (!updateRawTaskData) {
        throw new Error("할 일 수정 과정에서 예기치 못한 오류가 발생했습니다.");
      }

      return this._transformTaskToDto(updateRawTaskData);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  deleteTask = async (userId: number, taskId: number): Promise<void> => {
    try {
      // 검증을 위해 할 일과 프로젝트 멤버 목록 조회
      const taskData = await this.taskRepository.findTaskById(taskId);

      // 할 일 존재 여부 검증
      if (!taskData) {
        throw new NotFoundException("삭제하려는 할 일을 찾을 수 없습니다.");
      }

      // 권한 검사를 위해 프로젝트 및 멤버 정보 존재 확인 (타입 안정성)
      if (!taskData.projects || !taskData.projects.members) {
        throw new Error("권한 검사에 필요한 프로젝트 멤버 정보가 없습니다");
      }

      // 요청자가 프로젝트 멤버인지 검증
      const projectMembers = taskData.projects.members;
      const isRequesterMember = projectMembers.some(
        (member) => member.user_id === userId
      );
      if (!isRequesterMember) {
        throw new ForbiddenException("할 일을 삭제할 권한이 없습니다");
      }

      await this.taskRepository.deleteTaskById(taskId);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  /**
   * 시작 날짜와 종료 날짜를 기준으로 할 일 상태를 결정
   * @param startYear 시작 연도
   * @param startMonth 시작 월 (1 ~ 12)
   * @param startDay 시작 일
   * @param endYear 종료 연도
   * @param endMonth 종료 월 (1 ~ 12)
   * @param endDay 종료 일
   * @returns 'todo', 'inprogress', 'done' 중 하나의 상태
   */
  determineTaskStatus = (
    startYear: number,
    startMonth: number,
    startDay: number,
    endYear: number,
    endMonth: number,
    endDay: number
  ): TaskStatusType => {
    const now = new Date();
    // 현재 날짜의 연, 월, 일 (시간은 00:00:00으로 설정하여 날짜만 비교)
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );

    // 시작 날짜 (월은 0부터 시작하므로 -1)
    const startDate = new Date(startYear, startMonth - 1, startDay);
    // 종료 날짜 (월은 0부터 시작하므로 -1)
    const endDate = new Date(endYear, endMonth - 1, endDay);

    if (currentDate < startDate) {
      return "todo"; // 현재 날짜가 시작 날짜보다 이전이면 'todo'
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return "in_progress"; // 현재 날짜가 시작 날짜와 종료 날짜 사이면 'inprogress'
    } else {
      return "done"; // 현재 날짜가 종료 날짜보다 이후면 'done'
    }
  };
}
