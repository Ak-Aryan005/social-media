import { Request, Response } from "express";
import { sendSuccess } from "../../../utils/apiResponse";
import * as likeService from "../services/like.service";
import { asyncHandler } from '../../../middleware/async';
interface AuthRequest extends Request {
  user?: any; // or your User type
}



export const createLike = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const like = await likeService.createLike(req.user,req.body)
      sendSuccess(res, like, "Liked successfully");
});



export const removeLike = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const like = await likeService.removeLike(req.user,req.body)
      sendSuccess(res, like, "Liked successfully");
});



export const getLikes = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const like = await likeService.getlikes(req.query.type,req.query.id)
      sendSuccess(res, like, "Liked successfully");
});
