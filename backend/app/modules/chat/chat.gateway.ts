import { Server, Socket } from "socket.io";
import { Chat, Message } from "./chat.model";
import mongoose, { Types } from "mongoose";

export const chatSocket = (io: Server, socket: Socket) => {

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
 
socket.on("send-message", async (data, callback) => {
  try {
    const senderId = socket.user!.id;
    const senderObjectId = new Types.ObjectId(senderId);

    const { chatId, receiverId, content, media } = data;

    let chat;

    /**
     * 1️⃣ If chatId provided → existing chat (group or 1-1)
     */
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat) {
        return callback?.({ error: "Chat not found" });
      }

      const isParticipant = chat.participants.some(p =>
        p.equals(senderObjectId)
      );

      if (!isParticipant) {
        return callback?.({ error: "Not authorized" });
      }
    }

    /**
     * 2️⃣ If NO chatId → create/find 1-to-1 chat
     */
    else if (receiverId) {
      const receiverObjectId = new Types.ObjectId(receiverId);

      // Sort to prevent duplicate chats
      const participants = [senderObjectId, receiverObjectId]
        .sort((a, b) =>
          a.toString().localeCompare(b.toString())
        );

      chat = await Chat.findOneAndUpdate(
        {
          participants,
          isGroup: false,
        },
        {
          $setOnInsert: {
            participants,
            isGroup: false,
          },
        },
        { new: true, upsert: true }
      );

      // Join sender to room
      socket.join(`chat:${chat._id.toString()}`);
    }

    else {
      return callback?.({
        error: "chatId or receiverId required",
      });
    }

    /**
     * 3️⃣ Normalize media
     */
    let normalizedMedia = null;
    if (media) {
      normalizedMedia = {
        type: media.type,
        url: media.url,
      };
    }

    /**
     * 4️⃣ Create message
     */
    const message = await Message.create({
      chat: chat._id,
      sender: senderObjectId,
      content,
      ...(normalizedMedia ? { media: normalizedMedia } : {}),
      readBy: [senderObjectId],
    });
const populatedMessage = await message.populate(
  "sender",
  "_id  avatar -password"
);
    /**
     * 5️⃣ Update chat
     */
    chat.lastMessage = message._id;
    chat.lastMessageAt = new Date();
    await chat.save();

    /**
     * 6️⃣ Emit message
     */
    io.to(`chat:${chat._id.toString()}`).emit("new-message", {
      _id: message._id,
      chatId: chat._id,
      sender: populatedMessage.sender,
      content: message.content,
      media: message.media,
      createdAt: message.createdAt,
    });

    /**
     * 7️⃣ ACK
     */
    callback?.({
      success: true,
      chatId: chat._id, // important if it was newly created
      messageId: message._id,
    });

  } catch (err) {
    console.error("send-message error:", err);
    callback?.({ error: "Failed to send message" });
  }
});

};
