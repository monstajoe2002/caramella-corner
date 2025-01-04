import { ProductModel } from "../models/product";

export const getProducts = async () => {
  try {
    const products = await ProductModel.find().lean();
    return products;
  } catch (error) {
    throw error;
  }
};
