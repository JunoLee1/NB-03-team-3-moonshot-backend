import UserService from "./user.service.js";
import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
const userService = new UserService();
export default class UserController {
    async userInfoController(req, res, next) {
        try {
            // 인증 미들웨어에서 req.query id넣어주기
            const { nickname, email } = req.body; //validation 미들웨어에서 req.body에 nickname, email 확인후 넣어주기
            if (typeof email !== "string" || !email.includes("@"))
                throw new HttpError(400, "해당 유저의 이메일은 문자열이어야하고 이메일 형식 이어야합니다");
            if (typeof nickname !== "string")
                throw new HttpError(400, "해당 유저의 닉네임은 문자열이어야합니다");
            if (!req.user?.id)
                throw new HttpError(401, "unauthorization");
            const userId = req.user.id; // 인증 미들웨어에서 req.query id넣어주기
            const id = Number(userId);
            const unique_check = await userService.getUserInfoById({ id });
            // prune
            if (!unique_check) {
                throw new HttpError(404, "해당 유저가 존재하지 않습니다");
            }
            ;
            const userInfo = await userService.getUserInfoById({ id });
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
        const { email, password, image } = req.body;
        try {
            if (!req.user?.id)
                throw new HttpError(401, "unauthorization");
            const userId = req.user.id; // 인증 미들웨어에서 req.query id넣어주기
            const id = Number(userId);
            const unique_check = await userService.getUserInfoById({
                id
            });
            if (!unique_check) {
                throw new HttpError(404, "해당 유저가 존재하지 않습니다");
            }
            const updatedUser = await userService.updatedUser({
                id,
                email,
                image
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
        try {
            const { page, limit } = req.query;
            const pageNum = Number(page) || 1;
            const limitNum = Number(limit) || 10;
            const take = limitNum;
            const skip = (pageNum - 1) * take;
            if (!req.user?.id)
                throw new HttpError(401, "unauthorization"); // 인증 미들웨어에서 req.query id넣어주기
            const v_order = [`asc`, `desc`];
            const v_order_by = [`created_at`, `name`];
            function isOrder(value) {
                return v_order.includes(value);
            }
            function isOrderBy(value) {
                return v_order_by.includes(value);
            }
            const orderQuery = req.query.order;
            const orderByQuery = req.query.order_by;
            const order = isOrder(orderQuery) ? orderQuery : "asc";
            const order_by = isOrderBy(orderByQuery) ? orderByQuery : `created_at`;
            const userId = req.user.id;
            const projects = await userService.findUserProjects({ skip, take, order, order_by, userId });
            return res.json({
                success: true,
                data: projects,
            });
        }
        catch (error) {
            next(error);
        }
    }
    async findUserTasksController(req, res, next) {
        const { from, to, project_id, assignee, keyword, status } = req.query;
        const validStatus = ['todo', 'inprogress', 'done'];
        const statusValue = validStatus.includes(status)
            ? status
            : undefined;
        const filters = {
            from: from ? new Date(from) : undefined,
            to: to ? new Date(to) : undefined,
            project_id: project_id ? Number(project_id) : undefined,
            status: status,
            assignee: assignee ? Number(assignee) : undefined,
            keyword: keyword ? keyword : undefined,
        };
        if (!req.user)
            throw new HttpError(401, "unauthorization");
        // 인증 미들웨어에서 req.user id넣어주기
        const userId = req.user.id;
        if (!userId)
            throw new HttpError(401, "unauthorization");
        try {
            const raw_ProjectId = req.query.project_id;
            if (typeof raw_ProjectId !== "string" && isNaN(Number(raw_ProjectId))) {
                throw new HttpError(404, "Bad request");
            }
            const projectId = Number(raw_ProjectId);
            const validatedTask = await prisma.task.findUnique({
                where: { id: projectId },
            });
            if (!validatedTask) {
                throw new HttpError(404, "존재하지 않는 project입니다");
            }
            const string_project = req.query.projectId;
            if (typeof string_project !== "string") {
                throw new HttpError(404, "Bad request");
            }
            const result = await userService.findUserTasks({ ...filters, userId });
            return res.json({
                success: true,
                data: result,
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=user.controller.js.map