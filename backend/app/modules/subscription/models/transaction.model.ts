
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  planId?: Types.ObjectId;
  amount: number;
  currency: string;
  status: "pending" | "success" | "failed" | "refunded";
  paymentMethod: string;
  transactionId: string | null;
  refundId: string | null;
  refundedAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
    },

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "USD",
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed", "refunded"],
      default: "pending",
    },

    paymentMethod: {
      type: String,
      default: "stripe",
    },

    transactionId: {
      type: String,
      default: null,
    },

    refundId: {
      type: String,
      default: null,
    },

    refundedAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
