type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  subcategory: string;
  // orders:Order[];
  // variants: Record<string,unknown>[];
  active: boolean;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};
export type { Product };
