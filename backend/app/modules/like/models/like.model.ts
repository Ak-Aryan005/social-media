import mongoose, { Schema, Document } from "mongoose";

export interface ILike extends Document {
  user: mongoose.Types.ObjectId;
  targetType: "post" | "comment" | "story" | "reel";
  targetId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    targetType: {
      type: String,
      enum: ["post", "comment", "story", "reel"],
      required: true,
    },
    targetId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "targetType",
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate likes
likeSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
likeSchema.index({ targetType: 1, targetId: 1 });

const Like = mongoose.model<ILike>("Like", likeSchema);

export default Like;

