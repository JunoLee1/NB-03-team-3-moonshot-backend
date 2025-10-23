import prisma from "../lib/prisma.js";

export interface CreateSubtaskDTO {
  title: string;
  task_id: number;
}

export default class SubtaskService {
  // 생성
  async createSubtask({ title, task_id }: CreateSubtaskDTO) {
    // Task 존재 여부 확인
    const task = await prisma.task.findUnique({
      where: { id: task_id },
    });
    if (!task) throw new Error("Task not found");

    const subtask = await prisma.subtask.create({
      data: {
        title,
        task_id,
        is_completed: false,
      },
    });

    return subtask;
  }

  // 조회
  async getSubtasksByTaskId(task_id: number) {
    const subtasks = await prisma.subtask.findMany({
      where: { task_id },
      orderBy: { createdAt: "asc" },
    });
    return subtasks;
  }

  // 수정
  async toggleSubtaskStatus(id: number) {
    const subtask = await prisma.subtask.findUnique({
      where: { id },
    });
    if (!subtask) throw new Error("Subtask not found");

    const updated = await prisma.subtask.update({
      where: { id },
      data: { is_completed: !subtask.is_completed },
    });

    return updated;
  }

  // 삭제
  async deleteSubtask(id: number) {
    const subtask = await prisma.subtask.findUnique({
      where: { id },
    });
    if (!subtask) throw new Error("Subtask not found");

    await prisma.subtask.delete({ where: { id } });
    return { message: "Subtask deleted successfully" };
  }
}
