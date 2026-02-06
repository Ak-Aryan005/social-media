// import { Server as SocketServer } from "socket.io";
// import mongoose from "mongoose";
// import { SOCKET_EVENTS } from "../../constants/events";
// import { createMessage, markMessageAsRead, markChatAsRead } from "./chat.service";
// import { logger } from "../../config/logger";

// export const initializeChatGateway = (io: SocketServer) => {
//   // Setup handlers for new connections
//   io.on(SOCKET_EVENTS.CONNECTION, (socket) => {
//     setupChatHandlers(socket, io);
//   });
// };

// const setupChatHandlers = (socket: any, io: SocketServer) => {
//   const user = socket.user;
//   if (!user) {
//     logger.warn("Socket connection without user authentication");
//     return;
//   }

//   logger.info(`Setting up chat handlers for user ${user.id}`);

//     // Join chat room
//     socket.on(SOCKET_EVENTS.JOIN_ROOM, async (chatId: string) => {
//       socket.join(`chat:${chatId}`);
//       logger.info(`User ${user?.id} joined chat ${chatId}`);
      
//       // Mark chat as read when user joins
//       try {
//         await markChatAsRead(chatId, user.id);
//       } catch (error: any) {
//         logger.error(`Error marking chat as read: ${error.message}`);
//       }
//     });

//     // Leave chat room
//     socket.on(SOCKET_EVENTS.LEAVE_ROOM, (chatId: string) => {
//       socket.leave(`chat:${chatId}`);
//       logger.info(`User ${user?.id} left chat ${chatId}`);
//     });

//     // Send message
//     socket.on(SOCKET_EVENTS.SEND_MESSAGE, async (data: {
//       chatId: string;
//       content?: string;
//       media?: {
//         type: "image" | "video" | "audio" | "file";
//         url: string;
//       };
//     }) => {
//       try {
//         const message = await createMessage({
//           chat: new mongoose.Types.ObjectId(data.chatId),
//           sender: user.id,
//           content: data.content,
//           media: data.media,
//         });

//         // Emit message to all users in the chat room
//         io.to(`chat:${data.chatId}`).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, message);
        
//         // Also notify users in their personal rooms
//         const { Chat } = await import("./chat.model");
//         const chat = await Chat.findById(data.chatId);
//         if (chat) {
//           chat.participants.forEach((participantId: mongoose.Types.ObjectId) => {
//             if (participantId.toString() !== user.id) {
//               io.to(`user:${participantId}`).emit(SOCKET_EVENTS.NOTIFICATION, {
//                 type: "message",
//                 title: "New Message",
//                 message: data.content || "Sent a media",
//                 data: { chatId: data.chatId, messageId: message._id },
//               });
//             }
//           });
//         }
//       } catch (error: any) {
//         logger.error(`Error sending message: ${error.message}`);
//         socket.emit("error", { message: "Failed to send message" });
//       }
//     });

//     // Typing indicator
//     socket.on(SOCKET_EVENTS.TYPING, (chatId: string) => {
//       socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_TYPING, {
//         userId: user.id,
//         chatId,
//       });
//     });

//     // Stop typing indicator
//     socket.on(SOCKET_EVENTS.STOP_TYPING, (chatId: string) => {
//       socket.to(`chat:${chatId}`).emit(SOCKET_EVENTS.USER_TYPING, {
//         userId: user.id,
//         chatId,
//         typing: false,
//       });
//     });

//     // Message read
//     socket.on(SOCKET_EVENTS.MESSAGE_READ, async (messageId: string) => {
//       try {
//         await markMessageAsRead(messageId, user.id);
//         socket.emit(SOCKET_EVENTS.MESSAGE_READ, { messageId });
//       } catch (error: any) {
//         logger.error(`Error marking message as read: ${error.message}`);
//       }
//     });

//     // Handle disconnection
//     socket.on(SOCKET_EVENTS.DISCONNECT, () => {
//       logger.info(`User ${user?.id} disconnected from chat`);
//     });
// };







import { Server, Socket } from "socket.io";
import { Chat, Message } from "./chat.model";
import mongoose, { Types } from "mongoose";

// export const chatSocket = (io: Server, socket: Socket) => {

//   /**
//    * Join a chat room
//    */
//   socket.on("join-chat", async (chatId: string) => {
//     socket.join(`chat:${chatId}`);
//   });

//   /**
//    * Send message
//    */
//   socket.on("send-message", async (data) => {
//     try {
//       const { chatId, senderId, content, media } = data;

//       // 1️⃣ Validate chat
//       const chat = await Chat.findById(chatId);
//       if (!chat) return;

//       // 2️⃣ Check sender is participant
//       const senderObjectId = new mongoose.Types.ObjectId(senderId);
//       if (!chat.participants.some(p => p.equals(senderObjectId))) {
//         return;
//       }

//       // 3️⃣ Create message
//       const message = await Message.create({
//         chat: chat._id,
//         sender: senderObjectId,
//         content,
//         media,
//         readBy: [senderObjectId], // sender has read it
//       });

//       // 4️⃣ Update chat metadata
//       chat.lastMessage = message._id;
//       chat.lastMessageAt = new Date();
//       await chat.save();

//       // 5️⃣ Emit to everyone in the chat
//       io.to(`chat:${chatId}`).emit("new-message", {
//         _id: message._id,
//         chat: chatId,
//         sender: senderId,
//         content: message.content,
//         media: message.media,
//         createdAt: message.createdAt,
//       });

//     } catch (err) {
//       console.error("send-message error:", err);
//     }
//   });
// };










// export const chatSocket = (io: Server, socket: Socket) => {
//   /**
//    * Join or create chat (MongoDB auto _id)
//    */
//   socket.on("join-chat", async (data, callback) => {
//     try {
//       const { userId, participants } = data;
//     // console.log("join-chat payload:", data);

//       const userObjectId = new mongoose.Types.ObjectId(userId);
//  const participantIds: Types.ObjectId[] = Array.isArray(participants)
//   ? participants.map((id: string) => new mongoose.Types.ObjectId(id))
//   : [];
// // const participantIds =
// console.log("usr",userObjectId)
// console.log("anousr",participantIds)
//       // Ensure user is included
//       if (!participantIds.some((p:Types.ObjectId) => p.equals(userObjectId))) {
//         participantIds.push(userObjectId);
//       }
// console.log("data",userId,participants)

//       // 1️⃣ OPTIONAL: Check for existing 1-1 chat
//       let chat = await Chat.findOne({
//         participants: { $all: participantIds, $size: participantIds.length }
//       });
// console.log("jon",chat)
//       // 2️⃣ Create chat if not exists
//       if (!chat) {
//         chat = await Chat.create({
//           participants: participantIds,
//         });
//       }

//       // 3️⃣ Join socket room using auto-generated _id
//       socket.join(`chat:${chat._id.toString()}`);

//       // 4️⃣ Return chatId to client
//       callback?.({
//         chatId: chat._id,
//         participants: chat.participants,
//       });

//     } catch (err) {
//       console.error("join-chat error:", err);
//       callback?.({ error: "Failed to join chat" });
//     }
//   });

//   /**
//    * Send message
//    */
//   socket.on("send-message", async (data) => {
//     try {
//       const { chatId, senderId, content, media } = data;
//       const chat = await Chat.findById(chatId);
//       // const chat = await Chat.findOne({chat:chatId,participants: { $in: [senderId] }});
//       if (!chat) return;
//       const senderObjectId = new mongoose.Types.ObjectId(senderId);
//       if (!chat.participants.some(p => p.equals(senderObjectId))) return;

//       const message = await Message.create({
//         chat: chat._id,
//         sender: senderObjectId,
//         content,
//         media,
//         readBy: [senderObjectId],
//       });

//       chat.lastMessage = message._id;
//       chat.lastMessageAt = new Date();
//       await chat.save();

//       io.to(`chat:${chatId}`).emit("new-message", {
//         _id: message._id,
//         chat: chatId,
//         sender: senderId,
//         content: message.content,
//         media: message.media,
//         createdAt: message.createdAt,
//       });

//     } catch (err) {
//       console.error("send-message error:", err);
//     }
//   });
// };





export const chatSocket = (io: Server, socket: Socket) => {

  /**
   * Join existing chat only
   */
  // socket.on("join-chat", async (chatId: string, callback) => {
  //   try {
  //     const userId = socket.user!.id;
  //     const userObjectId = new Types.ObjectId(userId);
  //     const chat = await Chat.findById(chatId);
  //     if (!chat) return callback?.({ error: "Chat not found" });

  //     if (!chat.participants.some(p => p.equals(userObjectId))) {
  //       return callback?.({ error: "Unauthorized" });
  //     }

  //     socket.join(`chat:${chat._id.toString()}`);

  //     callback?.({ success: true });
  //   } catch (err) {
  //     console.error("join-chat error:", err);
  //     callback?.({ error: "Failed to join chat" });
  //   }
  // });
socket.on("join-chat", async (chatId: string, callback) => {
  try {
    const userId = socket.user!.id;
    const userObjectId = new Types.ObjectId(userId);
console.log(`usrj${userId}`)
    const chat = await Chat.findById(chatId);
    if (!chat) {
      return callback?.({ error: "Chat not found" });
    }

    // ✅ Authorization check (DB-level)
    const isParticipant = chat.participants.some(p =>
      p.equals(userObjectId)
    );

    if (!isParticipant) {
      return callback?.({ error: "Not a participant" });
    }

    // ✅ ACTUALLY join the socket room
    const roomName = `chat:${chatId}`;
    socket.join(roomName);

    console.log(
      `✅ User ${userId} joined room ${roomName}`,
      socket.rooms
    );
    const message = await Message.findOneAndUpdate(
  { chat: chat._id, _id: chat.lastMessage },
  { $addToSet: { readBy: socket.user!.id } },
  { new: true }
);
    
    callback?.({ success: true });
  } catch (err) {
    console.error("join-chat error:", err);
    callback?.({ error: "Join chat failed" });
  }
});
 
  /**
   * Send message (create chat if needed)
   */
  socket.on("send-message", async (data, callback) => {
    try {
      const senderId = socket.user!.id;
      // const senderId = data.userId;
      const senderObjectId = new Types.ObjectId(senderId);
// console.log(`usr${senderId}`)
      let { chatId, receiverId, content } = data;

      let chat;

      // 1️⃣ Existing chat
      if (chatId) {
        chat = await Chat.findById(chatId);
        if (!chat) return;

        if (!chat.participants.some(p => p.equals(senderObjectId))) {
          return;
        }
      }

      // 2️⃣ First message → create chat
      else {
        if (!receiverId) {
          return callback?.({ error: "receiverId required" });
        }

        const receiverObjectId = new Types.ObjectId(receiverId);

        const participants = [senderObjectId, receiverObjectId]
          .sort((a, b) => a.toString().localeCompare(b.toString()));

        // Find or create atomically
        chat = await Chat.findOneAndUpdate(
          { participants },
          { $setOnInsert: { participants } },
          { new: true, upsert: true }
        );

        socket.join(`chat:${chat._id.toString()}`);
      }

  let media: any = null;

if (data.media ) {
  media = {
    type: data.media.type,
    url: data.media.url,
  };
}

console.log("📎 MEDIA AFTER NORMALIZE:", media);
      // 3️⃣ Save message
      const message = await Message.create({
        chat: chat._id,
        sender: senderObjectId,
        content,
        // media,
        ...(media ? { media } : {}),
        readBy: [senderObjectId],
      });

      // 4️⃣ Update chat
      chat.lastMessage = message._id;
      chat.lastMessageAt = new Date();
      await chat.save();

      // 5️⃣ Emit message
      io.to(`chat:${chat._id.toString()}`).emit("new-message", {
        _id: message._id,
        chatId: chat._id,
        sender: senderId,
        content: message.content,
        media: message.media,
        createdAt: message.createdAt,
      });

      // 6️⃣ ACK to sender
      callback?.({
        success: true,
        chatId: chat._id,
        messageId: message._id,
      });

    } catch (err) {
      console.error("send-message error:", err);
      callback?.({ error: "Failed to send message" });
    }
  });
};
