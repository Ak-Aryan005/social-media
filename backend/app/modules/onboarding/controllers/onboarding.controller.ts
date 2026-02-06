import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendSuccess } from "../../utils/response";
import * as onboardingService from "../services/onboarding.service";
import { AuthRequest } from "../../middlewares/auth.middleware";

export const getStatus = catchAsync(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.getOnboardingStatus(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding status retrieved successfully");
});

export const updateProfile = catchAsync(async (req: AuthRequest, res: Response) => {
  const { avatar, bio, coverPhoto } = req.body;
  const onboarding = await onboardingService.updateProfileSetup(req.user!.id, {
    avatar,
    bio,
    coverPhoto,
  });
  sendSuccess(res, onboarding, "Profile setup updated successfully");
});

export const updateInterests = catchAsync(async (req: AuthRequest, res: Response) => {
  const { categories } = req.body;
  const onboarding = await onboardingService.updateInterests(req.user!.id, categories);
  sendSuccess(res, onboarding, "Interests updated successfully");
});

export const updateFollowSuggestions = catchAsync(async (req: AuthRequest, res: Response) => {
  const { followed, skipped } = req.body;
  const onboarding = await onboardingService.updateFollowSuggestions(req.user!.id, {
    followed,
    skipped,
  });
  sendSuccess(res, onboarding, "Follow suggestions updated successfully");
});

export const complete = catchAsync(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.completeOnboarding(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding completed successfully");
});

export const skip = catchAsync(async (req: AuthRequest, res: Response) => {
  const onboarding = await onboardingService.skipOnboarding(req.user!.id);
  sendSuccess(res, onboarding, "Onboarding skipped successfully");
});

export const getSuggestions = catchAsync(async (req: AuthRequest, res: Response) => {
  const limit = parseInt(req.query.limit as string) || 10;
  const suggestions = await onboardingService.getFollowSuggestions(req.user!.id, limit);
  sendSuccess(res, suggestions, "Follow suggestions retrieved successfully");
});

