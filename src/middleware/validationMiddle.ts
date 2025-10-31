import { z } from "zod";
import { Request, Response, NextFunction } from "express";




export function validateBody<T extends z.ZodTypeAny>(schema: T){
    
return (req:Request,res:Response,next:NextFunction)=>{
    const result = schema.safeParse(req.body)
    if (!result.success){
        return res.status(400).json({
            message:"본문 body 검증 실패",
            error: result.error.format()
        })
    }
    req.body = result.data
    next()
}
}




export function validateQuery<T extends z.ZodTypeAny>(schema: T){
return (req:Request,res:Response,next:NextFunction)=>{
    const result = schema.safeParse(req.query)
    if (!result.success){
        return res.status(400).json({
            message:"본문 query 검증 실패",
            error: result.error.flatten()
        })
    }
    req.query = result.data
    next()
}
}


export function validateParam<T extends z.ZodTypeAny> (schema: T){
  return (req:Request,res:Response,next:NextFunction)=>{
    const result = schema.safeParse(req.params)
    if (!result.success){
        return res.status(400).json({
            message:"본문 params 검증 실패",
            error: result.error.flatten()
        })
    }
    req.params = result.data
    next()
  }  
}