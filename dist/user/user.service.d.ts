import { IUser, findUserProjects, FindUserTaskParam, IUserDTO } from "./user.user_dto.js";
export default class UserService {
    getUserInfoById({ id }: IUser): Promise<IUserDTO | null>;
    updatedUser({ id, nickname, email, image }: IUser): Promise<IUserDTO | null>;
    findUserProjects({ skip, take, order, order_by, userId }: findUserProjects & {
        userId: number;
    }): Promise<any>;
    findUserTasks({ from, to, project_id, assignee, keyword, status, userId }: FindUserTaskParam & {
        userId: number;
    }): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map