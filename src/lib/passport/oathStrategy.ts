import {
  Strategy as GoogleStrategy,
  VerifyCallback,
  StrategyOptionsWithRequest,
} from "passport-google-oauth20";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../constants.js";
import prisma from "../prisma.js";
import { Request } from "express";
// import { Profile } from "passport-google-oauth20";
// import { generateToken } from "../generateToken.js";

// interface OAuthStrategyVerify {
//   accessToken?: string;
//   refreshToken?: string;
//   profile?: Profile;
//   cb: VerifyCallback;
// }

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

// export const googleStrategy = new GoogleStrategy(
//   {
//     clientID: GOOGLE_CLIENT_ID,
//     clientSecret: GOOGLE_CLIENT_SECRET,
//     callbackURL: process.env.REDIRECT_URI,
//     passReqToCallback: false, // ⚡ 필수
//   } as any,
//   async (accessToken, refreshToken, profile, cb) => {
//     const user = await prisma.user.findFirst({
//       where: {
//         provider: "google",
//         providerId: profile.id,
//       },
//     });
//     if (user) return cb(null, user);

//     const newUser = await prisma.user.create({
//       data: {
//         provider: "google",
//         providerId: profile.id,
//         email: profile.displayName || profile.id,
//         password: null,
//       },
//     });
//     return cb(null, newUser);
//   }
// );

const googleStrategyOptions: StrategyOptionsWithRequest = {
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.REDIRECT_URI,
  passReqToCallback: true, // true로 변경 및 scope 추가
  scope: ["profile", "email", "https://www.googleapis.com/auth/calendar"],
};

export const googleStrategy = new GoogleStrategy(
  googleStrategyOptions,
  // verify 함수에서 accessToken, refreshToken, params(expires_in 포함) 받도록 수정
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    params: { expires_in: number },
    profile: any,
    done: VerifyCallback
  ) => {
    try {
      const provider = "google";
      const providerId = profile.id;
      const email =
        profile.emails && profile.emails[0]
          ? profile.emails[0].value
          : profile.id; // 이메일 없을 경우 대비

      // 기존 유저 확인 (providerId 기준)
      let user = await prisma.user.findFirst({
        where: { provider, providerId },
      });

      // 토큰 만료 시간 계산 (현재 시간 + 초 * 1000)
      const expiresAt = params.expires_in
        ? new Date(Date.now() + params.expires_in * 1000)
        : null;

      if (user) {
        // 기존 유저이면 토큰 정보 업데이트
        // refreshToken은 처음 또는 동의 시에만 발급되므로, 있을 때만 업데이트
        const dataToUpdate: {
          googleAccessToken: string;
          googleTokenExpiresAt?: Date | null;
          googleRefreshToken?: string;
        } = {
          googleAccessToken: accessToken,
          googleTokenExpiresAt: expiresAt,
        };
        if (refreshToken) {
          dataToUpdate.googleRefreshToken = refreshToken;
        }

        user = await prisma.user.update({
          where: { id: user.id },
          data: dataToUpdate,
        });
        return done(null, user);
      } else {
        // 신규 유저이면 생성하고 토큰 정보 저장
        // 이메일 중복 체크
        const existingUserWithEmail = await prisma.user.findUnique({
          where: { email },
        });
        if (existingUserWithEmail) {
          // 계정 연결 로직 또는 에러 처리 필요
          return done(
            new Error(
              `Email ${email} is already associated with another account.`
            )
          );
        }

        const newUser = await prisma.user.create({
          data: {
            email: email,
            nickname: profile.displayName || email.split("@")[0], // 닉네임 없으면 이메일 앞부분
            profileImage:
              profile.photos && profile.photos[0]
                ? profile.photos[0].value
                : null,
            provider: provider,
            providerId: providerId,
            googleAccessToken: accessToken,
            googleRefreshToken: refreshToken, // 신규 시 refreshToken 필수
            googleTokenExpiresAt: expiresAt,
            // password 필드는 이미 nullable이므로 명시적 null 불필요
          },
        });
        return done(null, newUser);
      }
    } catch (error) {
      return done(error);
    }
  }
);
