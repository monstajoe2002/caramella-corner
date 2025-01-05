type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
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
  stock: number;
  options: Array<Record<string, unknown>>;
};

export type { Product, Variant };
