import prisma from "../lib/prisma.js";
export default class UserService {
    async getuUserInfoById({ num_id, email, nickname }) {
        const user_id = num_id;
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
    async updatedUser({ num_id, nickname, email }) {
        const user_id = num_id;
        const updatedUser = await prisma.user.update({
            where: { id: user_id },
            data: {
                nickname: nickname,
                email: email
            }
        });
        return updatedUser;
    }
    async findUserProjects({ user_id }) {
        const projects = await prisma.project.findMany({
            where: {
                id: user_id
            },
            include: {
                tasks: true,
                members: true
            }
        });
        return projects;
    }
}
//# sourceMappingURL=user.service.js.map