import { Category } from "../types";

export type CreateCategoryDto = Omit<
  Category,
  "_id" | "createdAt" | "updatedAt" | "slug"
>;

export type UpdateCategoryDto = Omit<
  Partial<Category>,
  "createdAt" | "updatedAt" | "slug"
>;
