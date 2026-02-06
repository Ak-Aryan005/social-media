import { Request, Response } from "express";
import { sendSuccess } from "../../../utils/apiResponse";
// import { getPaginationOptions } from "../../../utils/pagination";
import * as likeService from "../services/like.service";
import { asyncHandler } from '../../../middleware/async';
interface AuthRequest extends Request {
  user?: any; // or your User type
}


// export const toggleLike = catchAsync(async (req: AuthRequest, res: Response) => {
//   const { targetType, targetId } = req.body;
//   const result = await likeService.toggleLike(req.user!.id, targetType, targetId);
//   sendSuccess(res, result, result.liked ? "Liked successfully" : "Unliked successfully");
// });

// export const getLikes = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const { targetType, targetId } = req.params;
//   const result = await likeService.getLikesByTarget(targetType, targetId, options);
//   sendSuccess(res, result.data, "Likes retrieved successfully", result.meta);
// });

// export const checkLike = catchAsync(async (req: AuthRequest, res: Response) => {
//   const { targetType, targetId } = req.params;
//   const isLiked = await likeService.isLiked(req.user!.id, targetType, targetId);
//   sendSuccess(res, { isLiked }, "Like status retrieved successfully");
// });


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
