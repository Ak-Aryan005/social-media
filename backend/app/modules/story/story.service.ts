import mongoose from "mongoose";
import Story, { IStory } from "./story.model";
import { ApiError } from "../../utils/apiResponse";
import httpStatus from "http-status";
import {agenda } from "../../config/agenda";
import { uploadOnCloudinary } from "../../config/cloudinary";
export const createStory = async (storyData: Partial<IStory>,files:any): Promise<IStory> => {
   if (!files || !files.length) {
        throw new ApiError(400, "No media files uploaded");
      }
  
      const file = files[0];
      const result = await uploadOnCloudinary(file.path);
  
      // 🔥 MAP CLOUDINARY → CHAT MEDIA
      let type: "image" | "video" | "audio" | "file" = "file";
  
      if (result?.resource_type === "image") type = "image";
      else if (result?.resource_type === "video" && result?.is_audio===false ) type = "video";
      const media= {url: result?.secure_url, // ✅ REQUIRED
        type }
  return Story.create({...storyData,media});
  // const story = await  Story.create(storyData);
  //  await agenda.every("in 10 seconds", "deletePostJob", {
  //     storyId: story._id.toString(),
  //   });
  //   return story
};

export const getStoryById = async (id: string): Promise<IStory | null> => {
  return Story.findById(id).populate("user", "username fullName avatar -password");
};

export const deleteStoryById = async (storyId: string, userId: string): Promise<void> => {
  const story = await Story.findById(storyId);
  if (!story) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found");
  }
  if (story.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete this story");
  }
  await Story.deleteOne({ _id: storyId });
};

export const getStoriesByUser = async (userId: string) => {
   const now = new Date();
  return Story.find({ user: userId ,expiresAt: { $gt: now }})
    .populate("user", "username fullName avatar -password")
    .sort({ createdAt: -1 });
};

export const getActiveStories = async (userId: string) => {
  const now = new Date();
  return Story.find({
    expiresAt: { $gt: now },
  })
    .populate("user", "username fullName avatar -password")
    .sort({ createdAt: -1 });
};

export const viewStory = async (storyId: string, userId: string) => {
  try {
    // const story = await Story.findById(storyId);
  const userIdObjectId = new mongoose.Types.ObjectId(userId);
    console.log(`usrr ${storyId}`)

  const story = await Story.findOneAndUpdate({_id:storyId},
    { $addToSet: { views:userIdObjectId } },
  { new: true }
  );
  if (!story) {
    throw new ApiError(httpStatus.NOT_FOUND, "Story not found");
  }

  return story;
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

