import mongoose, { Schema } from "mongoose";
import { Product } from "../types";
import { VariantSchema } from "./variant";

const productSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    description: { type: String, required: true },
    material: { type: String, required: true },
    countryOfOrigin: { type: String, required: true },
    category: { type: mongoose.SchemaTypes.ObjectId, ref: "Category" },
    priceInPiasters: { type: Number, required: true },
    active: { type: Boolean, default: true },
    image: { type: String, required: true },
    orders: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Order" }],
    variants: [VariantSchema],
  },
  {
    timestamps: true,
  }
);

export const ProductModel =
  (mongoose.models.Product as mongoose.Model<Product>) ||
  mongoose.model<Product>("Product", productSchema);
