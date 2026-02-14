import mongoose, { Schema, Document } from "mongoose";

export interface IChat extends Document {
  participants: mongoose.Types.ObjectId[];
  lastMessage?: mongoose.Types.ObjectId;
  lastMessageAt?: Date;
  isGroup: boolean;
  groupName?: string;
  groupAvatar?: string;
  admin?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const chatSchema = new Schema<IChat>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
    lastMessageAt: {
      type: Date,
    },
    isGroup: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
    },
    groupAvatar: {
      type: String,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
// chatSchema.index({ participants: 1 },  { unique: true, partialFilterExpression: { isGroup: false } });
chatSchema.index({ participants: 1 }, { unique: true });
chatSchema.index({ lastMessageAt: -1 });

export interface IMessage extends Document {
  chat: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content?: string;
  media?: {
    type: "image" | "video" | "audio" | "file";
    url: string;
  };
  // isRead: boolean;
  readBy: mongoose.Types.ObjectId[];
  deletedFor:mongoose.Types.ObjectId[];
  isDeletedForEveryone: boolean;
  reactions: {
    user: mongoose.Types.ObjectId;
    emoji: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      maxlength: 5000,
    },
    media: {
      type: {
        type: String,
        enum: ["image", "video", "audio", "file"],
      },
      url: {
        type: String,
      },
    },
    readBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
      deletedFor: [
      { type: Schema.Types.ObjectId, ref: "User" },
    ],
     reactions: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        emoji: String,
      },
    ],
      isDeletedForEveryone: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
messageSchema.index({ chat: 1, createdAt: -1 });
messageSchema.index({ sender: 1 });

const Chat = mongoose.model<IChat>("Chat", chatSchema);
const Message = mongoose.model<IMessage>("Message", messageSchema);

export { Chat, Message };

