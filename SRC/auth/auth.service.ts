import HttpError from "../lib/httpError.js"
import prisma from "../lib/prisma.js"
import { IUserDTO, ILoginDTO} from "./auth.controller.js"
import jwt from "jsonwebtoken"
import {JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET} from"../lib/constants.js"

export class AuthService{
    async findUserEmail(email:string):Promise<IUserDTO | null>{
        if (typeof email !== "string" || ! email.includes("@"))throw new HttpError(400,"올바르지 못한 이메일 형식 ")
        const result =  await prisma.user.findUnique({
            where:{
                email
            }
        })
        return result
    } 
    async findUniqueNickname(nickname:string):Promise<IUserDTO|null>{
        if(typeof nickname !== "string" || nickname.length < 1) throw new HttpError(401,"nickanme은 2자 이상이어야 합니다")
        const result = await prisma.user.findUnique({
            where:{
                nickname
            }
        })
        return result
    }

    async loginService({ email }:ILoginDTO):Promise<{ accessToken: string, refreshToken: string}>{
        const user =  await this.findUserEmail(email)
        if(!user) throw new Error
        const userId = user.id
        if(!userId) throw new Error

        const token = this.generateToken(userId)
        return token;
    }

    async createNewUser({email, password, nickname}:IUserDTO):Promise<void>{
        
    }
    generateToken(userId:Number){ 
        const accessToken = jwt.sign({ sub:userId},JWT_ACCESS_TOKEN_SECRET,{
            expiresIn:"30mins",
        });
        const refreshToken = jwt.sign({sub: userId},JWT_REFRESH_TOKEN_SECRET,{
            expiresIn:"1d"
        })
        return {accessToken, refreshToken}
    }

    verifyAccessToken(token: string){
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
    verifyRefreshToken(token: string){
         const decoded = jwt.verify(token,JWT_REFRESH_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
}