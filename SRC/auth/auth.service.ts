import prisma from "../lib/prisma.js"
import { IUserDTO } from "./auth.controller.js"

export class AuthService{
      async findUserEmail(email:string):Promise<boolean>{
        if (typeof email !== "string" || ! email.includes("@"))return false
        await prisma.user.findUnique({
            where:{
                email
            }
        })
        return true
    }
    //async loginService(){}
}