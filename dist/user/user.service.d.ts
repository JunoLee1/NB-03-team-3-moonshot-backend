import { IUserDTO } from "./user.controller.js";
interface IUser {
    id: number;
    nickname?: string | null;
    email?: string | null;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
export default class UserService {
    getUserInfoById({ id }: IUser): Promise<IUserDTO | null>;
    updatedUser({ id, nickname, email, image }: IUser): Promise<IUserDTO | null>;
    findUserProjects({ userId }: {
        userId: number;
    }): Promise<any>;
    findUserTasks({ taskId, userId }: {
        taskId: string;
        userId: number;
    }): Promise<any>;
}
export {};
//# sourceMappingURL=user.service.d.ts.map