import mongoose, { Schema, Document } from "mongoose";
import { NOTIFICATION_TYPES } from "../../config/constants";

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  type: string;
  title: string;
  message: string;
  relatedUser?: mongoose.Types.ObjectId;
  relatedPost?: mongoose.Types.ObjectId;
  relatedComment?: mongoose.Types.ObjectId;
  isRead: boolean;
  createdAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(NOTIFICATION_TYPES),
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    relatedUser: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    relatedPost: {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
    relatedComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ createdAt: -1 });

const Notification = mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;

