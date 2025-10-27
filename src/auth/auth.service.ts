import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/generate-token.js";
import bcrypt from "bcrypt";
import { AuthUserDTO, ProviderType } from "./auth.dto.js";

export class AuthService {
  async findUserEmail(email: string): Promise<AuthUserDTO | null> {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) throw new HttpError(400, "유저 정보가 존재하지 않습니다");
    if (
      user.provider &&
      !Object.values(ProviderType).includes(user.provider as ProviderType)
    ) {
      throw new HttpError(500, "잘못된 Provider");
    }
    return user as AuthUserDTO;
  }
  async findUniqueNickname(nickname: string): Promise<AuthUserDTO | null> {
    const user = await prisma.user.findUnique({
      where: {
        nickname,
      },
    });
    if (!user) throw new HttpError(400, "유저 정보가 존재하지 않습니다");
    if (
      user.provider &&
      !Object.values(ProviderType).includes(user.provider as ProviderType)
    ) {
      throw new HttpError(500, "잘못된 Provider");
    }
    return user as AuthUserDTO;
  }

  async loginService({
    email,
  }: AuthUserDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findUserEmail(email);
    if (!user) throw new HttpError(401, "invalid user's email");
    const userId = user.id;
    if (!userId) throw new HttpError(400, "invalid id");

    const { refreshToken, accessToken } = generateToken({ userId, email});
    return { refreshToken, accessToken };
  }

  async createNewUser({
    email,
    password,
    nickname,
    profile_image,
  }: AuthUserDTO): Promise<AuthUserDTO> {
    const salt = await bcrypt.genSalt(10);
    if (!password) throw new HttpError(400, "비밀번호가 없음");
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdPassword = hashedPassword;
    const newUser = await prisma.user.create({
      data: {
        email: email ?? "",
        nickname: nickname ?? "",
        password: createdPassword ?? "",
        profile_image: profile_image ?? "",
      },
      include: {
        comments: true,
      },
    });
  
    if (
      newUser.provider &&
      !Object.values(ProviderType).includes(newUser.provider as ProviderType)
    ) {
      throw new HttpError(500, "잘못된 Provider");
    }
    return newUser as AuthUserDTO;
  }
}
