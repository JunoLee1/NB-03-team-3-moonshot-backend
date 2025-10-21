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
    name: string;
    email: string;
    profileImage: string;
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
//# sourceMappingURL=task-dto.d.ts.map