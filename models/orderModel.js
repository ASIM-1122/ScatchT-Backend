import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  amount: Number,
  paymentStatus: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const orderModel = mongoose.model("Order", orderSchema);
