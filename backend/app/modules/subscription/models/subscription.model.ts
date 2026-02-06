import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  amount?: string;
  startDate: Date;
  lastPaymentDate: Date | null;
  nextPaymentDate: Date;
  status: "pending" | "active" | "paused" | "canceled" | "expired";
  autoRenew: boolean;
  cancelDate: Date | null;
  stripeSubscriptionId: string;
  stripeCustomerId: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>(
  {
    // Which user owns this subscription
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Which plan they subscribed to (Silver, Gold, Platinum)
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    amount: {
      type: String,
    },

    // Subscription start date
    startDate: {
      type: Date,
      default: Date.now,
    },

    // The last successful payment date
    lastPaymentDate: {
      type: Date,
      default: null,
    },

    // The next date the user should be charged
    nextPaymentDate: {
      type: Date,
      default: () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow;
      },
    },

    // Subscription status
    status: {
      type: String,
      enum: ["pending", "active", "paused", "canceled", "expired"],
      default: "pending",
    },

    // Automatically renew daily?
    autoRenew: {
      type: Boolean,
      default: true,
    },

    // If user cancels, record the cancel date
    cancelDate: {
      type: Date,
      default: null,
    },

    stripeSubscriptionId: {
      type: String,
      default: "",
    },

    stripeCustomerId: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

export default Subscription;



