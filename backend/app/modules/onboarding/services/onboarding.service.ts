import Onboarding, { IOnboarding } from "../models/onboarding.model";
import User from "../../user/models/user.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import mongoose from "mongoose";

export const getOnboardingStatus = async (userId: string): Promise<IOnboarding | null> => {
  let onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    // Create onboarding record if it doesn't exist
    onboarding = await Onboarding.create({
      user: userId,
      step: 1,
    });
  }
  
  return onboarding;
};

export const updateProfileSetup = async (
  userId: string,
  data: {
    avatar?: string;
    bio?: string;
    coverPhoto?: string;
  }
): Promise<IOnboarding> => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new ApiError(httpStatus.NOT_FOUND, "Onboarding record not found");
  }

  // Update profile setup
  onboarding.profileSetup = {
    ...onboarding.profileSetup,
    ...data,
    completed: true,
  };

  // Update user profile if provided
  if (data.avatar || data.bio || data.coverPhoto) {
    await User.findByIdAndUpdate(userId, {
      ...(data.avatar && { avatar: data.avatar }),
      ...(data.bio && { bio: data.bio }),
      ...(data.coverPhoto && { coverPhoto: data.coverPhoto }),
    });
  }

  // Move to next step
  onboarding.step = Math.max(onboarding.step, 2);
  await onboarding.save();

  // Update user onboarding step
  await User.findByIdAndUpdate(userId, { onboardingStep: onboarding.step });

  return onboarding;
};

export const updateInterests = async (
  userId: string,
  categories: string[]
): Promise<IOnboarding> => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new ApiError(httpStatus.NOT_FOUND, "Onboarding record not found");
  }

  onboarding.interests = {
    categories,
    completed: true,
  };

  // Move to next step
  onboarding.step = Math.max(onboarding.step, 3);
  await onboarding.save();

  // Update user onboarding step
  await User.findByIdAndUpdate(userId, { onboardingStep: onboarding.step });

  return onboarding;
};

export const updateFollowSuggestions = async (
  userId: string,
  data: {
    followed?: string[];
    skipped?: boolean;
  }
): Promise<IOnboarding> => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new ApiError(httpStatus.NOT_FOUND, "Onboarding record not found");
  }

  if (data.followed && data.followed.length > 0) {
    const followedIds = data.followed.map((id) => new mongoose.Types.ObjectId(id));
    onboarding.followSuggestions.followed = followedIds;
  }

  if (data.skipped !== undefined) {
    onboarding.followSuggestions.skipped = data.skipped;
  }

  onboarding.followSuggestions.completed = true;

  // Move to next step
  onboarding.step = Math.max(onboarding.step, 4);
  await onboarding.save();

  // Update user onboarding step
  await User.findByIdAndUpdate(userId, { onboardingStep: onboarding.step });

  return onboarding;
};

export const completeOnboarding = async (userId: string): Promise<IOnboarding> => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    throw new ApiError(httpStatus.NOT_FOUND, "Onboarding record not found");
  }

  onboarding.completed = true;
  onboarding.completedAt = new Date();
  onboarding.step = 4;
  await onboarding.save();

  // Update user
  await User.findByIdAndUpdate(userId, {
    onboardingCompleted: true,
    onboardingStep: 4,
  });

  return onboarding;
};

export const skipOnboarding = async (userId: string): Promise<IOnboarding> => {
  const onboarding = await Onboarding.findOne({ user: userId });
  
  if (!onboarding) {
    // Create onboarding record and mark as completed
    const newOnboarding = await Onboarding.create({
      user: userId,
      step: 4,
      completed: true,
      completedAt: new Date(),
    });

    await User.findByIdAndUpdate(userId, {
      onboardingCompleted: true,
      onboardingStep: 4,
    });

    return newOnboarding;
  }

  onboarding.completed = true;
  onboarding.completedAt = new Date();
  onboarding.step = 4;
  await onboarding.save();

  await User.findByIdAndUpdate(userId, {
    onboardingCompleted: true,
    onboardingStep: 4,
  });

  return onboarding;
};

export const getFollowSuggestions = async (userId: string, limit: number = 10) => {
  // Get users that are not already followed and not the current user
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const followingIds = user.following.map((id) => id.toString());
  followingIds.push(userId);

  const suggestions = await User.find({
    _id: { $nin: followingIds },
    isActive: true,
  })
    .select("username fullName avatar bio followers")
    .limit(limit)
    .sort({ followers: -1, createdAt: -1 });

  return suggestions;
};

