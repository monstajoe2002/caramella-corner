import mongoose from "mongoose";
import { Order } from "../lib/types";

const orderSchema = new mongoose.Schema<Order>({
  pricePaidInPiasters: { type: Number, required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  status: {
    type: String,
    enum: ["pending", "delivered"],
    default: "pending",
  },
});
