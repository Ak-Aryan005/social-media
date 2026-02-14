import mongoose, { Schema, Document } from "mongoose";

export interface IOnboarding extends Document {
  user: mongoose.Types.ObjectId;
  step: number;
  profileSetup: {
    avatar?: string;
    bio?: string;
    coverPhoto?: string;
    completed: boolean;
  };
  interests: {
    categories: string[];
    completed: boolean;
  };
  followSuggestions: {
    followed: mongoose.Types.ObjectId[];
    skipped: boolean;
    completed: boolean;
  };
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const onboardingSchema = new Schema<IOnboarding>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    step: {
      type: Number,
      default: 1,
      min: 1,
      max: 4,
    },
    profileSetup: {
      avatar: {
        type: String,
      },
      bio: {
        type: String,
        maxlength: 150,
      },
      coverPhoto: {
        type: String,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    interests: {
      categories: [
        {
          type: String,
        },
      ],
      completed: {
        type: Boolean,
        default: false,
      },
    },
    followSuggestions: {
      followed: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      ],
      skipped: {
        type: Boolean,
        default: false,
      },
      completed: {
        type: Boolean,
        default: false,
      },
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
onboardingSchema.index({ user: 1 });
onboardingSchema.index({ completed: 1 });

const Onboarding = mongoose.model<IOnboarding>("Onboarding", onboardingSchema);

export default Onboarding;

