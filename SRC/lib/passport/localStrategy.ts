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
const verify: LocalVerifyFn = async(email, password, done) =>{
        const user = await prisma.user.findUnique({
            where: {email}
        })
        if(!user) return done(null, false);

        const validPassword = bcrypt.compare(password,user.password)
        if(!validPassword){
            return done(null, false)
        }else{
            done(null, user);
        }
}

