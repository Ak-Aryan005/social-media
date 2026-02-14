import mongoose from "mongoose";
import { Chat, Message } from "./chat.model";
import { ApiError } from "../../utils/apiResponse";
import httpStatus from "http-status";
import { uploadOnCloudinary } from "../../config/cloudinary";
import fs from "fs";

export const chatList = async (user: any) => {
  try {
    const chat = await Chat.aggregate([
      {
        $match: {
          participants: { $in: [new mongoose.Types.ObjectId(user.id)] },
        },
      },
      {$match:{isGroup:false}},
      {
        $lookup: {
          from: "users",
          localField: "participants",
          foreignField: "_id",
          as: "userInfo",
          pipeline: [
            {
              $match: {
                _id: { $ne: new mongoose.Types.ObjectId(user.id) },
              },
            },
            {
              $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                isVerified:1
              },
            },
          ],
        },
      },
      {
        $lookup:{
        from:"messages",
        localField:"lastMessage",
        foreignField:"_id",
        as:"messageInfo",
        pipeline:[
            {$project:{
                content:1,
                createdAt:1,
                readBy:1
            }}
        ]
        }
      },
      {$unwind:"$messageInfo"},
      {$unwind:"$userInfo"},
      {
        $project: {
          userInfo: 1,
          messageInfo:1,
        },
      },
    ]);
    return chat;
  } catch (error: any) {
    console.error("Error in register service:", error);
        console.error("Error message:", error?.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
};



export const getChat = async(chatId:any)=>{
    try {
        const chat = await Message.find({chat:chatId}).populate("sender", "_id  avatar -password")
        return chat
    } catch (error:any) {
    console.error("Error in register service:", error);
        console.error("Error message:", error?.message);
        if (error instanceof ApiError) throw error;
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error.message); 
    }
}


export const uploadChatMedia = async (files: any) => {
  try {
    if (!files || !files.length) {
      throw new ApiError(400, "No media files uploaded");
    }

    const file = files[0];
    const result = await uploadOnCloudinary(file.path);

    // 🔥 MAP CLOUDINARY → CHAT MEDIA
    let type: "image" | "video" | "audio" | "file" = "file";

    if (result?.resource_type === "image") type = "image";
    else if (result?.resource_type === "video" && result?.is_audio===false ) type = "video";
    else if (result?.is_audio===true) type = "audio";
    return {
      media: {
        url: result?.secure_url, // ✅ REQUIRED
        type,                  // ✅ REQUIRED
      },
    };
  } catch (error: any) {
    console.error("Chat media upload error:", error);
    throw error;
  }
};

import { Types } from "mongoose";
import { anothersFollowing, getFollowing } from '../follow/services/follow.service';
import { match } from "assert/strict";

export const createGroup = async (data: any, user: any) => {
  try {
    const { participantIds, groupName, groupAvatar } = data;
    const userId = user.id;

    if (!participantIds || participantIds.length < 2) {
      throw new ApiError(400, "At least 2 participants required");
    }

    // ✅ Clean + validate IDs
    const cleanedIds = participantIds.map((id: string) => id.trim());

    for (const id of cleanedIds) {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(400, `Invalid user id: ${id}`);
      }
    }

    // ✅ Include creator automatically
    const allParticipants = [
      userId,
      ...cleanedIds,
    ];

    // ✅ Remove duplicates
    const uniqueParticipants = [
      ...new Set(allParticipants),
    ];

    // ✅ Convert to ObjectIds
    const objectParticipants = uniqueParticipants.map(
      (id) => new Types.ObjectId(id)
    );

    const group = await Chat.create({
      participants: objectParticipants,
      isGroup: true,
      groupName,
      groupAvatar,
      admin: new Types.ObjectId(userId),
    });

    return group;

  } catch (error: any) {
    console.error("Error in createGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to create group"
    );
  }
};



export const getUsersListForGroup = async (user: any) => {
  try {
    const [chats, following] = await Promise.all([
      chatList(user),
      getFollowing(user),
    ]);

    // 1️⃣ Extract users from chatList
    const chatUsers = chats.map((chat: any) => {
      const u = chat.userInfo;
      return {
        _id: u._id,
        username: u.username,
        fullName: u.fullName,
        avatar: u.avatar,
        isVerified: u.isVerified || false,
      };
    });

    // 2️⃣ Create a Set of existing user IDs
    const chatUserIds = new Set(
      chatUsers.map((u: any) => u._id.toString())
    );

    // 3️⃣ Filter following list
    const filteredFollowing = following
      .filter((u: any) => {
        const realId = u.userId || u._id;
        return !chatUserIds.has(realId.toString());
      })
      .map((u: any) => ({
        _id: u.userId || u._id,
        username: u.username,
        fullName: u.fullName,
        avatar: u.avatar,
        isVerified: u.isVerified || false,
      }));

    // 4️⃣ Combine
    return [...chatUsers, ...filteredFollowing];

  } catch (error: any) {
    console.error("Error in getUsersListForGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to fetch users for group"
    );
  }
};


export const getGroupList = async(user:any)=>{
  try {
    const group = Chat.aggregate([
      { $match: {
          participants: { $in: [new mongoose.Types.ObjectId(user.id)] },
          isGroup:true
        },
      },
      {
        $lookup:{
        from:"messages",
        localField:"lastMessage",
        foreignField:"_id",
        as:"messageInfo",
        pipeline:[
            {$project:{
                content:1,
                createdAt:1
            }}
        ]
        }
      },
      {
  $unwind: {
    path: "$messageInfo",
    preserveNullAndEmptyArrays: true
  }
},
      {
        $project:{
          groupName:1,
          groupAvatar:1,
          messageInfo:1,
          isGroup:1
        }
      }
    ]);
    return group;
  } catch (error:any) {
     console.error("Error in getUsersListForGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to fetch users for group"
    );
  }
}



export const getGroupMembers = async(chatId:string) =>{
try {
  const group = await Chat.aggregate([
    {$match:{ _id: new mongoose.Types.ObjectId(chatId),isGroup:true}},
 {
    $lookup: {
      from: "users", // actual MongoDB collection name
      localField: "participants",
      foreignField: "_id",
      as: "participants",
      pipeline:[
        {
          $project:{
            _id:1,
            username:1,
            fullName:1,
            avatar:1
          }
        }
      ]
    },
  },
  {
      $project:{
        _id:1,
        groupName:1,
        groupAvatar:1,
        admin:1,
        participants:1
      }
    }
  ])
  // const group = await Chat.findOne({_id:chatId})
  console.log(`id ${chatId}`)
  return group[0];
} catch (error:any) {
   console.error("Error in getUsersListForGroup service:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to fetch users for group");
}
}


export const updateGroup = async (
  user: any,
  data: any,
  files: any
) => {
  try {
    const group = await Chat.findById(data.chatId);
console.log(`user ${user.id}`)
    if (!group) {
      throw new ApiError(httpStatus.NOT_FOUND, "GROUP NOT FOUND");
    }
    if (group?.admin?.toString() !== user.id.toString()) {
      throw new ApiError(httpStatus.NOT_FOUND, "YOU ARE NOT ADMIN");
    }

    // Update group name if provided
    if (data?.name) {
      group.groupName = data.name;
    }

    // Update avatar if file provided
    if (files && files.length > 0) {
      const uploaded = await uploadOnCloudinary(files[0].path);

      if (!uploaded?.secure_url) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Avatar upload failed"
        );
      }

      group.groupAvatar = uploaded.secure_url;

      // Delete local file after upload
      if (fs.existsSync(files[0].path)) {
        fs.unlinkSync(files[0].path);
      }
    }

    await group.save();
     console.log(`group ${group}`)
    return group;

  } catch (error: any) {
    console.error("Error in updateGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to update group"
    );
  }
};



export const leaveGroup = async(chatId:string,user:any) =>{
  try {
    const chat = await Chat.findById(chatId);

    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
    }

    if (chat?.admin?.toString() === user.id.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, "Admin must assign a new admin before leaving the group.");
    }

    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: user.id } },
      { new: true }
    );
    
  } catch (error:any) {
    console.error("Error in updateGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to update group"
    );
  }
}



export const removeMembers = async (
  chatId: string,
  userIds: string[],
  user: any
) => {
  try {
    const chat = await Chat.findById(chatId);
    const ids = Array.isArray(userIds) ? userIds : [userIds];

    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
    }

    if (chat?.admin?.toString() !== user.id.toString()) {
      throw new ApiError(httpStatus.FORBIDDEN, "YOU ARE NOT ADMIN");
    }

    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: { $in: ids } } },
      { new: true }
    );

    return updatedGroup;
  } catch (error: any) {
    console.error("Error in updateGroup service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to update group"
    );
  }
};



export const addMembers = async (
  chatId: string,
  data: any,
  user: any
) => {
  try {
    const { participantIds } = data;
    const userId = user.id;

    if (!Array.isArray(participantIds) || participantIds.length < 1) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "At least one participant is required"
      );
    }

    // 🔎 Validate chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(httpStatus.NOT_FOUND, "Chat not found");
    }

    // 🔐 Admin check
    if (chat?.admin?.toString() !== userId.toString()) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Only the admin can add members"
      );
    }

    // ✅ Clean + validate IDs
    const cleanedIds = participantIds.map((id: string) => id.trim());

    for (const id of cleanedIds) {
      if (!Types.ObjectId.isValid(id)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          `Invalid user id: ${id}`
        );
      }
    }

    // ❌ Prevent adding admin again (optional but clean)
    const idsToAdd = cleanedIds.filter(
      (id: string) => id !== chat?.admin?.toString()
    );

    // ✅ Convert to ObjectIds
    const objectParticipants = idsToAdd.map(
      (id: string) => new Types.ObjectId(id)
    );

    // ✅ Add members safely (no duplicates)
    const updatedGroup = await Chat.findByIdAndUpdate(
      chatId,
      {
        $addToSet: {
          participants: { $each: objectParticipants },
        },
      },
      { new: true }
    );

    return updatedGroup;
  } catch (error: any) {
    console.error("Error in addMembers service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to add members"
    );
  }
};



export const makeAdmin = async (
  chatId: string,
  newAdminId: string,
  user: any
) => {
  try {
    // 🔎 Validate ObjectId
    console.log(`member ${JSON.stringify(newAdminId)}`)
    if (!Types.ObjectId.isValid(newAdminId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Invalid user id"
      );
    }

    // 🔎 Find chat
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        "Chat not found"
      );
    }

    // 🔐 Only current admin can assign
    if (chat?.admin?.toString() !== user.id.toString()) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Only the admin can assign a new admin"
      );
    }

    // ❌ Cannot assign admin to self
    if (chat?.admin?.toString() === newAdminId.toString()) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User is already the admin"
      );
    }

    // 👥 New admin must be a participant
    const isParticipant = chat.participants
      .map((id: any) => id.toString())
      .includes(newAdminId);

    if (!isParticipant) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "User must be a group member to become admin"
      );
    }

    // ✅ Assign new admin
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { admin: newAdminId },
      { new: true }
    );

    return updatedChat;
  } catch (error: any) {
    console.error("Error in makeAdmin service:", error);

    if (error instanceof ApiError) throw error;

    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      error.message || "Failed to assign admin"
    );
  }
};
