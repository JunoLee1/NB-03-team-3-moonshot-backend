import { JWT_ACCESS_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET} from"./constants.js"
import jwt  from "jsonwebtoken"

export function generateToken({userId, email} : {userId: number, email:string}){ 
        const accessToken = jwt.sign({ sub:userId, email},JWT_ACCESS_TOKEN_SECRET,{
            expiresIn:"30mins",
        });
        const refreshToken = jwt.sign({sub: userId},JWT_REFRESH_TOKEN_SECRET,{
            expiresIn:"1d"
        })
        return {accessToken, refreshToken}
    }