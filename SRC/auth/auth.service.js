import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } from "../lib/constants.js";
import { ProviderType } from "./auth.controller.js";
import { generateToken } from "../lib/generateToken.js";
import bcrypt from "bcrypt";
export class AuthService {
    async findUserEmail(email) {
        if (email.includes("@"))
            throw new HttpError(400, "올바르지 못한 이메일 형식 ");
        const user = await prisma.user.findUnique({
            where: {
                email
            },
        });
        if (!user)
            throw new HttpError(400, "");
        if (user.provider && !Object.values(ProviderType).includes(user.provider)) {
            throw new HttpError(500, "");
        }
        return user;
    }
    async findUniqueNickname(nickname) {
        const user = await prisma.user.findUnique({
            where: {
                nickname
            }
        });
        if (!user)
            throw new HttpError(400, "유저 정보가 존재하지 않습니다");
        if (user.provider && !Object.values(ProviderType).includes(user.provider)) {
            throw new HttpError(500, "잘못된 Provider");
        }
        return user;
    }
    async loginService({ email }) {
        const user = await this.findUserEmail(email);
        if (!user)
            throw new HttpError(401, "이메일이 존재하지 않습니다");
        const userId = user.id;
        if (!userId)
            throw new HttpError(400, "유효하지 않는 인덱스");
        const token = generateToken(userId);
        return token;
    }
    async createNewUser({ email, password, nickname, image }) {
        const salt = await bcrypt.genSalt(10);
        if (!password)
            throw new HttpError(400, "비밀번호가 없음");
        const hashedPassword = await bcrypt.hash(password, salt);
        const created_password = hashedPassword;
        const newUser = await prisma.user.create({
            data: {
                email: email ?? "",
                nickname: nickname ?? "",
                password: created_password ?? "",
                image: image ?? "",
            },
            include: {
                comments: true
            }
        });
        if (!newUser)
            throw new HttpError(400, "유저 정보가 존재하지 않습니다");
        if (newUser.provider && !Object.values(ProviderType).includes(newUser.provider)) {
            throw new HttpError(500, "잘못된 Provider");
        }
        return newUser;
    }
    verifyAccessToken(token) {
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
    verifyRefreshToken(token) {
        const decoded = jwt.verify(token, JWT_REFRESH_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
    clearTokenCookies(res) {
        res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
        res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    }
}
