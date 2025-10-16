import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../lib/constants.js";
export class AuthService {
    async findUserEmail(email) {
        if (email.includes("@"))
            throw new HttpError(400, "올바르지 못한 이메일 형식 ");
        const result = await prisma.user.findUnique({
            where: {
                email
            }
        });
        return result;
    }
    async findUniqueNickname(nickname) {
        const result = await prisma.user.findUnique({
            where: {
                nickname
            }
        });
        return result;
    }
    async loginService({ email }) {
        const user = await this.findUserEmail(email);
        if (!user)
            throw new HttpError(401, "이메일이 존재하지 않습니다");
        const userId = user.id;
        if (!userId)
            throw new HttpError(400, "유효하지 않는 인덱스");
        const token = this.generateToken(userId);
        return token;
    }
    async createNewUser({ email, password, nickname, image }) {
        const newUser = await prisma.user.create({
            data: {
                email,
                nickname: nickname,
                password: password,
                image: "example.jpg",
            },
            include: {
                tasks: true,
                comments: true
            }
        });
        return newUser;
    }
    generateToken(userId) {
        const accessToken = jwt.sign({ sub: userId }, JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: "30mins",
        });
        const refreshToken = jwt.sign({ sub: userId }, JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: "1d"
        });
        return { accessToken, refreshToken };
    }
    verifyAccessToken(token) {
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
    verifyRefreshToken(token) {
        const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
}
//# sourceMappingURL=auth.service.js.map