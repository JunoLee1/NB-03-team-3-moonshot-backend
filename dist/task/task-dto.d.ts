export type TaskStatusType = "todo" | "inprogress" | "done";
export interface TaskBodyDto {
    title: string;
    startYear: number;
    startMonth: number;
    startDay: number;
    endYear: number;
    endMonth: number;
    endDay: number;
    status: TaskStatusType;
    tags: string[];
    attachments: string[];
}
export interface AssigneeDto {
    id: number;
    name: string | null;
    email: string;
    profileImage: string | null;
}
export interface TagDto {
    id: number;
    name: string | null;
}
export interface AttachmentDto {
    id: number;
    url: string | null;
}
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
    status: TaskStatusType;
    assignee: AssigneeDto | null;
    tags: TagDto[];
    attachments: AttachmentDto[];
    createdAt: Date;
    updatedAt: Date;
}
export interface TaskQueryDto {
    page?: number;
    limit?: number;
    status?: TaskStatusType;
    assignee?: number;
    keyword?: string;
    order?: "asc" | "desc";
    order_by?: "created_at" | "name" | "end_date";
}
export interface TaskListResponseDto {
    data: TaskResponseDto[];
    total: number;
}
//# sourceMappingURL=task-dto.d.ts.map