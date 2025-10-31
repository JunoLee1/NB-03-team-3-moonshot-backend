import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import { IUser, findUserProjectsQuery, IUserDTO } from "./user.user.dto.js";

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
    id: userId,
    nickname,
    email,
    profileImage,
    password,
    newPassword,
  }: IUser): Promise<IUserDTO | null> {
    const data: Prisma.UserUpdateInput = {};

    if (nickname) data.nickname = { set: nickname };
    if (email) data.email = { set: email };
    if (profileImage) data.profileImage = { set: profileImage };

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) throw new Error();

    if (newPassword) {
      if (!password) throw new Error();
      if (!user.password) throw new Error();
      const validatePassword = await bcrypt.compare(password, user.password);
      if (!validatePassword) throw new Error();
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      data.password = { set: hashedPassword };
    }
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data,
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
    user_id,
    ...filters
  }: Prisma.TaskWhereInput & { user_id: number }) {
    const selectUser = {
      users: {
        select: { id: true, email: true, nickname: true, profileImage: true },
      },
    };
    const extraInclude = {
      tags: true,
      attachments: true,
    };
    const tasks = await prisma.task.findMany({
      where: filters,
      include: {
        members: {
          include: { ...selectUser },
        },
        ...extraInclude,
      },
    });
    const projectIds = tasks.map((t) => t.project_id); // 모든 해야할일의 project_id 객체화 시키기
    const members = await prisma.member.findMany({
      // 해당 유저가 참가한 모든 해야할일의
      where: {
        id: user_id,
        project_id: { in: projectIds }, //
      },
      include: {
        users: {
          select: { id: true, email: true, nickname: true, profileImage: true },
        },
      },
    });

    const membersMap = new Map<number, (typeof members)[0]>();
    members.map((m) => membersMap.set(m.project_id, m));
    const result = tasks.map((t) => ({
      ...t,
      member: membersMap.get(t.project_id) || null,
    }));
    return result;
  }
}
