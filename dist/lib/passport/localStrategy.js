import prisma from "../prisma.js";
import bcrypt from "bcrypt";
export const verify = async (email, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        if (!user)
            return done(null, false);
        if (!user.password) {
            return done(null, false);
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return done(null, false);
        }
        else {
            done(null, user);
        }
    }
    catch (error) {
        done(null, false);
    }
};
//# sourceMappingURL=localStrategy.js.map