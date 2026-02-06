import Like, { ILike } from "../models/like.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import { logger } from "../../../config/logger";
import Post from "../../post/models/post.model";
import Comment from "../../comment/models/comment.model";
import mongoose from "mongoose";
import { createNotification } from "../../notification/notification.service";
import { notifyUser } from "../../../sockets/notification.gateway";
// export const toggleLike = async (
//   userId: string,
//   targetType: "post" | "comment" | "story" | "reel",
//   targetId: string
// ) => {
//   const existingLike = await Like.findOne({ user: userId, targetType, targetId });

//   if (existingLike) {
//     await existingLike.deleteOne();
//     return { liked: false };
//   } else {
//     await Like.create({ user: userId, targetType, targetId });

//     // Send notification to content owner
//     try {
//       let targetOwnerId: string | null = null;

//       if (targetType === "post") {
//         const Post = (await import("../../post/models/post.model")).default;
//         const post = await Post.findById(targetId);
//         targetOwnerId = post?.user?.toString() || null;
//       } else if (targetType === "comment") {
//         const Comment = (await import("../../comment/comment.model")).default;
//         const comment = await Comment.findById(targetId);
//         targetOwnerId = comment?.user?.toString() || null;
//       } else if (targetType === "story") {
//         const Story = (await import("../../story/story.model")).default;
//         const story = await Story.findById(targetId);
//         targetOwnerId = story?.user?.toString() || null;
//       } else if (targetType === "reel") {
//         const Reel = (await import("../../reel/reel.model")).default;
//         const reel = await Reel.findById(targetId);
//         targetOwnerId = reel?.user?.toString() || null;
//       }

//       if (targetOwnerId) {
//         await notifyLike(targetOwnerId, userId, targetType, targetId);
//       }
//     } catch (error: any) {
//       // Don't fail like operation if notification fails
//       logger.error(`Error sending like notification: ${error.message}`);
//     }

//     return { liked: true };
//   }
// };

// export const getLikesByTarget = async (
//   targetType: string,
//   targetId: string,
//   options: any
// ) => {
//   const { page = 1, limit = 10 } = options;
//   const skip = (page - 1) * limit;
//   const filter = { targetType, targetId };

//   const likes = await Like.find(filter)
//     .populate("user", "username fullName avatar")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   const total = await Like.countDocuments(filter);

//   return {
//     data: likes,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };

// export const isLiked = async (
//   userId: string,
//   targetType: string,
//   targetId: string
// ): Promise<boolean> => {
//   const like = await Like.findOne({ user: userId, targetType, targetId });
//   return !!like;
// };

export const createLike = async (userInfo: any, data: any) => {
  try {
    const { targetType, targetId, user } = data;
    const existingLike = await Like.findOne({ user: userInfo.id,_id:targetId });
    if (existingLike) {
      throw new ApiError(
        httpStatus.ALREADY_REPORTED,
        `you already like this ${targetType}`
      );
    }
    const like = await Like.create({
      user: userInfo.id,
      ...data,
    });
    let target = null;
    if (targetType === "post") {
      target = await Post.findOne({ _id: targetId });
      target?.likes.push(userInfo.id);
    } else if (targetType === "comment") {
      target = await Comment.findOne({ _id: targetId });
      target?.likes.push(userInfo.id);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, `${targetType} not found`);
    }
    // console.log(`target ${target}`)
   await target?.save();
await notifyUser({
  user: target?.user,
  type: "like",
  title: `${targetType} is liked`,
  message: `liked your ${targetType}`,
  relatedUser:userInfo.id ,

  ...(targetType === "post" && {
    relatedPost: target?._id,
  }),

  ...(targetType === "comment" && {
    relatedComment: target?._id,
  }),
});


    return like;
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

export const removeLike = async (userInfo: any, data: any) => {
  try {
    const { targetType, targetId, likeId } = data;
    const like = await Like.find({ targetId });
    if (!like) {
      throw new ApiError(httpStatus.NOT_FOUND, "Like not found");
    }
    let target = null;
    if (targetType === "post") {
      target = await Post.findOneAndUpdate(
        { _id: targetId },
        { $pull: { likes: userInfo.id } },
        { new: true } // returns updated document
      );
    } else if (targetType === "comment") {
      target = await Comment.findOneAndUpdate(
        { _id: targetId },
        { $pull: { likes: userInfo.id } },
        { new: true }
      );
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, `${targetType} not found`);
    }
    // console.log(`target ${target}`)
    await Like.deleteMany({ targetId, user: userInfo.id });
    // target?.save();
    return like;
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// export const getlikes = async (type:any,id:any) => {
//   try {
//     let likes = await Like.aggregate([
//       {
//         $lookup: {
//           from: "users",
//           localField: "user",
//           foreignField: "_id",
//           as: "userInfo",
//           pipeline: [
//             {
//               $lookup: {
//                 from: "posts",
//                 localField: "_id",
//                 foreignField: "user",
//                 as: "postInfo",
//               },
//             },
//           ],
//         },
//       },
//       {
//         $set:{
//           username:"$userInfo.username",
//           fullName:"$userInfo.fullName",
//           profilePicture:"$userInfo.coverPhoto",
//         }
//       },
//          {$unwind:"$username"},
//       {$unwind:"$fullName"},
//       // {$unwind:"$profilePicture"},
//       {
//         $project:{
//           username:1,
//           fullName:1,
//           profilePicture:1
//         }
//       },
//     ]);   
//     return likes
//   } catch (error: any) {
//     console.error("Error in register service:", error);
//     console.error("Error message:", error?.message);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//   }
// };





// target = await Like.aggregate([
//   {
//     $lookup: {
//       from: "users",
//       localField: "user",
//       foreignField: "_id",
//       as: "userInfo",
//     }
//   },
// {         $lookup: {
//             from: "comments",
//             localField: "targetId",
//             foreignField: "_id",
//             as: "commentInfo",
//           },
//         },
//   { $unwind: "$userInfo" },
//   { $unwind: "$commentInfo" },

//   {
//     $set: {
//       username: "$userInfo.username",
//       profilePicture: "$userInfo.coverPhoto",
//       content: "$commentInfo.content",
//       createdAt: "$commentInfo.createdAt",
//     }
//   },

//   {
//     $project: {
//       username: 1,
//       content: 1,
//       profilePicture: 1,
//       createdAt: 1,
//     }
//   }
// ]);




     
  
      // {$unwind:"$profilePicture"},
      
       

export const getlikes = async (type:any,id:any) => {
  try {
    let likes = null;
     switch (type) {
  case 'post':
 likes = await Post.aggregate([
 {$match:{_id:new mongoose.Types.ObjectId(id)}},
 
 {
  $lookup:{
    from:"users",
    localField:"likes",
    foreignField:"_id",
    as:"userInfo",
    pipeline:[
 {
 $project:{
  username:1,
  fullName:1,
  coverPhoto:1,
  _id:1
 }
 },
  ]
  }
 },
 {$unwind:"$userInfo"},
  {
    $set:{
       username:"$userInfo.username",
  fullName:"$userInfo.fullName",
  userId:"$userInfo._id",
  profilePicture:"$userInfo.coverPhoto"
    }
  },
 {$project:{
  _id:1,
username:1,
fullName:1,
profilePicture:1,
userId:1,
// isFollowing:1
 }}
 ]);   
    break;

  case 'reel':
 likes = await Post.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo",
          pipeline: [
            {
              $lookup: {
                from: "reels",
                localField: "_id",
                foreignField: "user",
                as: "postInfo",
              },
            },
          ],
        },
      },
      {
        $set:{
          username:"$userInfo.username",
          fullName:"$userInfo.fullName",
          profilePicture:"$userInfo.coverPhoto",
        }
      },
         {$unwind:"$username"},
      {$unwind:"$fullName"},
      // {$unwind:"$profilePicture"},
      {
        $project:{
          username:1,
          fullName:1,
          profilePicture:1
        }
      },
    ]); 
        break;

  case 'option3':
    // code for option3
    break;

  default:
 throw new ApiError(httpStatus.NOT_FOUND,`${type} not found`)
}  
    return likes
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};