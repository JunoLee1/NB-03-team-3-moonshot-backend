export interface CreateSubtaskDTO {
    title: string;
    task_id: number;
}
export default class SubtaskService {
    createSubtask({ title, task_id }: CreateSubtaskDTO): Promise<any>;
    getSubtasksByTaskId(task_id: number): Promise<any>;
    toggleSubtaskStatus(id: number): Promise<any>;
    deleteSubtask(id: number): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=subtesk.service.d.ts.map