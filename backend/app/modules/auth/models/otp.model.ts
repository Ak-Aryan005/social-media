import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

export interface IOtp extends Document {
  code: string; // this should be hashed
  purpose: string;
  user: mongoose.Types.ObjectId;
  email?: string;
  phone?: string;
  expiresAt: Date;
  used: boolean;
  createdAt: Date;
  updatedAt: Date;

  compareOtp: (enteredOtp: string) => Promise<boolean>;
}

const otpSchema = new Schema<IOtp>(
  {
    code: {
      type: String,
      required: true,
      trim: true,
      // select: false, // hide hashed OTP from DB results
    },

    user: {
     type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      index: true,
    },

    phone: {
      type: String,
      trim: true,
      index: true,
    },

    purpose: {
      type: String,
      enum: ["login", "verifyEmail", "verifyPhone", "resetPassword", "generic"],
      default: "generic",
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    used: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);



// Indexes
otpSchema.index({ user: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 });

const Otp = mongoose.model<IOtp>("Otp", otpSchema);

export default Otp;
