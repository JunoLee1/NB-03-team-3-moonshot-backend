import passport from "passport"
import prisma from"../prisma.js"
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';
import { googleStrategy } from './oathStrategy.js'
import {verify} from './localStrategy.js'

passport.use('local',verify);
passport.use('access-token',accessTokenStrategy);
passport.use('refresh-token',refreshTokenStrategy);
passport.use('google',googleStrategy);

export default passport;
