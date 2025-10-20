import express from 'express';
import passport from '../lib/passport/index.js';
import { AuthController } from './auth.controller.js';
const authController = new AuthController();
const router = express.Router();
// login 
router.post('/auth', passport.authenticate('local', { session: false }), async (req, res, next) => {
    authController.loginController.bind(AuthController); // ✅ this 바인딩 + 타입 안전
});
// register
router.post('/auth', (req, res, next) => {
    authController.registerController(req, res, next);
});
// refresh
router.post('/auth/refresh', passport.authenticate("refresh-token"), (req, res, next) => {
    authController.refreshtokenController(req, res, next);
})
    ,
        // logout
        router.post('/auth/logout', (req, res, next) => {
            authController.logoutController(req, res, next);
        });
// google get
router.get('/auth/google', passport.authenticate("google", {
    scope: ['email', 'profile']
}));
// google callback
router.get('/auth/google/callback', passport.authenticate("google", { session: false }), (req, res, next) => {
    authController.googleCallbackController(req, res, next);
});
export default router;
//# sourceMappingURL=auth.routes.js.map