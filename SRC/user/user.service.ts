import prisma from "../lib/prisma.js";
import { IUserDTO } from "./user.controller.js";

interface IUser{
    id: number;
    nickname: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}
export default class UserService {
    
    async getUserInfoById({id}:IUser):Promise<IUserDTO |null>{
        const user_id = id
        const userInfo = await prisma.user.findUnique({
            where: {id:user_id},
            select:{
                id:true,
                email:true,
                nickname:true,
            }
         })
         return userInfo
    }
    async  updatedUser({id, nickname, email}:IUser):Promise<IUserDTO |null>{
        const userId = id

        const updatedUser = await prisma.user.update({
            where: {id:userId},
            data:{
                nickname:nickname,
                email:email
            }
        })
        return updatedUser
        
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
    async findUserTasks({taskId, userId}:{ taskId :string, userId:number}):Promise<any>{
        const user_id = userId
        const num_taskId = Number(taskId)
        const tasks= await prisma.task.findMany({
            where:{
                id: num_taskId,
                user_id: userId 
            },
            include:{
                subtasks:true
            }
        })
        return tasks
    }
}