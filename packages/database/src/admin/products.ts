import { ProductModel } from "../models/product";

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
