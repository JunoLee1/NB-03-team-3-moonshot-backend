export interface CreateProjectDto {
    name: string;
    description: string;
}
export interface ProjectResponseDto {
    id: number;
    name: string;
    description: string;
    memberCount: number;
    todoCount: number;
    inProgressCount: number;
    doneCount: number;
}
//# sourceMappingURL=project-dto.d.ts.map