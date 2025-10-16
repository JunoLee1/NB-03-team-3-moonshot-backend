import HttpError from "../lib/httpError.js"
import prisma from "../lib/prisma.js"
import { IUserDTO, ILoginDTO} from "./auth.controller.js"

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
    async loginService(email:string, password:string):Promise<ILoginDTO>{
        const result = await prisma.user.find
    }
}