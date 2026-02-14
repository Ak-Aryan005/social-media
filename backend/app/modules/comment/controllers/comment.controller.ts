import { Request, Response } from "express";
import { sendSuccess } from "../../../utils/apiResponse";
import { asyncHandler } from '../../../middleware/async';
import * as commentService from "../services/comment.service";
interface AuthRequest extends Request {
  user?: any; // or your User type
}


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