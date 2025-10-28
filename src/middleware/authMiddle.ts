import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { JWT_ACCESS_TOKEN_SECRET } from "../lib/constants.js";
import HttpError from "../lib/httpError.js";
import prisma from "../lib/prisma.js"

export const authMiddleWare = async(req : Request, res: Response, next:NextFunction) =>{
    try {
        const authHeader = req.headers.authorization;// req. header에서 header 토큰 결과 가지고 오기
        if(!authHeader || !authHeader.startsWith("Bearer ")) // 토큰 존재 유무 확인후 토큰 유효성 검사
            throw new HttpError(401,"토큰이 존재하지 않습니다")
        const token = authHeader.split(" ")[1]
        const decoded = jwt.verify(token ?? "", JWT_ACCESS_TOKEN_SECRET) as jwt.JwtPayload
        if (!decoded || !decoded.sub) {
            throw new HttpError(401, "유효하지 않은 토큰");
        }


        // req.user 로 보내기
        const user = await prisma.user.findUnique({
            where :
            { id: Number(decoded.sub) } 
        });
        if(!user) throw new HttpError(401,"존재하지않는 사용자 입니다")
        req.user = user
        next()
        
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            throw new HttpError(401, "잘못된 혹은 만료된 토큰입니다");
        }
        next(error)
    }
}
