import Reel, { IReel } from "../models/reel.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import { uploadOnCloudinary } from "../../../config/cloudinary";
export const createReel = async (reelData: Partial<IReel>,files:any): Promise<IReel> => {
  try {
    if (!files || !files.length) {
          throw new ApiError(400, "No media files uploaded");
        }
    
        const file = files[0];
        const result = await uploadOnCloudinary(file.path);
        const video= {url: result?.secure_url }
  return  await Reel.create({...reelData,media:video});
  } catch (error:any) {
      console.error("Error in createReel service:");
  console.error(error?.stack || error);

  if (error instanceof ApiError) throw error;

  throw new ApiError(
    httpStatus.INTERNAL_SERVER_ERROR,
    error?.message || "Internal Server Error"
  );
  } 
};

export const getReelById = async (id: string): Promise<IReel | null> => {
  return Reel.findById(id).populate("user", "username fullName avatar");
};

export const updateReelById = async (
  reelId: string,
  updateData: Partial<IReel>,
  userId: string
): Promise<IReel | null> => {
  const reel = await Reel.findById(reelId);
  if (!reel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Reel not found");
  }
  if (reel.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to update this reel");
  }
  Object.assign(reel, updateData);
  await reel.save();
  return reel;
};

export const deleteReelById = async (reelId: string, userId: string): Promise<void> => {
  const reel = await Reel.findById(reelId);
  if (!reel) {
    throw new ApiError(httpStatus.NOT_FOUND, "Reel not found");
  }
  if (reel.user.toString() !== userId) {
    throw new ApiError(httpStatus.FORBIDDEN, "Not authorized to delete this reel");
  }
  await reel.deleteOne();
};

export const getReelsByUser = async (userId: string, options: any) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const filter = { user: userId, isArchived: false };
  
  const reels = await Reel.find(filter)
    .populate("user", "username fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Reel.countDocuments(filter);
  
  return {
    data: reels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getFeedReels = async (options: any) => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;
  const filter = { isArchived: false };
  
  const reels = await Reel.find(filter)
    .populate("user", "username fullName avatar")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  
  const total = await Reel.countDocuments(filter);
  
  return {
    data: reels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const incrementViews = async (reelId: string) => {
  await Reel.findByIdAndUpdate(reelId, { $inc: { views: 1 } });
};

