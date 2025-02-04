import { Category, Product } from "../types/index";
type CategoryFields = Pick<Category, "name" | "subcategories">;
export type CreateProductDto = Omit<
  Product & {
    category: CategoryFields;
  },
  "_id" | "orders" | "slug" | "createdAt" | "updatedAt"
>;

export type UpdateProductDto = Omit<
  Partial<
    Product & {
      category: Partial<CategoryFields>;
    }
  >,
  "orders" | "createdAt" | "updatedAt"
>;
