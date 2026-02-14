import Post, { IPost } from "../models/post.model";
import User from "../../user/models/user.model";
import { ApiError } from "../../../utils/apiResponse";
import httpStatus from "http-status";
import fs from "fs"
import mongoose, { ObjectId } from "mongoose";
import {uploadOnCloudinary} from "../../../config/cloudinary"
import {agenda } from "../../../config/agenda";
import { match } from "assert";
export const createPost = async ({  user,body, files }:any) => {
  try {
    const { caption, location, tags } = body;

    if (!files || files.length === 0) {
      throw new ApiError(400, "No media files uploaded");
    }

    const media = [];

    for (const file of files) {
      const uploaded = await uploadOnCloudinary(file.path);

      if (!uploaded) continue;

      media.push({
        type: file.mimetype.startsWith("video") ? "video" : "image",
        url: uploaded.secure_url,
      });

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
// console.log("user",user)
    const postData = {
      user:user.id,
      caption,
      location,
      tags: tags ? tags.split(",").map((t: string) => t.trim().toLowerCase()) : [],
      media,
    };

    const post = await Post.create(postData);
    const userpost = await  User.findOne({_id:user.id})
    userpost?.posts.push(post._id)
    userpost?.save()
    // scheduleDeletePost(post._id)
  // await agenda.every("in 10 seconds", "deletePostJob", {
  //     postId: post._id.toString(),
  //   }); 
    return post;
  } catch (error: any) {
    console.error("Post creation failed:", error);

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create post"
    );
  }
}

export const  updatePost = async({  user,body, files,params }:any) =>{
  try {
      const { caption, location, tags } = body;
    const post = await Post.findOne({_id:params});
    if(!post){
      throw new ApiError(httpStatus.BAD_REQUEST,"post not found")
    }
    //     if (!files || files.length === 0) {
    //   throw new ApiError(400, "No media files uploaded");
    // }

const media: { type: "image" | "video"; url: string }[] = [];

    for (const file of files) {
      const uploaded = await uploadOnCloudinary(file.path);

      if (!uploaded) continue;

      post.media.push({
        type: file.mimetype.startsWith("video") ? "video" : "image",
        url: uploaded.secure_url,
        isdeleted:false
      });

      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
    }
    
    post.caption=caption;
    post.location=location;
    post.tags=tags;
    // post.media=media;
   await post.save();
    return post;
  } catch (error:any) {
     console.error("Post creation failed:", error);

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create post"
    );
  }
}

export const deleteImageOfPost = async(id:any,imgId:any,user:any)=>{
  try {
const post = await Post.findOneAndUpdate({
  _id: new mongoose.Types.ObjectId(id),
  "media._id": new mongoose.Types.ObjectId(imgId)
},
  {
    $set: {
      "media.$.isdeleted": true
    }
  },
  { new: true });
 console.log("sss",post)
return post;
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const deletePost = async(params:any,user:any)=>{
  try {
   const post = await Post.findOne({_id:params});
    if(!post){
      throw new ApiError(httpStatus.BAD_REQUEST,"post not found")
    }
      post.isDeleted=true
      await post?.save()
      const userpost = await  User.findOneAndUpdate({_id:user.id},
        { $pull: { posts:post._id  } },
      { new: true }
      )
    } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


export const homePage = async(user:any,options:any)=>{
  try {
const page = Number(options.page) || 1;
const limit = Number(options.limit) || 5;
const skip = (page - 1) * limit;
      const post = await Post.aggregate([
      {$match:{isDeleted:false}},
      { $match: { user: { $ne: new mongoose.Types.ObjectId(user.id) } } },
      {$skip:skip},
      {$limit:limit},
        //  MUTUAL BLOCK FILTER USING users.blockedUsers
      {
        $lookup: {
          from: "users",
          let: { postUser: "$user" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    //  I blocked this post owner
                    {
                      $in: [
                        "$$postUser",
                        { $ifNull: ["$blockedUsers", []] }
                      ]
                    },
                    //  Post owner blocked me
                    {
                      $in: [
                         new mongoose.Types.ObjectId(user.id),
                        { $ifNull: ["$blockedUsers", []] }
                      ]
                    }
                  ]
                }
              }
            }
          ],
          as: "blockInfo"
        }
      },

      //  Keep only posts without any blocking relation
      {
        $match: {
          blockInfo: { $size: 0 }
        }
      },
      ///
      {
        $lookup:{
        from:"users", 
        localField:"user",
        foreignField:"_id",
        as:"userInfo",
        pipeline:[
          {$match:{isActive:true}},
        ]
      }
    },
    ///////
  {
  $lookup: {
    from: "follows",
    let: { authorId: "$user" }, // post owner
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$following", "$$authorId"] }, // is this person being followed?
              { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] } // logged in user follows?
            ]
          }
        }
      }
    ],
    as: "followInfo"
  }
},
{
  $addFields: {
    isFollowing: { $gt: [{ $size: "$followInfo" }, 0] } // true if followInfo not empty
  }
},
{
  $project: {
    followInfo: 0 // remove raw data
  }
},
    /////
    {
  $lookup: {
    from: "likes",
    let: { postId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$targetId", "$$postId"] },
              { $eq: ["$targetType", "post"] },
              { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] }
            ]
          }
        }
      }
    ],
    as: "likeInfo"
  }
},
{
  $addFields: {
    isLiked: { $gt: [{ $size: "$likeInfo" }, 0] }
  }
},
{
  $project: {
    likeInfo: 0
  }
},
     { $unwind: "$userInfo" },
        { $unwind: "$tags" },
       {
        $set:{
        username:"$userInfo.username",
        userId:"$userInfo._id",
        isVerified:"$userInfo.isVerified",
        location:"$location",
        isfollowing:"$isFollowing",
        avatar:"$userInfo.avatar",
        image:{
      $map: {
        input: "$media",
        as: "m",
        in: "$$m.url"
      }},
      likes:{$size:"$likes"},
      comments:{$size:"$comments"},
      caption:"$caption",
      tags:"$tags"
         }},
       {$project:{
        username:1,
        location:1,
        image:1,
        likes:1,
        comments:1,
        caption:1,
        tags:1,
        isfollowing:1,
        userId:1,
        avatar:1,
        isLiked: 1,   
        isVerified:1
       }}
    ])
    return post
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


export const getPostById = async(user:any,postId:string)=>{
  try {
    // console.log(`usr ${user.id}`)
    const post = await Post.aggregate([
      {$match:{isDeleted:false}},
      { $match: { _id:  new mongoose.Types.ObjectId(postId) } },
      {
        $lookup:{
        from:"users",
        localField:"user",
        foreignField:"_id",
        as:"userInfo",
        pipeline:[
          {$match:{isActive:true}},
        ]
      }
    },
        ///////
  {
  $lookup: {
    from: "follows",
    let: { authorId: "$user" }, // post owner
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$following", "$$authorId"] }, // is this person being followed?
              { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] } // logged in user follows?
            ]
          }
        }
      }
    ],
    as: "followInfo"
  }
},
{
  $addFields: {
    isFollowing: { $gt: [{ $size: "$followInfo" }, 0] } // true if followInfo not empty
  }
},
{
  $project: {
    followInfo: 0 // remove raw data
  }
},
    /////

        {
  $lookup: {
    from: "likes",
    let: { postId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$targetId", "$$postId"] },
              { $eq: ["$targetType", "post"] },
              { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] }
            ]
          }
        }
      }
    ],
    as: "likeInfo"
  }
},
{
  $addFields: {
    isLiked: { $gt: [{ $size: "$likeInfo" }, 0] }
  }
},
{
  $project: {
    likeInfo: 0
  }
},
     { $unwind: "$userInfo" },
        { $unwind: "$tags" },
       {
        $set:{
        username:"$userInfo.username",
        userId:"$userInfo._id",
        isVerified:"$userInfo.isVerified",
        avatar:"$userInfo.avatar",
        location:"$location",
        image:{
      $map: {
        input: "$media",
        as: "m",
        in: "$$m.url"
      }},
      likes:{$size:"$likes"},
      comments:{$size:"$comments"},
      caption:"$caption",
      tags:"$tags"
         }},
       {$project:{
       userId:1,
        username:1,
        avatar:1,
        location:1,
        // post:1,
        image:1,
        likes:1,
        comments:1,
        caption:1,
        tags:1,
        isFollowing:1,
        isLiked:1,
        isVerified:1
       }}
    ])
    return post[0] 
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}


export const getUserPosts = async(user:any)=>{
  try {
    // console.log(`usr ${user.id}`)
    const post = await Post.aggregate([
      {$match:{isDeleted:false}},
      { $match: { user: new mongoose.Types.ObjectId(user.id)} },
      {
        $lookup:{
        from:"users",
        localField:"user",
        foreignField:"_id",
        as:"userInfo",
        pipeline:[
          {$match:{isActive:true}},
        ]
      }
    },

        {
  $lookup: {
    from: "likes",
    let: { postId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$targetId", "$$postId"] },
              { $eq: ["$targetType", "post"] },
              { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] }
            ]
          }
        }
      }
    ],
    as: "likeInfo"
  }
},
{
  $addFields: {
    isLiked: { $gt: [{ $size: "$likeInfo" }, 0] }
  }
},
{
  $project: {
    likeInfo: 0
  }
},
     { $unwind: "$userInfo" },
        { $unwind: "$tags" },
       {
        $set:{
        name:"$userInfo.username",
        userId:"$userInfo._id",
        isVerified:"$userInfo.isVerified",
        avatar:"$userInfo.avatar",
        location:"$location",
        image:{
      $map: {
        input: "$media",
        as: "m",
        in: "$$m.url"
      }},
      likes:{$size:"$likes"},
      comments:{$size:"$comments"},
      caption:"$caption",
      tags:"$tags"
         }},
       {$project:{
        name:1,
        location:1,
        avatar:1,
        image:1,
        likes:1,
        comments:1,
        caption:1,
        tags:1,
        userId:1,
        isLiked:1,
        isVerified:1
       }},
    ])
    return post
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}

export const getAnotherUserPost = async(user:any,userId:any)=>{
  try {
    // console.log(`usr ${user.id}`)
    const post = await Post.aggregate([
      {$match:{isDeleted:false}},
      { $match: { user:  new mongoose.Types.ObjectId(userId)  } },
      {
        $lookup:{
        from:"users",
        localField:"user",
        foreignField:"_id",
        as:"userInfo",
        pipeline:[
          {$match:{isActive:true}},
        ]
      }
    },
            ///////
  {
  $lookup: {
    from: "follows",
    let: { authorId: "$user" }, // post owner
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$following", "$$authorId"] }, // is this person being followed?
              { $eq: ["$follower", new mongoose.Types.ObjectId(user.id)] } // logged in user follows?
            ]
          }
        }
      }
    ],
    as: "followInfo"
  }
},
{
  $addFields: {
    isFollowing: { $gt: [{ $size: "$followInfo" }, 0] } // true if followInfo not empty
  }
},
{
  $project: {
    followInfo: 0 // remove raw data
  }
},
    /////
    {
  $lookup: {
    from: "likes",
    let: { postId: "$_id" },
    pipeline: [
      {
        $match: {
          $expr: {
            $and: [
              { $eq: ["$targetId", "$$postId"] },
              { $eq: ["$targetType", "post"] },
              { $eq: ["$user", new mongoose.Types.ObjectId(user.id)] }
            ]
          }
        }
      }
    ],
    as: "likeInfo"
  }
},
{
  $addFields: {
    isLiked: { $gt: [{ $size: "$likeInfo" }, 0] }
  }
},
{
  $project: {
    likeInfo: 0
  }
},

     { $unwind: "$userInfo" },
        { $unwind: "$tags" },
       {
        $set:{
        username:"$userInfo.username",
        userId:"$userInfo._id",
        isVerified:"$userInfo.isVerified",
        avatar:"$userInfo.avatar",
        location:"$location",
        image:{
      $map: {
        input: "$media",
        as: "m",
        in: "$$m.url"
      }},
      likes:{$size:"$likes"},
      comments:{$size:"$comments"},
      caption:"$caption",
      tags:"$tags"
         }},
       {$project:{
        username:1,
        location:1,
        avatar:1,
        image:1,
        likes:1,
        comments:1,
        caption:1,
        tags:1,
        userId:1,
        isFollowing:1,
        isLiked:1,
        isVerified:1
       }}
    ])
    return post
  } catch (error:any) {
     console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
}




// import cron from "node-cron";
// export const scheduleDeletePost = (postId: any) => {
//   const now = new Date();
//   now.setMinutes(now.getMinutes() + 1);

//   const minute = now.getMinutes();
//   const hour = now.getHours();

//   const pattern = `${minute} ${hour} * * *`;

//   const job = cron.schedule(pattern, async () => {
//     try {
//       console.log(" Running scheduled delete...");
//       await deletePost(postId);
//     } catch (err) {
//       console.error(" Scheduled delete failed:", err);
//     } finally {
//       job.stop(); // Ensures this runs ONLY ONCE
//     }
//   });
// };

// scheduleDeletePost("69274af5363b4b3e0b47068f")