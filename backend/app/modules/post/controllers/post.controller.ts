import { Request, Response } from "express";
import { sendSuccess, sendCreated } from "../../../utils/apiResponse";
// import { getPaginationOptions } from "../../../utils/pagination";
import * as postService from "../services/post.service";
import { asyncHandler } from "../../../middleware/async";


interface AuthRequest extends Request {
  user?: any; 
}


export const createPost = asyncHandler(async(req: AuthRequest, res: Response) => {
    const post = await postService.createPost({
      user: req.user,
      body: req.body,
      files: req.files as Express.Multer.File[],
    });
      sendSuccess(res, post, "Post created successfully");
});

export const updatePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.updatePost({
      user: req.user,
      body: req.body,
      files: req.files as Express.Multer.File[],
      params:req.params.postId
    });
  sendSuccess(res, post, "Post updated successfully");
});


export const deletePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  await postService.deletePost(req.params.postId,req.user);
  sendSuccess(res, null, "Post deleted successfully");
});
export const deleteImageOfPost = asyncHandler(async (req: AuthRequest, res: Response) => {
 const post =  await postService.deleteImageOfPost(req.params.postId,req.query.imgId,req.user);
  sendSuccess(res, post, "Post deleted successfully");
});


export const homePage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.homePage(req.user,req.query);
  sendSuccess(res, post, "Post fetched successfully");
});


export const getPostById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.getPostById(req.user,req.params.postId);
  sendSuccess(res, post, "Post fetched successfully");
});

export const getUserPosts = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.getUserPosts(req.user);
  sendSuccess(res, post, "Post fetched successfully");
});

export const getAnotherUserPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await postService.getAnotherUserPost(req.user,req.params.id);
  sendSuccess(res, post, "Post fetched successfully");
});