import { IUserDTO } from "./user.controller.js";
export default class UserService {
    getuUserInfoById({ num_id, email, nickname }: {
        num_id: number;
        email: string;
        nickname: string;
    }): Promise<IUserDTO | null>;
    updatedUser({ num_id, nickname, email }: {
        num_id: number;
        nickname: string;
        email: string;
    }): Promise<IUserDTO | null>;
    findUserProjects({ user_id }: {
        user_id: number;
    }): Promise<any>;
}
//# sourceMappingURL=user.service.d.ts.map