import { connectToDatabase } from "../lib/connection";
import { ProductModel } from "../models/product";

export const getProducts = async () => {
  try {
    await connectToDatabase();
    const products = await ProductModel.find().lean();
    return products;
  } catch (error) {
    throw error;
  }
};
