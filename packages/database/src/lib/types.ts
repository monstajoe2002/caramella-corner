type Product = {
  name: string;
  slug: string;
  description: string;
  category: Category;
  // orders:Order[];
  variants: Variant[];
  active: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

type Variant = {
  sku: string;
  price: number;
  quantity: number;
  options: Array<Record<string, unknown>>;
};
type Category = {
  name: string;
  slug: string;
  subcategories: Category[];
};
export type { Product, Variant, Category };
