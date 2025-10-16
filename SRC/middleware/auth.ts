import { Request, Response, NextFunction } from "express";
import { JWT_ACCESS_TOKEN_SECRET } from "../lib/constants.js";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";


/*
1. cookie -> 수정이 필요

2. 아래는 authorization header 기준으로 작성됨.
*/

function auth_handler( req: Request, res: Response, next: NextFunction){
    // "Bearer <token>"
    const token: string | undefined = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, errors: "Unauthorized" });
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

export default auth_handler
