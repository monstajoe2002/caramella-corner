import slugify from "slugify";
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
  const newCategory = await CategoryModel.create({
    ...category,
    slug: slugify(category.name, { lower: true }),
  });
  if (!newCategory) {
    throw new Error("Failed to create category");
  }
  return newCategory;
};

export const updateCategory = async (
  slug: string,
  category: CreateCategoryDto
) => {
  const updatedCategory = await CategoryModel.findOneAndUpdate(
    { slug },
    category
  );
  if (!updatedCategory) {
    throw new Error("Failed to update category");
  }
  return updatedCategory;
};

export const deleteCategory = async (slug: string) => {
  const deletedCategory = await CategoryModel.findOneAndDelete({ slug });
  if (!deletedCategory) {
    throw new Error("Failed to delete category");
  }
  return deletedCategory;
};
