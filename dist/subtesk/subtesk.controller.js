import SubtaskService from "./subtask.service.js";
const subtaskService = new SubtaskService();
export default class SubtaskController {
    // 생성
    async createSubtask(req, res, next) {
        try {
            const task_id = parseInt(req.params.taskId);
            const { title } = req.body;
            const subtask = await subtaskService.createSubtask({
                task_id,
                title,
            });
            res.status(201).json(subtask);
        }
        catch (error) {
            next(error);
        }
    }
    // 조회
    async getSubtasksByTaskId(req, res, next) {
        try {
            const task_id = parseInt(req.params.taskId);
            const subtasks = await subtaskService.getSubtasksByTaskId(task_id);
            res.status(200).json(subtasks);
        }
        catch (error) {
            next(error);
        }
    }
    // 수정
    async toggleSubtaskStatus(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updatedSubtask = await subtaskService.toggleSubtaskStatus(id);
            res.status(200).json(updatedSubtask);
        }
        catch (error) {
            next(error);
        }
    }
    // 삭제
    async deleteSubtask(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const result = await subtaskService.deleteSubtask(id);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=subtesk.controller.js.map