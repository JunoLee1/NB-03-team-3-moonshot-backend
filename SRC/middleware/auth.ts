import { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_TOKEN_SECRET } from "../lib/constants.js";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


/*
1. cookie: refresh token(만료 기간을 길게, 브라우저에서 쿠키에 저장되기 때문에 적어도 XSS 공격에는 안전)
2. access token: authorization header(만료 기간을 짧게, 브라우저에서는 local storage에 저장)
*/

async function auth_refresh_token_handler( req: Request, res: Response, next: NextFunction): Promise<void> {
    // "Bearer <token>"
    const token: string | undefined = req.cookies["moonshot_refresh_token"];
    if (!token) {
        res.status(401).json({ success: false, errors: "Unauthorized" });
        return;
    }

    // verify token(jwt.verify 사용해서)

    // exp 검증

    // DB 유저 조회 검증
    

    next();
}

async function auth_access_token_handler( req: Request, res: Response, next: NextFunction): Promise<void>{
    // "Bearer <token>"
    const token: string | undefined = req.headers.authorization?.split(' ')[1];
    if (!token) {
        res.status(401).json({ success: false, errors: "Unauthorized" });
        return;
    }

    // TODO: verify token
    


    // 다음 미들웨어나 컨트롤러에 넘겨줄 때는 다음 방식이 best practice
    // res.locals.user = user;
    next();
}

interface VerifyTokenResult {
    success: boolean;
    user: {
        email: string;
    } | undefined;
    error?: string;
}

async function verifyAccessToken(token: string): Promise<VerifyTokenResult>  {
    // 토큰 검증
    const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET) as jwt.JwtPayload;
    
    const {sub: email, iat, exp} = decoded;

    if (!exp || !iat || !email) return { success: false, user: undefined, error: "Unauthorized" };

    // 만료 시점 검증
    if (Date.now() > exp * 1000) return { success: false, user: undefined, error: "Token expired" };

    // DB 유저 조회 검증까지.
    const user = await prisma.user.findUnique({
        where: { email },
    });
    
    if (!user) return { success: false, user: undefined, error: "User not found" };

    return { success: true, user: user?.email ? { email: user.email } : undefined };
}

export default {
    auth_refresh_token_handler,
    auth_access_token_handler,
}
