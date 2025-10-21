import prisma from "../lib/prisma.js";
import { FindUserTaskParam, IUserDTO } from "./user.controller.js";

interface IUser{
    id: number;
    nickname?: string | null;
    email?: string | null;
    image?:string | null;
    createdAt?: Date;
    updatedAt?: Date;
}


export default class UserService {
    async getUserInfoById({id}:IUser):Promise<IUserDTO | null>{
        const user_id = id
        const userInfo = await prisma.user.findUnique({
            where: {id:user_id},
            select:{
                id:true,
                email:true,
                nickname:true,
                image: true
            }
         })
         if (!userInfo) return null;

        return {
            id: userInfo.id,
            email: userInfo.email,
            nickname: userInfo.nickname ?? "",
            image: userInfo.image ?? ""
        };
    }
    async  updatedUser({id, nickname, email, image}:IUser):Promise<IUserDTO |null>{
        const data: any = {};
        if (nickname !== undefined) data.nickname = nickname;
        if (email !== undefined) data.email = email;
        if(image !== undefined) data.image = image;
        const updatedUser = await prisma.user.update({
            where: {id},
            data
        })
        if(!updatedUser) return null
        return {
            id: updatedUser.id,
            email: updatedUser.email ?? "",
            nickname : updatedUser.nickname ?? "",
            image: updatedUser.image ?? ""
        }
        
    }
    async findUserProjects({userId}:{userId:number}):Promise<any>{
        const projects = await prisma.project.findMany({
            where:{
                id:userId
            },
            include:{
                members:true
            }
      })
        return projects 
    }
    async findUserTasks({from, to, project_id, assignee, keyword, status,userId}:FindUserTaskParam &{ userId:number}):Promise<any>{
       // TODO : 인증 미들웨어에서 req.query id넣어주기
        
        const tasks = await prisma.task.findMany({
            where: {
                projects: {
                    
                members: {
                     some: { user_id: userId }
                    }
                }
            },
            include: { projects: true }
            });
        }
    }