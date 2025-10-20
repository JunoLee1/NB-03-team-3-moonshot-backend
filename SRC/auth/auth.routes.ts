import express from 'express';
import passport from '../lib/passport/index.js';
import {AuthController}from './auth.controller.js';
import { Request,Response,NextFunction } from 'express';

const authController  = new AuthController()
const router = express.Router();

// login 
router.post('/auth',
    passport.authenticate('local',{session:false}),
    async (req: Request, res: Response, next: NextFunction) => {
    authController.loginController.bind(AuthController) // ✅ this 바인딩 + 타입 안전
  }

)

// register
router.post('/auth',( req : Request, res:Response, next:NextFunction ) => {
    authController.registerController(req, res, next)
})

// refresh
router.post('/auth/refresh',passport.authenticate("refresh-token"),
     ( req : Request, res:Response, next:NextFunction ) => {
         authController.refreshtokenController(req, res, next)
     })
,
// logout
router.post('/auth/logout',
    ( req : Request, res:Response, next:NextFunction ) => {
        authController.logoutController(req, res, next)
    }
)

// google get
router.get('/auth/google',
    passport.authenticate( "google", {
        scope :[ 'email', 'profile' ]
    }))

// google callback
router.get('/auth/google/callback',passport.authenticate("google", { session:false }), 
    ( req : Request, res:Response, next:NextFunction ) => {
    authController.googleCallbackController(req, res, next)
    })

export default router
