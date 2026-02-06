import mongoose, { Schema, Document } from "mongoose";

export interface IStory extends Document {
  user: mongoose.Types.ObjectId;
  media?: {
    type?: "image" | "video";
    url?: string;
  };
  caption?: string;
  views: mongoose.Types.ObjectId[];
  expiresAt: Date;
  createdAt: Date;
}

const storySchema = new Schema<IStory>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    media: {
      type: {
        type: String,
        enum: ["image", "video"],
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    caption: {
      type: String,
      maxlength: 200,
    },
    views: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    expiresAt: {
      type: Date,
      required: true,
      // default: () => new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      default: () => new Date(Date.now() +  60 * 60 * 1000), // 1 hour
      // default: () => new Date(Date.now() +  60 * 1000), // 1 minute
      // index: { expireAfterSeconds: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
storySchema.index({ user: 1, createdAt: -1 });
storySchema.index({ expiresAt: 1 });

const Story = mongoose.model<IStory>("Story", storySchema);

export default Story;

