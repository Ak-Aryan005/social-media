import { AuthRequest } from './../../../middleware/checkJwt';
import  httpStatus  from 'http-status';
import { ApiError, sendSuccess } from './../../../utils/apiResponse';
import { asyncHandler } from './../../../middleware/async';
import { Request, Response } from "express";
// import { sendSuccess, sendCreated } from "../../utils/response";
import * as authService from "../services/auth.service";
import {  sendVerificationEmail } from "../../../utils/mail";
import { generateResetPasswordToken, generateVerifyEmailToken } from "../../../utils/jwt";
import User from "../../user/models/user.model";
import Token from "../models/auth.model";
import { logger } from "../../../config/logger";
import config from "../../../config/config";
// import generateVerifyEmailToken from "../../../utils/jwt"

// export const register = asyncHandler(async (req: Request, res: Response) => {
// const result = await authService.register(req.body)
//   if (!result || !result.user || !result.tokens) {
//     throw new Error("Registration failed: invalid result structure.");
//   }
 
//   sendSuccess(res, result, "User registered successfully. Please verify your email.");
//   // try {
//   //   await sendVerificationEmail(result.user.email, result.user.username, result.verifyToken);
//   // } catch (error: any) {
//   //   // Log error but don't fail registration
//   //   logger.error(`Failed to send verification email: ${error.message}`);
//   // }
// });

export const register = asyncHandler(async (req: Request, res: Response) => {
const result = await authService.register(req.body)
  if (!result) {
    throw new Error("Registration failed: invalid result structure.");
  }
 
  sendSuccess(res, result, "User registered successfully. Please verify your email.");
});



export const verifyEmailOrPhone = asyncHandler(async (req: Request, res: Response) => {
   const result =  await authService.verifyEmailOrPhone(req.body);
     sendSuccess(res, result,"email-verification-success")
});

export const login = asyncHandler(async(req:Request,res:Response)=>{
   const result = await authService.login(req.body)
   sendSuccess(res,result,"LOGIN_SUCCESS")
})

export const forgotPassword= asyncHandler(async(req:AuthRequest,res:Response)=>{
   const result = await authService.forgotPassword(req.body, req.user)
   sendSuccess(res,result,"LOGIN_SUCCESS")
})


export const resetPassword= asyncHandler(async(req:AuthRequest,res:Response)=>{
   const result = await authService.resetPassword(req.body, req.user)
   sendSuccess(res,result,"LOGIN_SUCCESS")
})

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  await authService.logout(req.user);
  sendSuccess(res, null, "Logout successful");
});


export const sendOtp = asyncHandler(async (req: Request, res: Response) => {
   const result =  await authService.sendOtp(req.body);
     sendSuccess(res, result,"otp sent successfully")
});
export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
   const result =  await authService.verifyOtp(req.body);
     sendSuccess(res, result,"verification-success")
});