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
  createdAt: Date;
  updatedAt: Date;
};

type Order = {
  pricePaidInPiasters: number;
  products: Array<Product>;
  status: "pending" | "delivered";
  createdAt: Date;
  updatedAt: Date;
};
export type { Product, Variant, Category, Order };
