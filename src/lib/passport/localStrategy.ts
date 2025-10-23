import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../prisma.js";
type VerifiedCallback = (error: any, user?: any, info?: any) => void;
import bcrypt from "bcrypt";

export const localStrategy = new LocalStrategy(
    {
    usernameField: "email",
    passwordField: "password",
  },
  async (email:string, password:string, done:VerifiedCallback) =>{
    try{
        const user = await prisma.user.findUnique({
            where: {email}
        })
       if (!user || !user.password) {
        return done(null, false, { message: "Invalid email or password" });
      }
        const validPassword = await bcrypt.compare(password,user.password)
        if(!validPassword){
            return done(null, false, { message: "Invalid email or password" });   
        }else{
            done(null, user);
        }
    }catch(error){
        done(null, false)
    }
})

