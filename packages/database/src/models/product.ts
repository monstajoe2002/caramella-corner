import { Schema, model } from "mongoose";
import { Product } from "../lib/types";

const productSchema = new Schema<Product>({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  active: { type: Boolean, default: true },
  // orders:[orderSchema],
  // variants: [variantSchema],
  quantity: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const ProductModel = model<Product>("product", productSchema);
