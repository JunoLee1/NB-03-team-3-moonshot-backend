import HttpError from "../lib/httpError.js"
import prisma from "../lib/prisma.js"
import { IUserDTO, ILoginDTO} from "./auth.controller.js"
import jwt from "jsonwebtoken"
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


    async loginService({email, password}:ILoginDTO):Promise<void>{
        const userWithEmail = await this.findUserEmail(email)
        if (!userWithEmail)throw new HttpError(401,"등록되지 않은 이메일입니다")  
    }

    async createNewUser({email, password, nickname}:IUserDTO):Promise<void>{
        const unique_email = this.findUserEmail(email);
        const unique_nickname = this.findUniqueNickname(nickname)

        if(!unique_email)throw new HttpError(401,"이미 존재하는 이메일")
        if(!unique_nickname)throw new HttpError(401,"이미 존재하는 닉네임")
    }
    generateToken(userId:Number){
        const accessToken = jwt.sign({ sub:userId},"JWT_ACCESS_TOKEN_SECRET",{
            expiresIn:"30mins",
        });
        const refreshToken = jwt.sign({sub: userId},"JWT_REFRESH_TOKEN_SECRET",{
            expiresIn:"1d"
        })
    }

    verifyAccessToken(token: string){
        const decoded = jwt.verify(token," JWT_ACCESS_TOKEN_SECRET");
        return { userId: decoded.sub };
    }
    verifyRefreshToken(token: string){
         const decoded = jwt.verify(token," JWT_REFRESH_TOKEN_SECRET");
        return { userId: decoded.sub };
    }
}