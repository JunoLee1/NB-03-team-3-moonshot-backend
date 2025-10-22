import express from "express";
import passport from "../lib/passport/index.js";
import { AuthController } from "./auth.controller.js";
import { Request, Response, NextFunction } from "express";
import { validateBody } from "../middleware/validationMiddle.js";
import { authLoginSchema, authRegisterSchema } from "./auth.validation.js";

const authController = new AuthController();
const router = express.Router();

// login
router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  validateBody(authLoginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    authController.loginController(req, res, next);
  }
);

// register
router.post("/register", (req: Request, res: Response, next: NextFunction) => {
  validateBody(authRegisterSchema);
  authController.registerController(req, res, next);
});

// refresh
router.post(
  "/refresh",
  passport.authenticate("refresh-token"),
  (req: Request, res: Response, next: NextFunction) => {
    authController.refreshtokenController(req, res, next);
  }
),
  // logout
  router.post(
    "/logout",
    (req: Request, res: Response, next: NextFunction) => {
      authController.logoutController(req, res, next);
    }
  );

// google get
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// google callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    authController.googleCallbackController(req, res, next);
  }
);

export default router;
