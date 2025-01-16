import { Product } from "../types/index";
export type CreateProductDto = Omit<Product, "_id" | "orders" | "slug">;
export type UpdateProductDto = Omit<Product, "_id" | "orders" | "slug">;
