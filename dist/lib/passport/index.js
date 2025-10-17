import passport from "passport";
import { accessTokenStrategy, refreshTokenStrategy } from './jwtStrategy.js';
import { googleStrategy } from './oathStrategy.js';
import { verify } from './localStrategy.js';
passport.use(verify);
passport.use('access-token', accessTokenStrategy);
passport.use('refresh-token', refreshTokenStrategy);
passport.use('google', googleStrategy);
export default passport;
//# sourceMappingURL=index.js.map