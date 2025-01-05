import mongoose from "mongoose";
import { Category } from "../lib/types";
const categorySchema = new mongoose.Schema<Category>(
  {
    name: String,
    slug: String,
    subcategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  },
  { timestamps: true }
);
export const CategoryModel =
  (mongoose.models.Category as mongoose.Model<Category>) ||
  mongoose.model<Category>("Category", categorySchema);
