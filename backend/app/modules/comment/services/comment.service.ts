import Comment, { IComment } from "../models/comment.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import { logger } from "../../../config/logger";
import Post from "../../post/models/post.model";
import Reel from "../../reel/models/reel.model";
import mongoose from "mongoose";
import { notifyUser } from "../../../sockets/notification.gateway";






export const createComment = async (userInfo: any, data: any) => {
  try {
    const { targetType, targetId } = data;
    const comment = await Comment.create({
      user: userInfo.id,
      ...data,
    });
    let target = null;
    if (targetType === "post") {
      target = await Post.findOne({ _id: targetId });
      target?.comments.push(comment._id);
    } else if (targetType === "reel") {
      target = await Reel.findOne({ _id: targetId });
      target?.comments.push(userInfo.id);
    } else {
      throw new ApiError(httpStatus.NOT_FOUND, `${targetType} not found`);
    }
    console.log(`target ${target}`)
    target?.save();
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
    return comment;
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const updateComment = async (userInfo: any, data: any) => {
  try {
    const { targetType, targetId, commentId,content } = data;
    const comment = await Comment.findOneAndUpdate({ _id:commentId },
      {content},
       { new: true }
    );
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
    }
    return comment
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const deleteComment = async (userInfo: any, data: any) => {
  try {
    const { targetType, targetId, commentId } = data;
    const comment = await Comment.findOneAndUpdate({ _id:commentId },
      {isdeleted:true},
       { new: true }
    );
    if (!comment) {
      throw new ApiError(httpStatus.NOT_FOUND, "comment not found");
    }
    let target = null;
    switch (targetType) {
  case 'post':
    // code for option1
    target = await Post.findOneAndUpdate({_id:targetId},
       { $pull: { comments: commentId } },
      { new: true }
    )
    break;

  case 'reel':
    // code for option2
    break;

  case 'option3':
    // code for option3
    break;

  default:
 throw new ApiError(httpStatus.NOT_FOUND,`${targetType} not found`)
}
    return comment
  } catch (error: any) {
    console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const getcomments = async(postID:any)=>{
try {
  const comment = await Comment.aggregate([
    {
      $match:{isdeleted:false},
    },
    {$match:{targetId:new mongoose.Types.ObjectId(postID)}},
       {
      $lookup:{
      from: "users",
      localField: "user",
      foreignField: "_id",
      as: "userInfo",
       }
    },
    {
      $lookup:{
        from:"posts",
        localField:"targetId",
        foreignField:"_id",
        as:"postInfo"
      }
    },
      { $unwind: "$userInfo" },
      { $unwind: "$postInfo" },
    {$set:{
      username: "$userInfo.username",
      avatar: "$userInfo.avatar",
      likes:{$size:"$likes"},
      userId:"$userInfo._id",
      // post:"$postInfo._id"
      post:"$targetId"
    }},
    {
      $project:{
      userId:1,
      username:1,
      avatar:1,
      content:1,
      createdAt:1,
      likes:1,
      post:1
      }
    }
  ]);
  return comment;
} catch (error:any) {
  console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
}
}

