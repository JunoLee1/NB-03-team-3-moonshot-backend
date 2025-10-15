import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();


// 생성

router.post("/tasks/:taskId/subtasks", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;

    if (!title) return res.status(400).json({ message: "title is required" });

    const subtask = await prisma.subtask.create({
      data: {
        title,
        task_id: Number(taskId),
        is_completed: false,
      },
    });

    return res.status(201).json(subtask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to create subtask" });
  }
});


// 수정

router.patch("/subtasks/:id/status", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subtask = await prisma.subtask.findUnique({ where: { id: Number(id) } });
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    const updated = await prisma.subtask.update({
      where: { id: Number(id) },
      data: { is_completed: !subtask.is_completed },
    });

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to update subtask status" });
  }
});

// 삭제

router.delete("/subtasks/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subtask = await prisma.subtask.findUnique({ where: { id: Number(id) } });
    if (!subtask) return res.status(404).json({ message: "Subtask not found" });

    await prisma.subtask.delete({ where: { id: Number(id) } });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to delete subtask" });
  }
});

// 조회

router.get("/tasks/:taskId/subtasks", async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;

    const subtasks = await prisma.subtask.findMany({
      where: { task_id: Number(taskId) },
      orderBy: { created_at: "asc" },
    });

    return res.json(subtasks);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to get subtasks" });
  }
});

export default router;
