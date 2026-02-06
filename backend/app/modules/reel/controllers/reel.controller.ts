import { Request, Response } from "express";
import { asyncHandler } from './../../../middleware/async';
import { sendSuccess, sendCreated } from "../../../utils/apiResponse";
import { getPaginationOptions } from "../../../utils/pagination";
import * as reelService from "../services/reel.service";
import { AuthRequest } from "../../../middleware/checkJwt";

export const createReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reelData = {
    ...req.body,
    user: req.user!.id,
  };
  const reel = await reelService.createReel(reelData,req.files as Express.Multer.File[]);
  sendCreated(res, reel, "Reel created successfully");
});

export const getReels = asyncHandler(async (req: AuthRequest, res: Response) => {
  const options = getPaginationOptions(req.query);
  const result = await reelService.getFeedReels(options);
  sendSuccess(res, result.data, "Reels retrieved successfully", result.meta);
});

export const getReel = asyncHandler(async (req: Request, res: Response) => {
  const reel = await reelService.getReelById(req.params.reelId);
  if (!reel) {
     res.status(404).json({ message: "Reel not found", status: 404, error: true });
  }
  await reelService.incrementViews(req.params.reelId);
  sendSuccess(res, reel, "Reel retrieved successfully");
});

export const getUserReels = asyncHandler(async (req: Request, res: Response) => {
  const options = getPaginationOptions(req.query);
  const result = await reelService.getReelsByUser(req.params.userId, options);
  sendSuccess(res, result.data, "User reels retrieved successfully", result.meta);
});

export const updateReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  const reel = await reelService.updateReelById(req.params.reelId, req.body, req.user!.id);
  sendSuccess(res, reel, "Reel updated successfully");
});

export const deleteReel = asyncHandler(async (req: AuthRequest, res: Response) => {
  await reelService.deleteReelById(req.params.reelId, req.user!.id);
  sendSuccess(res, null, "Reel deleted successfully");
});
