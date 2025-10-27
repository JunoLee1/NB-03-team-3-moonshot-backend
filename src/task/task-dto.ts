import { Attachment, Task } from "@prisma/client";
// 할 일의 Status 타입 정의
export type TaskStatusType = "todo" | "inprogress" | "done";

// 할 일 생성 및 수정 시 사용될 request body DTO
export interface TaskBodyDto {
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  taskStatus: TaskStatusType;
  tags: string[];
  attachments: string[];
}

// 응답을 위한 DTO들

// 할 일 담당자 정보 DTO
export interface AssigneeDto {
  id: number;
  name: string | null;
  email: string;
  profileImage: string | null;
}

// 할 일 태그 정보 DTO
export interface TagDto {
  id: number;
  name: string | null; // prisma schema에 name이 nullable
}

// 할 일 첨부파일 DTO
export interface AttachmentDto {
  id: number;
  url: string | null; // 이것도 스키마에서 옵셔널
}

// 할 일 생성, 조회, 수정 시 사용될 최종 response DTO
export interface TaskResponseDto {
  id: number;
  projectId: number;
  title: string;
  startYear: number;
  startMonth: number;
  startDay: number;
  endYear: number;
  endMonth: number;
  endDay: number;
  taskStatus: TaskStatusType;
  assignee: AssigneeDto | null; // 담당자 수정을 위함
  tags: TagDto[];
  attachments: AttachmentDto[];
  createdAt: Date;
  updatedAt: Date;
}

// 할 일 목록 조회 시 사용하는 쿼리 파라미터 DTO

export interface TaskQueryDto {
  page?: number;
  limit?: number;
  taskStatus?: TaskStatusType;
  assignee?: number; // 담당자의 member-id
  keyword?: string;
  order?: "asc" | "desc";
  order_by?: "created_at" | "name" | "end_date";
}

// 할 일 목록 조회 시 사용될 최종 Response DTO
export interface TaskListResponseDto {
  data: TaskResponseDto[];
  total: number;
}

// 할 일 수정 시 사용될 Request Body DTO
export interface UpdateTaskBodyDto {
  title?: string;
  startYear?: number;
  startMonth?: number;
  startDay?: number;
  endYear?: number;
  endMonth?: number;
  endDay?: number;
  taskStatus?: TaskStatusType;
  assigneeId?: number; // 담당자 변경을 위한 필드
  tags?: string[];
  attachments?: string[];
}
