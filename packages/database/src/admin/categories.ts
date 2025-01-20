import { CreateCategoryDto } from "../dtos/category";
import { CategoryModel } from "../models/category";

export const getCategories = async () => {
  const categories = await CategoryModel.find().lean();
  if (!categories) {
    throw new Error("No categories found");
  }
  return categories;
};

export const createCategory = async (category: CreateCategoryDto) => {
  const newCategory = await CategoryModel.create(category);
  if (!newCategory) {
    throw new Error("Failed to create category");
  }
  return newCategory;
};
