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
  stock: number;
  createdAt: Date;
  updatedAt: Date;
};
