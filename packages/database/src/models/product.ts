import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  active: { type: Boolean, default: true },
  // orders:[orderSchema],
  // variants: [variantSchema],
  stock: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

export const Product = model("Product", productSchema);
