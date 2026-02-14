import { Request, Response } from "express";
import { asyncHandler } from "../../middleware/async";
import { sendSuccess, sendCreated } from "../../utils/apiResponse";
import * as storyService from "./story.service";
import { AuthRequest } from "../../middleware/checkJwt";

export const createStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const storyData = {
    ...req.body,
    user: req.user!.id,
  };
  const story = await storyService.createStory(storyData,req.files as Express.Multer.File[]);
  sendCreated(res, story, "Story created successfully");
});

export const getStories = asyncHandler(async (req: AuthRequest, res: Response) => {
  const stories = await storyService.getActiveStories(req.user!.id);
  sendSuccess(res, stories, "Stories retrieved successfully");
});

export const getUserStories = asyncHandler(async (req: Request, res: Response) => {
  const stories = await storyService.getStoriesByUser(req.params.userId);
  sendSuccess(res, stories, "User stories retrieved successfully");
});

export const getStory = asyncHandler(async (req: Request, res: Response) => {
  const story = await storyService.getStoryById(req.params.storyId);
  if (!story) {
     res.status(404).json({ message: "Story not found", status: 404, error: true });
  }
  sendSuccess(res, story, "Story retrieved successfully");
});

export const viewStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const story = await storyService.viewStory(req.params.storyId, req.user!.id);
  console.log(`usrr ${req.user?.id}`)
  sendSuccess(res, story, "Story viewed successfully");
});

export const deleteStory = asyncHandler(async (req: AuthRequest, res: Response) => {
  await storyService.deleteStoryById(req.params.storyId, req.user!.id);
  sendSuccess(res, null, "Story deleted successfully");
});
