import mongoose, { Schema, Document } from "mongoose";

export interface IAdmin extends Document {
  user: mongoose.Types.ObjectId;
  permissions: string[];
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    permissions: [
      {
        type: String,
      },
    ],
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
adminSchema.index({ user: 1 });
adminSchema.index({ isSuperAdmin: 1 });

const Admin = mongoose.model<IAdmin>("Admin", adminSchema);

export default Admin;

