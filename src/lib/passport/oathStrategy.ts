import { Strategy as GoogleStrategy, VerifyCallback} from 'passport-google-oauth20';
import {GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../constants.js';
import prisma from "../prisma.js"
import { Profile } from 'passport-google-oauth20';

interface OAuthStrategyVerify {
    accessToken?: string,
    refreshToken?: string,
    profile?: Profile,
    cb: VerifyCallback
}
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth credentials");
}

export const googleStrategy = new GoogleStrategy(
    {
        clientID : GOOGLE_CLIENT_ID ,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL :'http://localhost:3001/auth/google/callback',
        passReqToCallback: false , // ⚡ 필수

    } as any,
    async ( accessToken,refreshToken,profile, cb, ) => {
        const user = await prisma.user.findFirst({
            where:{
                provider:"google",
                providerId:profile.id
            }
        });
        if (user)
            return cb(null, user);
        const newUser = await prisma.user.create({
            data:{
                provider: 'google',
                providerId: profile.id,
                email: profile.displayName || profile.id,
                password: null
            }
        })
        return cb(null, newUser)
    }
)