import prisma from "../lib/prisma.js";
export default class UserService {
    async getUserInfoById({ id }) {
        const user_id = id;
        const userInfo = await prisma.user.findUnique({
            where: { id: user_id },
            select: {
                id: true,
                email: true,
                nickname: true,
                image: true
            }
        });
        if (!userInfo)
            return null;
        return {
            id: userInfo.id,
            email: userInfo.email,
            nickname: userInfo.nickname ?? "",
            image: userInfo.image ?? ""
        };
    }
    async updatedUser({ id, nickname, email, image }) {
        const data = {};
        if (nickname !== undefined)
            data.nickname = nickname;
        if (email !== undefined)
            data.email = email;
        if (image !== undefined)
            data.image = image;
        const updatedUser = await prisma.user.update({
            where: { id },
            data
        });
        if (!updatedUser)
            return null;
        return {
            id: updatedUser.id,
            email: updatedUser.email ?? "",
            nickname: updatedUser.nickname ?? "",
            image: updatedUser.image ?? ""
        };
    }
    async findUserProjects({ userId }) {
        const projects = await prisma.project.findMany({
            where: {
                id: userId
            },
            include: {
                members: true
            }
        });
        return projects;
    }
    async findUserTasks({ taskId, userId }) {
        // TODO : 인증 미들웨어에서 req.query id넣어주기
        const num_taskId = Number(taskId);
        const tasks = await prisma.task.findMany({
            where: {
                id: num_taskId,
                user_id: userId
            },
            include: {
                subtasks: true
            }
        });
        return tasks;
    }
}
//# sourceMappingURL=user.service.js.map