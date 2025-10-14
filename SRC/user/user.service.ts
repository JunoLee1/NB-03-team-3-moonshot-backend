import prisma from "../lib/prisma.js";
import { IUserDTO } from "./user.controller.js";
export default class UserService {
    
    async getuUserInfoById({numId, email, nickname}:{numId:number,email: string,nickname: string}):Promise<IUserDTO |null>{
        const user_id = numId
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
    async  updatedUser({numId, nickname, email}:{numId:number,nickname: string, email: string}):Promise<IUserDTO |null>{
        const userId = numId

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
                tasks: true,
                members:true
            }
      })
        return projects 
    }
    async findUserTasks({taskId, userId}:{ taskId :string, userId:number}):Promise<any>{
        // const user_id = req.user.id
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