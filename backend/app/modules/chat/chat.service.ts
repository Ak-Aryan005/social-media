// import mongoose from "mongoose";
// import { Chat, Message, IChat, IMessage } from "./chat.model";
// import { ApiError } from "../../utils/apiError";
// import httpStatus from "http-status";

import mongoose from "mongoose";
import { Chat, Message } from "./chat.model";
import { ApiError } from "../../utils/apiResponse";
import httpStatus from "http-status";
import { uploadOnCloudinary } from "../../config/cloudinary";
// export const createChat = async (chatData: Partial<IChat>): Promise<IChat> => {
//   // Check if chat already exists for two users
//   if (!chatData.isGroup && chatData.participants?.length === 2) {
//     const existingChat = await Chat.findOne({
//       participants: { $all: chatData.participants },
//       isGroup: false,
//     });
//     if (existingChat) {
//       return existingChat;
//     }
//   }
//   return Chat.create(chatData);
// };

// export const getChatById = async (id: string): Promise<IChat | null> => {
//   return Chat.findById(id)
//     .populate("participants", "username fullName avatar")
//     .populate("lastMessage");
// };

// export const getUserChats = async (userId: string) => {
//   return Chat.find({ participants: userId })
//     .populate("participants", "username fullName avatar")
//     .populate("lastMessage")
//     .sort({ lastMessageAt: -1 });
// };

// export const createMessage = async (messageData: Partial<IMessage>): Promise<IMessage> => {
//   const message = await Message.create(messageData);

//   // Update chat's last message
//   await Chat.findByIdAndUpdate(messageData.chat, {
//     lastMessage: message._id,
//     lastMessageAt: new Date(),
//   });

//   return message.populate("sender", "username fullName avatar");
// };

// export const getMessagesByChat = async (chatId: string, options: any) => {
//   const { page = 1, limit = 50 } = options;
//   const skip = (page - 1) * limit;
//   const filter = { chat: chatId };

//   const messages = await Message.find(filter)
//     .populate("sender", "username fullName avatar")
//     .sort({ createdAt: -1 })
//     .skip(skip)
//     .limit(limit);

//   const total = await Message.countDocuments(filter);

//   return {
//     data: messages,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPages: Math.ceil(total / limit),
//     },
//   };
// };

// export const markMessageAsRead = async (messageId: string, userId: string) => {
//   const message = await Message.findById(messageId);
//   if (!message) {
//     throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
//   }
//   const userIdObjectId = new mongoose.Types.ObjectId(userId);
//   if (!message.readBy.some((readById) => readById.toString() === userId)) {
//     message.readBy.push(userIdObjectId);
//     message.isRead = message.readBy.length > 0;
//     await message.save();
//   }
//   return message;
// };

// export const markChatAsRead = async (chatId: string, userId: string) => {
//   await Message.updateMany(
//     { chat: chatId, sender: { $ne: userId } },
//     { $addToSet: { readBy: userId }, $set: { isRead: true } }
//   );
// };

export const chatList = async (user: any) => {
  try {
    const chat = await Chat.aggregate([
      {
        $match: {
          participants: { $in: [new mongoose.Types.ObjectId(user.id)] },
        },
      },
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
                createdAt:1
            }}
        ]
        }
      },
      {$unwind:"$messageInfo"},
      {$unwind:"$userInfo"},
      {
        $project: {
          userInfo: 1,
          messageInfo:1
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
        const chat = await Message.find({chat:chatId})
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
