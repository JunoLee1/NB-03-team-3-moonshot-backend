import { Strategy as LocalStrategy } from "passport-local";
import { Passport } from "passport";
import prisma from"../prisma.js";
import { VerifiedCallback } from "passport-jwt";
import bcrypt from "bcrypt"
interface LocalVerifyFn {
    (email: string,
    password: string,
    done: VerifiedCallback) :Promise<void>
}
export const verify: LocalVerifyFn = async(email, password, done) =>{
    try{
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user) return done(null, false);

        if(!user.password){
            return done(null, false)
        }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            return done(null, false)
        }else{
            done(null, user);
        }
    }catch(error){
        done(null, false)
    }
}

