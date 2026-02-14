import mongoose, { Schema, Document } from "mongoose";

export interface IComment extends Document {
  user: mongoose.Types.ObjectId;
  post: mongoose.Types.ObjectId;
  content: string;
  likes: mongoose.Types.ObjectId[];
  replies: mongoose.Types.ObjectId[];
  parentComment?: mongoose.Types.ObjectId;
  targetType: "post" | "comment" | "story" | "reel";
  targetId: mongoose.Types.ObjectId;
  isdeleted:boolean
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // post: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Post",
    //   required: true,
    //   index: true,
    // },
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
    content: {
      type: String,
      required: true,
      maxlength: 1000,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    parentComment: {
      type: Schema.Types.ObjectId,
      ref: "Comment",
    },
    isdeleted:{
      type:Boolean,
      default:false
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
commentSchema.index({ post: 1, createdAt: -1 });
commentSchema.index({ user: 1 });

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;

