import { IUser } from "./../../user/models/user.model";
import Follow, { IFollow } from "../models/follow.model";
import User from "../../user/models/user.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import mongoose from "mongoose";
import { notifyUser } from "../../../sockets/notification.gateway";


export const followUser = async (body: any, user: IUser) => {
  try {
    const { following } = body;
    const checkUser = await User.findOne({ _id: following });
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "not found");
    const isFollowing = await Follow.findOne({ follower: user.id, following });
    if (isFollowing)
      throw new ApiError(
        httpStatus.ALREADY_REPORTED,
        "you already follow the user"
      );
    const follow = await Follow.create({
      follower: user.id,
      following: following,
    });
    const userDoc = await User.findById(user.id);
    if (!userDoc) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    userDoc.following.push(follow.following);
    await userDoc.save();
    let addFollower = checkUser?.followers;
    addFollower?.push(user.id);
    await checkUser?.save();
    await notifyUser({
      user: following,
      type: "follow",
      title: `followed you`,
      message: `${userDoc?.username} is following you`,
      relatedUser:user.id ,
    });
    // console.log(`following ${following}`)
    
    return follow;
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};




export const unfollowUser = async (body: any, user: IUser) => {
  try {
    const { following } = body;
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "not found");
    const isFollowing = await Follow.findOne({ follower: user.id, following });
    if(!isFollowing) throw new ApiError(httpStatus.NOT_FOUND,"not found")
      await isFollowing?.deleteOne();
    
    const checkUser = await User.findOneAndUpdate({ _id: following },
            {$pull:{followers:user.id}},{ new: true }
    );
    const userDoc = await User.findOneAndUpdate({_id:user.id},
      {$pull:{following}},   { new: true }
    );
    if (!userDoc) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    if (!checkUser) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    return isFollowing
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const getFollowers =async (user:any)=>{
  try {
    const followers =await Follow.aggregate([
            { $match:{following:new mongoose.Types.ObjectId(user.id)}},
    //  Check if I FOLLOW THEM back (single lookup)
      {
        $lookup: {
          from: "follows",
          let: { otherUserId: "$follower" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] },          // I am follower
                    { $eq: ["$following", "$$otherUserId"] } // I follow them
                  ]
                }
              }
            }
          ],
          as: "followBack",
        },
      },

      //  Convert to true/false
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$followBack" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower",
          foreignField: "_id",
          as: "userInfo",
        },
      },
        // {$unwind:"$userInfo"},
         { $unwind: {
    path: "$userInfo",
    preserveNullAndEmptyArrays: true
  }},
      {
        $set:{
          username:"$userInfo.username",
          fullName:"$userInfo.fullName",
          userId:"$userInfo._id",
          isVerified:"$userInfo.isVerified",
          avatar:"$userInfo.avatar",
        }
      },
      {
        $project:{
          username:1,
          fullName:1,
          avatar:1,
          userId:1,
          isFollowing:1,
          isVerified:1
        }
      },
    ]);   
    return followers;
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}



export const getFollowing =async (user:any)=>{
  try {
    console.log(`fol ${user.id}`)
    const followers =await Follow.aggregate([
     { $match:{follower:new mongoose.Types.ObjectId(user.id)}},
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "userInfo",
        },
      },
        {$unwind:"$userInfo"},
      {
        $set:{
          username:"$userInfo.username",
          fullName:"$userInfo.fullName",
          userId:"$userInfo._id",
          isVerified:"$userInfo.isVerified",
          avatar:"$userInfo.avatar",
        }
      },
      {
        $project:{
          username:1,
          fullName:1,
          avatar:1,
          userId:1,
          isVerified:1
        }
      },
    ]);   
    return followers;
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}




export const anothersFollowers =async (user:any,userId:any)=>{
  try {
    const followers =await Follow.aggregate([
            { $match:{following:new mongoose.Types.ObjectId(userId)}},
             {
        $lookup: {
          from: "follows",
          let: { otherUserId: "$follower" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] },          // I am follower
                    { $eq: ["$following", "$$otherUserId"] } // I follow them
                  ]
                }
              }
            }
          ],
          as: "followBack",
        },
      },

      //  Convert to true/false
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$followBack" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "follower",
          foreignField: "_id",
          as: "userInfo",
        },
      },
        {$unwind:"$userInfo"},
      {
        $set:{
          username:"$userInfo.username",
          fullName:"$userInfo.fullName",
          userId:"$userInfo._id",
          isVerified:"$userInfo.isVerified",
          avatar:"$userInfo.avatar",
        }
      },
      {
        $project:{
          username:1,
          fullName:1,
          avatar:1,
          userId:1,
          isFollowing:1,
          isVerified:1
        }
      },
    ]);   
    return followers;
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}




export const anothersFollowing =async (user:any,userId:any)=>{
  try {
    const followers =await Follow.aggregate([
            { $match:{follower:new mongoose.Types.ObjectId(userId)}},
             {
        $lookup: {
          from: "follows",
          let: { otherUserId: "$following" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] },          // I am follower
                    { $eq: ["$following", "$$otherUserId"] } // I follow them
                  ]
                }
              }
            }
          ],
          as: "followBack",
        },
      },

      //  Convert to true/false
      {
        $addFields: {
          isFollowing: { $gt: [{ $size: "$followBack" }, 0] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "following",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      //  {$unwind:"$userInfo"},
      {
  $unwind: {
    path: "$userInfo",
    preserveNullAndEmptyArrays: true
  }
},
      {
        $set:{
          username:"$userInfo.username",
          fullName:"$userInfo.fullName",
          userId:"$userInfo._id",
          isVerified:"$userInfo.isVerified",
          avatar:"$userInfo.avatar",
        }
      },
      {
        $project:{
          username:1,
          fullName:1,
          avatar:1,
          userId:1,
          isFollowing:1,
          isVerified:1
        }
      },
    ]);   
    return followers;
  } catch (error:any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}