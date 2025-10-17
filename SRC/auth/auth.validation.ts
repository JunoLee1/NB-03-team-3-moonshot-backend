import { Request,Response,NextFunction } from "express";
import {z} from "zod";
// auth schema
const authRegisterSchema = z.object({
    // 만약 id를 클라이언트에서 받는거라면 id는 필요없으니 삭제를 하자.
    // id: z.number().positive().optional(),
    email: z.string().email(),
    password:z.string().min(6,"6글자 이상이어야합니다").optional(),
})
const authLoginShema = z.object({
    email: z.string().email(),
    password:z.string().min(6,"6글자 이상이어야합니다").optional(),
})
// handler
export const validateRegister = (req:Request, res:Response,next:NextFunction) => {
    try {
         const result = authRegisterSchema.parse(req.body)
    } catch (error) {
         if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
        } else {
      next(error);
        }
    }
}
export const loginAuth = (req:Request, res:Response,next:NextFunction) =>{
    try {
        const result = authLoginShema.parse(req.body)
    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
        } else {
            next(error);
        }
    }
}