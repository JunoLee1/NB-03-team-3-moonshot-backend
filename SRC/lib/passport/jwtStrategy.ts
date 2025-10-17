import {Strategy as JwtStrategy} from 'passport-jwt'
import prisma from '../prisma.js'
import {
    JWT_ACCESS_TOKEN_SECRET,
    JWT_REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_COOKIE_NAME,
    REFRESH_TOKEN_COOKIE_NAME
} from '../constants.js'
import { verify } from 'jsonwebtoken'

const accessTokenOptions = {
    jwtFromRequest: (req:Request) =>req.cookies[ACCESS_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_ACCESS_TOKEN_SECRET
}

const refreshTokenOptions = {
    jwtFromRequest: (req :Request) =>req.cookies[REFRESH_TOKEN_COOKIE_NAME],
    secretOrKey: JWT_REFRESH_TOKEN_SECRET
}
async function jwtVerify(payload,done){
    try {
        const user = await prisma.user.findUnique({
        where: { id: payload.sub }
        }),
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