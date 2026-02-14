import httpStatus from 'http-status'
import mongoose from 'mongoose';
import User from "../models/user.model";
import {generateToken,generateRefreshToken,} from "../../../utils/jwt";
import Token from "../../auth/models/auth.model";
import config from "../../../config/config";
import { ApiError } from "../../../utils/apiResponse";
import { sendVerificationEmail } from "../../../utils/mail";
import { logger } from "../../../config/logger";
import { generateOTP } from "../../../utils/common";
import {uploadOnCloudinary} from "../../../config/cloudinary"
import fs from "fs";
import { getPaginationOptions, getPaginationMeta, PaginationOptions, PaginationResult } from "../../../utils/pagination";
import { number } from 'joi';


export const updateProfile = async(data:any,userInfo:any)=>{
    try {
      if (!data || Object.keys(data).length === 0) {
      throw new ApiError(httpStatus.BAD_REQUEST, "No data provided");
    }
        const {bio,fullName,username} = data;
        console.log(`data ${data}`)
        const user = await User.findByIdAndUpdate(userInfo.id,
         {bio,fullName,username},
      { new: true, runValidators: true }
        )
   if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    } 
    return user;
   } catch (error:any) {
        console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}

export const getUserById = async(param:any)=>{
    try {
        const user = await User.findOne({_id:param})
         if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    } 
    return user
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}


export const getUserByToken = async(userData:any)=>{
    try {
        console.log(`user ${userData}`)
        const user = await User.findOne({_id:userData.id})
         if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    } 
    return user
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}


export const deactivateUser = async(userData:any)=>{
    try {
        const user = await User.findOne({_id:userData.id})
         if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "user not found");
    } 
    user.isActive=false;
    user.save()
    return user
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}


export const addAndUpdateProfilePicture = async(userInfo:any,files:any)=>{
    try {
        const user = await User.findOne({_id:userInfo.id});
        console.log(`user ${user}`)
        if(!user){
          throw new ApiError(httpStatus.NOT_FOUND,"USER NOT FOUND")
        }
          if (!files) {
      throw new ApiError(400, "No media files uploaded");
    }
          const uploaded = await uploadOnCloudinary(files[0].path);
          console.log(`file ${uploaded}`)
          user.avatar = uploaded?.secure_url
          await user.save()
          if (fs.existsSync(files.path)) fs.unlinkSync(files[0].path);
          return user
    } catch (error:any) {
        console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}


export const getUsersList = async (query: any) => {
  try {
const { page = 1, limit = 5, sortBy = "createdAt", sortOrder = "desc" } = getPaginationOptions(query);
    const skip = (page - 1) * limit;

    const result = await User.aggregate([
      {
        $sort: {
          [sortBy]: sortOrder === "asc" ? 1 : -1
        }
      },
      {
        $facet: {
          data: [
            { $skip: skip },
            { $limit: limit }
          ],
          totalCount: [
            { $count: "count" }
          ]
        }
      }
    ]);
    const data = result[0].data;
    const total = result[0].totalCount[0]?.count || 0;

    const meta = getPaginationMeta(page, limit, total);

    return {  meta,data };

  } catch (error: any) {
    console.error("Error in getUsersList service:", error);

    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};

// export const getUsersList = async()=>{
//     try {
        
//         const users = await User.find({})
//         return users;
//     } catch (error:any) {
//          console.error("Error in register service:", error);
//     console.error("Error message:", error?.message);
//     if (error instanceof ApiError) throw error;
//     throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
//     }  
// }


export const searchUsers = async(query:any,user:any)=>{
    try {
        const users = await User.aggregate([
            {
               $match: {
  isActive: true,
  $and: [
    {
      $or: [
        { username: { $regex: query, $options: "i" } },
        { fullName: { $regex: query, $options: "i" } }
      ]
    },
    {
      $or: [
        { isEmailVerified: true },
        { isPhoneVerified: true }
      ]
    }
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
                $project:{
                    coverPhoto:1,
                    avatar:1,
                    username:1,
                    fullName:1,
                    isFollowing:1,
                    isVerified:1
                }
            }
        ])
        return users;
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }  
}



export const userProfile= async(userInfo:any)=>{
    try {
        const user = await User.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(userInfo.id)}},
            {
                $set:{
                    posts:{$size:"$posts"},
                    followers:{$size:"$followers"},
                    following:{$size:"$following"},
                }
            },
            {
                $project:{
                    username:1,
                    fullName:1,
                    coverPhoto:1,
                    bio:1,
                    posts:1,
                    following:1,
                    followers:1,
                    avatar:1,
                    isVerified:1
                }
            }
        ]);
        return user[0];
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}




export const anotherUserProfile= async(userInfo:any,param:any)=>{
    try {
        const user = await User.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(param)}},
            {
                $set:{
                    posts:{$size:"$posts"},
                    followers:{$size:"$followers"},
                    following:{$size:"$following"},
                }
            },
            ///////
              {
              $lookup: {
                from: "follows",
                let: { authorId: "$_id" }, 
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $and: [
                          { $eq: ["$following", "$$authorId"] }, // is this person being followed?
                          { $eq: ["$follower", new mongoose.Types.ObjectId(userInfo.id)] } // logged in user follows?
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
                $project:{
                    username:1,
                    fullName:1,
                    coverPhoto:1,
                    bio:1,
                    posts:1,
                    following:1,
                    followers:1,
                    avatar:1,
                    isFollowing:1,
                    isVerified:1
                }
            }
        ]);
        return user[0];
    } catch (error:any) {
         console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}



export const blockUser = async(userInfo:any,userId:any)=>{
    try {
        const targetedUser = await User.findOne({_id:userId});
        // const user = await User.findOne({_id:userInfo.id});
       const user = await User.findOneAndUpdate(
  { _id: userInfo.id },
  {
    $addToSet: { blockedUsers: targetedUser?._id }, // add only if not exists
    $pull: {
      followers: targetedUser?._id,  // remove if exists
      following: targetedUser?._id   // remove if exists
    }
  },
  { new: true }
);

        if(!targetedUser){
            throw new ApiError(httpStatus.NOT_FOUND,"user not found")
        }
       
    } catch (error:any) {
           console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}


export const unBlockUser = async(userInfo:any,userId:any)=>{
    try {
        const targetedUser = await User.findOne({_id:userId});
        // const user = await User.findOne({_id:userInfo.id});
       const user = await User.findOneAndUpdate(
  { _id: userInfo.id },
  {
    $pull: {
      blockedUsers: targetedUser?._id,  // remove if exists
    }
  },
  { new: true }
);

        if(!targetedUser){
            throw new ApiError(httpStatus.NOT_FOUND,"user not found")
        }
       
    } catch (error:any) {
           console.error("Error in register service:", error);
    console.error("Error message:", error?.message);
    if (error instanceof ApiError) throw error;
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
    }
}