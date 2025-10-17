import passport from "passport";
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';
import { googleStrategy } from './oathStrategy.js';
import { verify } from './localStrategy.js';
import prisma from "../prisma.js";
passport.use(verify);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);
passport.use('google', googleStrategy);
passport.deserializeUser(async function (id, done) {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
});
export default passport;
//# sourceMappingURL=index.js.map