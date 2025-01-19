import { Category } from "../types";

export type CreateCategoryDto = Omit<Category, "_id">;

export type UpdateCategoryDto = Partial<Category>;
