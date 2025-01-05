import mongoose from "mongoose";
import { Variant } from "../lib/types";

const variantSchema = new mongoose.Schema<Variant>({
  sku: { type: String, required: true, uppercase: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  options: [{ type: Object, required: true }],
});

export const VariantModel =
  (mongoose.models.Variant as mongoose.Model<Variant>) ||
  mongoose.model<Variant>("Variant", variantSchema);
