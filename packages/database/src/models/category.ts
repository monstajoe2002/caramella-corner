import mongoose from "mongoose";
import { Category } from "../types";
const categorySchema = new mongoose.Schema<Category>(
  {
    name: String,
    slug: String,
    subcategories: [{ type: String }],
  },
  { timestamps: true }
);
export const CategoryModel =
  (mongoose.models.Category as mongoose.Model<Category>) ||
  mongoose.model<Category>("Category", categorySchema);
