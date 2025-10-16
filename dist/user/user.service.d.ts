import { IUserDTO } from "./user.controller.js";
interface IUser {
    id: number;
    nickname: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export default class UserService {
    getUserInfoById({ id }: IUser): Promise<IUserDTO | null>;
    updatedUser({ id, nickname, email }: IUser): Promise<IUserDTO | null>;
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