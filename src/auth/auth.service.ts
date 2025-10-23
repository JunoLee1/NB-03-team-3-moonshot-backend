import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js";
import { generateToken } from "../lib/generateToken.js";
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
    id,
    email,
  }: AuthUserDTO): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.findUserEmail(email);
    if (!user) throw new HttpError(401, "이메일이 존재하지 않습니다");
    const userId = id;
    if (!userId) throw new HttpError(400, "유효하지 않는 인덱스");

    const { refreshToken, accessToken } = generateToken(id);
    return { refreshToken, accessToken };
  }

  async createNewUser({
    email,
    password,
    nickname,
    profileImage,
  }: AuthUserDTO): Promise<AuthUserDTO> {
    const salt = await bcrypt.genSalt(10);
    if (!password) throw new HttpError(400, "비밀번호가 없음");
    const hashedPassword = await bcrypt.hash(password, salt);
    const created_password = hashedPassword;
    const newUser = await prisma.user.create({
      data: {
        email: email ?? "",
        nickname: nickname ?? "",
        password: created_password ?? "",
        profileImage: profileImage ?? "",
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
