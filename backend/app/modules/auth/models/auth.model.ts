import mongoose, { Schema, Document } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: mongoose.Types.ObjectId;
  type: string;
  expires: Date;
  blacklisted: boolean;
  createdAt: Date;
}

const tokenSchema = new Schema<IToken>(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["refresh", "resetPassword", "verifyEmail"],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
tokenSchema.index({ token: 1, type: 1 });
tokenSchema.index({ expires: 1 }, { expireAfterSeconds: 0 });

const Token = mongoose.model<IToken>("Token", tokenSchema);

export default Token;

