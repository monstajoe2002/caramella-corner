import { ProductModel } from "@caramella-corner/database/models/product";
import { Product } from "../lib/types";

export const adminProducts = {
  create: (data: Product) => ProductModel.create(data),
  update: (_id: string, data: Product) =>
    ProductModel.findByIdAndUpdate(_id, data),
  delete: (_id: string) =>
    ProductModel.findByIdAndUpdate(_id, { active: false }),
  getAll: () => ProductModel.find(),
};
