import { ProductModel } from "../models/product";
import slugify from "slugify";
import { CreateProductDto, UpdateProductDto } from "../dtos/product";

export const getProducts = async () => {
  try {
    const products = await ProductModel.find().lean();
    return products;
  } catch (error) {
    throw error;
  }
};
export const getProductBySlug = async (slug: string) => {
  try {
    const product = await ProductModel.findOne({ slug }).lean();
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  } catch (error) {
    throw error;
  }
};
export const deleteProduct = async (slug: string) => {
  try {
    const product = await ProductModel.findOneAndDelete({ slug }).lean();
    return product;
  } catch (error) {
    throw error;
  }
};

export const createProduct = async (product: CreateProductDto) => {
  try {
    const newProduct = await ProductModel.create({
      ...product,
      slug: slugify(product.name, { lower: true }),
    });
    return newProduct;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async (
  slug: string,
  product: UpdateProductDto
) => {
  const updatedProduct = await ProductModel.findOneAndUpdate(
    { slug },
    product,
    { new: true }
  ).lean();
  if (!updatedProduct) {
    throw new Error("Product not found");
  }
  return updatedProduct;
};
