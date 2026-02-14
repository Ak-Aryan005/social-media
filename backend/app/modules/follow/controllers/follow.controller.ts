import { Request, Response } from "express";
import { asyncHandler } from "../../../middleware/async";
import { sendSuccess } from "../../../utils/apiResponse";
import * as followService from "../services/follow.service";

interface AuthRequest extends Request {
  user?: any; // or your User type
}

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
