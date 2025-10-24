import { StrategyOptions, VerifiedCallback, Strategy as JwtStrategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import prisma from '../prisma.js'
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
} from '../constants.js'


interface JwtPayload{
    sub: number,
    email?: string,
    iat?:number,
    exp?:number
}

if (!JWT_ACCESS_TOKEN_SECRET) throw new Error("JWT_ACCESS_TOKEN_SECRET is missing");
if (!JWT_REFRESH_TOKEN_SECRET) throw new Error("JWT_REFRESH_TOKEN_SECRET is missing");

const accessTokenOptions: StrategyOptions = {
  jwtFromRequest: (req) => {
    console.log("Headers:", req.headers);
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    console.log("Token:", token);
    return token;
  },
  secretOrKey: JWT_ACCESS_TOKEN_SECRET,
};

const refreshTokenOptions: StrategyOptions = {
  jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(), 
  secretOrKey: JWT_REFRESH_TOKEN_SECRET,
};
async function jwtVerify(payload:JwtPayload, done:VerifiedCallback){
    try {
        console.log("JWT payload:", payload);
        const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        })
        
        console.log("User found:", user);

        if (!user) {
            console.log("❌ No user found for this token");
            return done(null, false, { message: "User not found" });
        }
        done(null, user)
    } catch (error) {
        done(error, false)
    }
}
export const accessTokenStrategy = new JwtStrategy(
  accessTokenOptions,
  jwtVerify
);

export const refreshTokenStrategy = new JwtStrategy(
  refreshTokenOptions,
  jwtVerify
);