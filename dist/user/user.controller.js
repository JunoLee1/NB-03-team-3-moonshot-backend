import UserService from "./user.service.js";
import HttpError from "../lib/httpError.js";
const userService = new UserService();
export default class UserController {
    async findDuplicateUserController(req, res, next) {
        const { id } = req.body;
        try {
            const user_id = Number(id);
            if (typeof user_id !== "number" && user_id > 0) {
                throw new HttpError(400, "Bad request");
            }
            return res.json({ success: true, message: "사용가능한 아이디입니다" });
        }
        catch (error) {
            next(error);
        }
    }
    async userInfoController(req, res, next) {
        try {
            const { id } = req.params;
            console.log("id", id);
            const { nickname, email } = req.body;
            const unique_check = await userService.getuUserInfoById({
                num_id: Number(id),
                email,
                nickname,
            });
            if (!unique_check) {
                throw new HttpError(404, "해당 유저가 존재하지 않습니다");
            }
            const num_id = Number(id);
            if (typeof nickname !== "string")
                throw new HttpError(400, "해당 유저의 닉네임은 문자열이어야합니다");
            if (typeof email !== "string" && email.includes("@"))
                throw new HttpError(400, "해당 유저의 이메일은 문자열이어야하고 이메일 형삭이 아니어야합니다");
            if (typeof num_id !== "number" && num_id > 0)
                throw new HttpError(400, "해당 유저의 인덱스는 0보다 큰정수이 어야합니다");
            const userInfo = await userService.getuUserInfoById({
                num_id,
                email,
                nickname,
            });
            return res.json({
                success: true,
                data: userInfo,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async userUpdateController(req, res, next) {
        const { id, nickname: rawNickname, email: rawEmail } = req.body;
        try {
            const unique_check = await userService.getuUserInfoById({
                num_id: Number(id),
                email: String(rawEmail),
                nickname: String(rawNickname),
            });
            if (!unique_check) {
                throw new HttpError(404, "해당 유저가 존재하지 않습니다");
            }
            const num_id = Number(id);
            const nickname = String(rawNickname);
            const email = String(rawEmail);
            if (typeof rawNickname !== "string") {
                throw new HttpError(400, "문자열이어야합니다");
            }
            if (typeof rawEmail !== "string") {
                throw new HttpError(400, "문자열이어야합니다");
            }
            if (typeof num_id !== "number" && num_id > 0) {
                throw new HttpError(400, "인덱스는 0보다 큰정수이 어야합니다");
            }
            const updatedUser = await userService.updatedUser({
                num_id,
                email,
                nickname,
            });
            return res.status(200).json({
                success: true,
                data: updatedUser,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findUsedrProjectsController(req, res, next) {
        const { id } = req.params;
        try {
            const user_id = Number(id);
            if (typeof user_id !== "number" && user_id > 0) {
                throw new HttpError(400, "Bad request");
            }
            const projects = await userService.findUserProjects({ user_id });
            return res.json({
                success: true,
                data: projects,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=user.controller.js.map