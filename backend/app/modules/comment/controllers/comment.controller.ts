import { Request, Response } from "express";
import { sendSuccess } from "../../../utils/apiResponse";
import { asyncHandler } from '../../../middleware/async';
import * as commentService from "../services/comment.service";
interface AuthRequest extends Request {
  user?: any; // or your User type
}

// export const createComment = catchAsync(async (req: AuthRequest, res: Response) => {
//   const commentData = {
//     ...req.body,
//     user: req.user!.id,
//   };
//   const comment = await commentService.createComment(commentData);
//   sendCreated(res, comment, "Comment created successfully");
// });

// export const getComments = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const result = await commentService.getCommentsByPost(req.params.postId, options);
//   sendSuccess(res, result.data, "Comments retrieved successfully", result.meta);
// });

// export const getComment = catchAsync(async (req: Request, res: Response) => {
//   const comment = await commentService.getCommentById(req.params.commentId);
//   if (!comment) {
//     return res.status(404).json({ message: "Comment not found", status: 404, error: true });
//   }
//   sendSuccess(res, comment, "Comment retrieved successfully");
// });

// export const updateComment = catchAsync(async (req: AuthRequest, res: Response) => {
//   const comment = await commentService.updateCommentById(req.params.commentId, req.body, req.user!.id);
//   sendSuccess(res, comment, "Comment updated successfully");
// });

// export const deleteComment = catchAsync(async (req: AuthRequest, res: Response) => {
//   await commentService.deleteCommentById(req.params.commentId, req.user!.id);
//   sendSuccess(res, null, "Comment deleted successfully");
// });

// export const getReplies = catchAsync(async (req: Request, res: Response) => {
//   const options = getPaginationOptions(req.query);
//   const result = await commentService.getRepliesByComment(req.params.commentId, options);
//   sendSuccess(res, result.data, "Replies retrieved successfully", result.meta);
// });





export const createComment = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const comment = await commentService.createComment(req.user,req.body)
      sendSuccess(res, comment, "comment successfully");
});

export const updateComment = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const comment = await commentService.updateComment(req.user,req.body)
      sendSuccess(res, comment, "update successfully");
});



export const deleteComment = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const comment = await commentService.deleteComment(req.user,req.body)
      sendSuccess(res, comment, "delete successfully");
});


export const getComments = asyncHandler( async(req:AuthRequest,res:Response)=>{
    const comment = await commentService.getcomments(req.params.id)
      sendSuccess(res, comment, "update successfully");
});