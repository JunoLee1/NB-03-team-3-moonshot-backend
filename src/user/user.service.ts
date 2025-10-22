import prisma from "../lib/prisma.js";
import { IUser, findUserProjects, FindUserTaskParam, IUserDTO } from "./user.user_dto.js";


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
    async findUserProjects({skip, take, order,order_by, userId}:findUserProjects&{userId:number}):Promise<any>{
        const projects = await prisma.project.findMany({
            where:{
                id:userId,
            },
            skip,
            take,
            orderBy: {
                [order_by || "created_at"]: order || "asc"
            },
            include:{
                members:true
            }
      })
        return projects 
    }
    async findUserTasks({from, to, project_id, assignee, keyword, status, userId}:FindUserTaskParam &{ userId:number}):Promise<any>{
        
        const tasks = await prisma.task.findMany({
            where: {
                projects: {
                    members: {
                        some: { 
                            user_id: userId 
                        }
                    },
                },
                AND:[
                    from ? { createdAt: { gte: from } } : {},
                    to ? { createdAt: { lte: to } } : {},
                    project_id ? { project_id } : {},
                    assignee ? { member_id: assignee } : {},
                    status ? { taskStatus: status } : {},
                    keyword ? { title: { contains: keyword, mode: 'insensitive' } } : {}
                ],
            },
            include: { projects: true }
            });
        }
    }