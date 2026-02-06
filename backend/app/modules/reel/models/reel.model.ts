import mongoose, { Schema, Document } from "mongoose";

export interface IReel extends Document {
  user: mongoose.Types.ObjectId;
  media: {
    url: string;
    thumbnail?: string;
    duration?: number;
  };
  caption?: string;
  audio?: string;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  views: number;
  shares: number;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const reelSchema = new Schema<IReel>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    media: {
      url: {
        type: String,
        required: true,
      },
      thumbnail: {
        type: String,
      },
      duration: {
        type: Number,
      },
    },
    caption: {
      type: String,
      maxlength: 2200,
    },
    audio: {
      type: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reelSchema.index({ user: 1, createdAt: -1 });
reelSchema.index({ createdAt: -1 });

const Reel = mongoose.model<IReel>("Reel", reelSchema);

export default Reel;

