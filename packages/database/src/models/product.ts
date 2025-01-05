import mongoose, { Schema } from "mongoose";
import { Product } from "../lib/types";

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    active: { type: Boolean, default: true },
    // orders:[orderSchema],
    // variants: [variantSchema],
    quantity: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", productSchema);
