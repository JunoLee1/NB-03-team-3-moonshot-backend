
import {z} from "zod";
// auth schema
export const authRegisterSchema = z.object({
    email: z.string().email(),
    password:z.string().min(8,"6글자 이상이어야합니다").optional(),
    nickname:z.string().min(2, "두글자 이상").optional()
    
})
export const authLoginSchema = z.object({
    email: z.string().email(),
    password:z.string().min(6,"6글자 이상이어야합니다").optional(),
})
