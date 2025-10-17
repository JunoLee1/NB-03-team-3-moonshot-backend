import { Request, Response, NextFunction } from "express";
import SubtaskService from "./subtask.service.js";

const subtaskService = new SubtaskService();

export default class SubtaskController {
  // 생성
  async createSubtask(req: Request, res: Response, next: NextFunction) {
    try {
      const task_id = parseInt(req.params.taskId as string);
      const { title } = req.body;

      const subtask = await subtaskService.createSubtask({
        task_id,
        title,
      });

      res.status(201).json(subtask);
    } catch (error) {
      next(error);
    }
  }

  // 조회
  async getSubtasksByTaskId(req: Request, res: Response, next: NextFunction) {
    try {
      const task_id = parseInt(req.params.taskId as string);
      const subtasks = await subtaskService.getSubtasksByTaskId(task_id);
      res.status(200).json(subtasks);
    } catch (error) {
      next(error);
    }
  }

  // 수정
  async toggleSubtaskStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const updatedSubtask = await subtaskService.toggleSubtaskStatus(id);
      res.status(200).json(updatedSubtask);
    } catch (error) {
      next(error);
    }
  }

  // 삭제
  async deleteSubtask(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id as string);
      const result = await subtaskService.deleteSubtask(id);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
