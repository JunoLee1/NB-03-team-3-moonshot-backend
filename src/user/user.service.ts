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
    const result = projects.map((project) => {
      const member = project.members.find((m) => m.user_id === userId);

      return {
        ...project,
        projectId: member?.project_id, // ✅ user 기준으로 project_id
        memberId: member?.id, // ✅ member id도 같이 담기
      };
    });
    return result;
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
    const membersInclude = {
      members:{
        include:{
          users:{ select :{ id: true, nickname: true, profileImage: true } 
        }
      }
    }
  }
    const extraInclude = { 
      tags: true,
      attachments: true,
    }
    const filters: Prisma.TaskWhereInput = { 
      ...(project_id? { project_id } : {}),
      ...(status ? {task_status : status}:{}),
      ...(keyword ? { title: { contains: keyword, mode: "insensitive" } } : {}),
      ...(from || to
        ? {
            created_at: {
              ...(from ? { gte: from } : {}),
              ...(to ? { lte: to } : {}),
            },
          }: {}),
        
        ...(assignee ? { member_id: assignee } : {})
      
    }
       
    const tasks = await prisma.task.findMany({
      where: filters,
      include: {
        ...membersInclude,
        ...extraInclude,
      },
      orderBy: { created_at: "desc" }
    })
    const projectIds = tasks.map((t) => t.project_id);
    const members = await prisma.member.findMany({
      where: {
        project_id: { in: projectIds  },
        user_id: userId,
      },
      include: {
        users: {
          select: { id: true, email: true, nickname: true, profileImage: true },
        },
      },
    });

    const result = tasks.map((t) => {
      const member = members.find((m) => m.project_id === t.project_id);
      return {
        id: t.id,
        title: t.title,
        taskStatus: t.task_status,
        projectId: t.project_id,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        member: member
          ? {
              id: member.id,
              status: member.status,
              user: {
                id: member.users.id,
                email: member.users.email,
                nickname: member.users.nickname,
                profileImage:
                  member.users.profileImage || "/default-profile.png",
              },
            }
          : null,
      };
    });
    return result;
  }
}
