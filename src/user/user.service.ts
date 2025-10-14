import prisma from "../lib/prisma.js";
import { IUserDTO } from "./user.controller.js";
export default class UserService {
    async getUserByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email },
            select: { id: true, email: true, nickname: true, password: true }
        });
    }


    async getuUserInfoById({ num_id, email, nickname }: { num_id: number, email: string, nickname: string }): Promise<IUserDTO | null> {
        const user_id = num_id
        const userInfo = await prisma.user.findUnique({
            where: { id: user_id },
            select: {
                id: true,
                email: true,
                nickname: true,
            }
        })
        return userInfo
    }
    async updatedUser({ num_id, nickname, email }: { num_id: number, nickname: string, email: string }): Promise<IUserDTO | null> {
        const user_id = num_id

        const updatedUser = await prisma.user.update({
            where: { id: user_id },
            data: {
                nickname: nickname,
                email: email
            }
        })
        return updatedUser

    }
    async findUserProjects({ user_id }: { user_id: number }): Promise<any> {
        const projects = await prisma.project.findMany({
            where: {
                id: user_id
            },
            include: {
                tasks: true,
                members: true
            }
        })
        return projects
    }
}