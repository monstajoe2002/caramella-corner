import { Product } from "../types/index";
export type CreateProductDto = Omit<
  Product,
  "_id" | "orders" | "slug" | "createdAt" | "updatedAt"
>;
export type UpdateProductDto = Omit<
  Partial<Product>,
  "orders" | "slug" | "createdAt" | "updatedAt"
>;
