// src/dashboard.ts
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

/**
칸반 - 상태별 할 일 조회
필터: 프로젝트 ID, 담당자(member_id)
검색: 제목(title)
 */
router.get("/kanban", async (req: Request, res: Response) => {
  try {
    const { projectId, memberId, keyword } = req.query;

    const tasks = await prisma.task.findMany({
      where: {
        ...(projectId ? { project_id: Number(projectId) } : {}),
        ...(memberId ? { member_id: Number(memberId) } : {}),
        ...(keyword
          ? { title: { contains: String(keyword), mode: "insensitive" } }
          : {}),
      },
      orderBy: { taskStatus: "asc" },
      include: {
        projects: { select: { id: true, name: true } },
        members: { select: { id: true, role: true } },
      },
    });

    // 상태별 그룹화
    const grouped = tasks.reduce(
      (acc: Record<string, any[]>, task) => {
        if (!acc[task.taskStatus]) acc[task.taskStatus] = [];
        acc[task.taskStatus].push(task);
        return acc;
      },
      { todo: [], inprogress: [], done: [] }
    );

    res.json({ success: true, data: grouped });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

/**
캘린더 - 월별 할 일 조회
필터: 프로젝트 ID, 상태(taskStatus), 담당자(member_id)
검색: 제목(title)
 */
router.get("/calendar", async (req: Request, res: Response) => {
  try {
    const { year, month, projectId, memberId, status, keyword } = req.query;

    const targetYear = year ? Number(year) : new Date().getFullYear();
    const targetMonth = month ? Number(month) : new Date().getMonth() + 1;

    // year, month 필터를 기반으로 Task의 start_year, start_month와 비교
    const tasks = await prisma.task.findMany({
      where: {
        start_year: targetYear,
        start_month: targetMonth,
        ...(projectId ? { project_id: Number(projectId) } : {}),
        ...(memberId ? { member_id: Number(memberId) } : {}),
        ...(status ? { taskStatus: String(status) as any } : {}),
        ...(keyword
          ? { title: { contains: String(keyword), mode: "insensitive" } }
          : {}),
      },
      orderBy: [
        { start_day: "asc" },
        { taskStatus: "asc" },
      ],
      include: {
        projects: { select: { id: true, name: true } },
        members: { select: { id: true, role: true } },
      },
    });

    res.json({ success: true, data: tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "서버 오류 발생" });
  }
});

export default router;
