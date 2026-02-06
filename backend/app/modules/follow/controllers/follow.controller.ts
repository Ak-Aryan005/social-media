import { Request, Response } from "express";
import { asyncHandler } from "../../../middleware/async";
import { sendSuccess } from "../../../utils/apiResponse";
// import { getPaginationOptions } from "../../../utils/pagination";
import * as followService from "../services/follow.service";

interface AuthRequest extends Request {
  user?: any; // or your User type
}

// export const followUser = catchAsync(async (req: AuthRequest, res: Response) => {
//   const { followingId } = req.body;
//   const follow = await followService.followUser(req.user!.id, followingId);
//   sendSuccess(res, follow, "User followed successfully");
// });

// export const unfollowUser = catchAsync(async (req: AuthRequest, res: Response) => {
//   const { userId } = req.params;
//   await followService.unfollowUser(req.user!.id, userId);
//   sendSuccess(res, null, "User unfollowed successfully");
// });

// export const getFollowers = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const result = await followService.getFollowers(req.params.userId, options);
//   sendSuccess(res, result.data, "Followers retrieved successfully", result.meta);
// });

// export const getFollowing = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const result = await followService.getFollowing(req.params.userId, options);
//   sendSuccess(res, result.data, "Following retrieved successfully", result.meta);
// });

// export const checkFollow = catchAsync(async (req: AuthRequest, res: Response) => {
//   const { userId } = req.params;
//   const isFollowing = await followService.isFollowing(req.user!.id, userId);
//   sendSuccess(res, { isFollowing }, "Follow status retrieved successfully");
// });


export const followUser = asyncHandler(async(req:AuthRequest,res:Response)=>{
  const follow = await followService.followUser(req.body,req.user)
    sendSuccess(res, follow, "Follow status retrieved successfully");
})

export const unfollowUser = asyncHandler(async(req:AuthRequest,res:Response)=>{
  const follow = await followService.unfollowUser(req.body,req.user)
    sendSuccess(res, follow, "unfollow  successfully");
})


export const getFollowers = asyncHandler(async(req:AuthRequest,res:Response)=>{
const follow = await followService.getFollowers(req.user)
    sendSuccess(res, follow, "followers fetched  successfully");
})

export const getFollowing = asyncHandler(async(req:AuthRequest,res:Response)=>{
const follow = await followService.getFollowing(req.user)
    sendSuccess(res, follow, "followers fetched  successfully");
})

export const anothersFollowers = asyncHandler(async(req:AuthRequest,res:Response)=>{
const follow = await followService.anothersFollowers(req.user,req.params.id)
    sendSuccess(res, follow, "followers fetched  successfully");
})

export const anothersFollowing = asyncHandler(async(req:AuthRequest,res:Response)=>{
const follow = await followService.anothersFollowing(req.user,req.params.id)
    sendSuccess(res, follow, "followers fetched  successfully");
})
