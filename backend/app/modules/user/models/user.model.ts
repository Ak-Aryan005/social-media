import mongoose, { Schema, Document } from "mongoose";
import { USER_ROLES } from "../../../config/constants";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  email: string;
  phone: string;
  password: string;
  username: string;
  fullName: string;
  bio?: string;
  avatar?: string;
  coverPhoto?: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  role: string;
  followers: mongoose.Types.ObjectId[];
  following: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
  blockedUsers: mongoose.Types.ObjectId[];
  isActive: boolean;
  isVerified: boolean;
  lastLogin?: Date;
  onboardingCompleted: boolean;
  onboardingStep: number;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(enteredPassword: string): Promise<boolean>;

}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
      trim: true,
        default:""
    },
    phone:{
        type: String,
      // required: true,
      unique: true,
      // lowercase: true,
      trim: true,
      // default:""
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    fullName: {
      type: String,
      // required: true,
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 150,
    },
    avatar: {
      type: String,
    },
    coverPhoto: {
      type: String,
      default:null
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified:{
      type: Boolean,
      default: false,
    },
    isVerified:{
     type:Boolean,
     default:false
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.USER,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    blockedUsers: [
  {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
    onboardingStep: {
      type: Number,
      default: 0,
      min: 0,
      max: 4,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ createdAt: -1 });

userSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phone: { $exists: true, $nin: [null, ""] }
    }
  }
);




userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});


userSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>("User", userSchema);

export default User;










