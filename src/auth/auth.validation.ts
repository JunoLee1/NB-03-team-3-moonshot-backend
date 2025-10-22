import { Request,Response,NextFunction } from "express";
import {z} from "zod";
// auth schema
const authRegisterSchema = z.object({
    email: z.string().email(),
    password:z.string().min(6,"6글자 이상이어야합니다").optional(),
    nickname:z.string().min(2, "두글자 이상").optional()
    
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