import mongoose, { Schema, Document } from "mongoose";

export interface IPlan extends Document {
  name: string;
  description: string;
  price: number;
  priceId?: string;
  productId?: string;
  interval?: string;
}

const planSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: true,
    unique: true,
  },

  description: {
    type: String,
    default: "",
  },

  price: {
    type: Number,
    required: true,
  },

  priceId: {
    type: String,
  },

  productId: {
    type: String,
  },

  interval: {
    type: String,
  },
});

const Plan = mongoose.model<IPlan>("Plan", planSchema);

export default Plan;
