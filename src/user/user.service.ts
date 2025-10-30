import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import {
  IUser,
  findUserProjectsQuery,
  FindUserTaskParam,
  IUserDTO,
} from "./user.user.dto.js";


export default class UserService {
  async getUserInfoById({ id }: IUser): Promise<IUserDTO | null> {
    const user_id = id;
    const userInfo = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        id: true,
        email: true,
        nickname: true,
        profileImage: true,
      },
    });
    if (!userInfo) return null;

    return {
      id: userInfo.id,
      email: userInfo.email,
      nickname: userInfo.nickname ?? "",
      profileImage: userInfo.profileImage ?? "",
    };
  }
  async updatedUser({
    id,
    nickname,
    email,
    profileImage,
  }: IUser): Promise<IUserDTO | null> {
    const data: Prisma.UserUpdateInput = {};
    if (nickname) data.nickname = { set: nickname };
    if (email) data.email = { set: email };
    if (profileImage) data.profileImage = { set: profileImage };
    const updatedUser = await prisma.user.update({
      where: { id },
      data: data,
    });
    return updatedUser;
  }
  async findUserProjects({
    skip,
    take,
    order,
    order_by,
    userId,
  }: findUserProjectsQuery & { userId: number }): Promise<any> {
    const projects = await prisma.project.findMany({
      where: {
        members: {
          some: {
            user_id: userId,
          },
        },
      },
      skip,
      take,
      orderBy: {
        [order_by || "created_at"]: order || "asc",
      },
      include: {
        members: true,
      },
    });
    return projects;
  }
  async findUserTasks({
    from,
    to,
    project_id,
    assignee,
    keyword,
    status,
    userId,
  }: FindUserTaskParam & { userId: number }): Promise<any> {
    const tasks = await prisma.task.findMany({
      where: {
        projects: {
          members: {
            some: {
              user_id: userId,
            },
          },
        },
        AND: [
          from ? { created_at: { gte: from } } : {},
          to ? { created_at: { lte: to } } : {},
          project_id ? { project_id } : {},
          assignee ? { member_id: assignee } : {},
          status ? { task_status: status } : {},
          keyword ? { title: { contains: keyword, mode: "insensitive" } } : {},
        ],
      },
      include: { projects: true },
    });
    return tasks;
  }
}
