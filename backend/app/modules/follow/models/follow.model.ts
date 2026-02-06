import mongoose, { Schema, Document } from "mongoose";

export interface IFollow extends Document {
  follower: mongoose.Types.ObjectId;
  following: mongoose.Types.ObjectId;
  createdAt: Date;
}

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to prevent duplicate follows and self-follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });
followSchema.index({ following: 1 });

// Prevent self-follow
followSchema.pre("save", function (next) {
  if (this.follower.toString() === this.following.toString()) {
    next(new Error("Cannot follow yourself"));
  } else {
    next();
  }
});

const Follow = mongoose.model<IFollow>("Follow", followSchema);

export default Follow;

