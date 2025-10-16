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
            }
        });
        return userInfo;
    }
    async updatedUser({ id, nickname, email }) {
        const userId = id;
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                nickname: nickname,
                email: email
            }
        });
        return updatedUser;
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
        // const {id} = req.user // TODO : 인증 미들웨어에서 req.query id넣어주기
        const user_id = userId;
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