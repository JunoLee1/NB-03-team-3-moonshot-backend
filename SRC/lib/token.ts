import jwt from "jsonwebtoken";
import {ACCESS_TOKEN_COOKIE_NAME, REFRESH_TOKEN_COOKIE_NAME, NODE_ENV, JWT_ACCESS_TOKEN_SECRET,JWT_REFRESH_TOKEN_SECRET} from "./constants.js";
import { Response } from "express";

import dotenv from 'dotenv';
dotenv.config();

export function setTokenCookies(
    res: Response,
    accessToken:string,
    refreshToken:string
):void{
    res.cookie(ACCESS_TOKEN_COOKIE_NAME,accessToken,{
        httpOnly :true,
        secure:NODE_ENV ==="production",
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax',        
        maxAge: 1 * 60 * 60 * 1000,
    })
    res.cookie(REFRESH_TOKEN_COOKIE_NAME,refreshToken,{
       httpOnly :true,
        secure:NODE_ENV ==="production",
        sameSite: NODE_ENV === 'production' ? 'none' : 'lax', 
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path:'/auth/refresh'
    })
}


   export function clearTokenCookie(res:Response){
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME)
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME)
    }

    export function verifyAccessToken(token: string){
        const decoded = jwt.verify(token, JWT_ACCESS_TOKEN_SECRET);
        return { userId: decoded.sub };
    }
     export function verifyRefreshToken(token: string){
         const decoded = jwt.verify(token,JWT_REFRESH_TOKEN_SECRET);
        return { userId: decoded.sub };
    }