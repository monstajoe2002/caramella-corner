import mongoose from "mongoose";
import { Variant } from "../types";

export const VariantSchema = new mongoose.Schema<Variant>({
  sku: { type: String, required: true, uppercase: true },
  quantity: { type: Number, required: true },
  color: String,
  size: mongoose.Schema.Types.Mixed,
});

export const VariantModel =
  (mongoose.models.Variant as mongoose.Model<Variant>) ||
  mongoose.model<Variant>("Variant", VariantSchema);
