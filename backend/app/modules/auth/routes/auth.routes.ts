import { Router } from "express";
import * as authController from "../controllers/auth.controller";
// import { authenticate } from "../../middlewares/auth.middleware";
import  {validate}  from "../../../middleware/validation";
import {
  registerValidation,
  loginValidation,
  refreshTokenValidation,
  PasswordValidation,
  resetPasswordValidation,
  verifyEmailValidation,
} from "../validation/auth.validation";
import { authenticate } from "../../../middleware/checkJwt";

const router = Router();

router.post("/register", validate(registerValidation), authController.register);
router.post("/login", validate(loginValidation), authController.login);
router.post("/logout",authenticate, authController.logout);
router.post("/reset-password",authenticate, validate(resetPasswordValidation), authController.resetPassword);
router.post("/forgot-password",  authController.forgotPassword);
router.post("/verify-email", validate(verifyEmailValidation), authController.verifyEmailOrPhone);
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", validate(verifyEmailValidation), authController.verifyOtp);
router.post("/refresh-token",validate(refreshTokenValidation),authController.refreshToken);

export default router;
