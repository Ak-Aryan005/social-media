import { Request, Response } from "express";
import { asyncHandler } from "../../../middleware/async";
import { sendSuccess } from "../../../utils/apiResponse";
import * as onboardingService from "../services/onboarding.service";
import { AuthRequest } from "../../../middleware/checkJwt";

export const getStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.getOnboardingStatus(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding status retrieved successfully");
});

export const updateProfile = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { avatar, bio, coverPhoto } = req.body;
  const onboarding = await onboardingService.updateProfileSetup(req.user!.id, {
    avatar,
    bio,
    coverPhoto,
  });
  sendSuccess(res, onboarding, "Profile setup updated successfully");
});

export const updateInterests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { categories } = req.body;
  const onboarding = await onboardingService.updateInterests(req.user!.id, categories);
  sendSuccess(res, onboarding, "Interests updated successfully");
});

export const updateFollowSuggestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { followed, skipped } = req.body;
  const onboarding = await onboardingService.updateFollowSuggestions(req.user!.id, {
    followed,
    skipped,
  });
  sendSuccess(res, onboarding, "Follow suggestions updated successfully");
});

export const complete = asyncHandler(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.completeOnboarding(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding completed successfully");
});

export const skip = asyncHandler(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.skipOnboarding(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding skipped successfully");
});

export const getSuggestions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const suggestions = await onboardingService.getFollowSuggestions(req.user!.id, limit);
  sendSuccess(res, suggestions, "Follow suggestions retrieved successfully");
});

