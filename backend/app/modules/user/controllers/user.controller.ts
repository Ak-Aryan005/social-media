import httpStatus from 'http-status'
import User from "../models/user.model";
import {generateToken,generateRefreshToken,} from "../../../utils/jwt";
import Token from "../../auth/models/auth.model";
import config from "../../../config/config";
import { sendVerificationEmail } from "../../../utils/mail";
import { logger } from "../../../config/logger";
import * as userService from "../services/user.service";
// import { AuthRequest } from './../../../middleware/checkJwt';
import { asyncHandler } from './../../../middleware/async';
import { ApiError, sendSuccess } from './../../../utils/apiResponse';
import { Request, Response } from "express";

interface AuthRequest extends Request {
  user?: any; // or your User type
}

// export const getUsers = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const filter: any = { isActive: true };
  
//   if (req.query.search) {
//     filter.$or = [
//       { username: { $regex: req.query.search, $options: "i" } },
//       { fullName: { $regex: req.query.search, $options: "i" } },
//     ];
//   }

//   const result = await userService.queryUsers(filter, options);
//   sendSuccess(res, result.data, "Users retrieved successfully", result.meta);
// });

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.userId);
  sendSuccess(res, user, "User retrieved successfully");
});

export const getUserByToken = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.getUserByToken(req.user);
  sendSuccess(res, user, "Profile retrieved successfully");
});

export const updateMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.updateProfile(req.body, req.user);
  sendSuccess(res, user, "Profile updated successfully");
});

export const deactivateUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.deactivateUser(req.user);
  sendSuccess(res, user, "Profile retrieved successfully");
});

export const addAndUpdateProfilePicture = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.addAndUpdateProfilePicture(req.user,req.files as Express.Multer.File[]);
  sendSuccess(res, user, "Profile retrieved successfully");
});

export const getUsersList = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.getUsersList(req.query);
  sendSuccess(res, user, "users retrieved successfully");
});

export const searchUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.searchUsers(req.query.type,req.user);
  sendSuccess(res, user, "users retrieved successfully");
});

export const userProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.userProfile(req.user);
  sendSuccess(res, user, "users retrieved successfully");
  // sendSuccess(res, user, req.t("profileFetched"));
});
export const anotherUserProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.anotherUserProfile(req.user,req.params.id);
  sendSuccess(res, user, "users retrieved successfully");
});


export const blockUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.blockUser(req.user,req.params.id);
  sendSuccess(res, user, "users blocked successfully");
});

export const unBlockUser = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await userService.unBlockUser(req.user,req.params.id);
  sendSuccess(res, user, "users unblocked successfully");
});
