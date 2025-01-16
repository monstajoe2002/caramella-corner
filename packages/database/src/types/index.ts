import { Types } from "mongoose";

type Product = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  material: string;
  countryOfOrigin: string;
  category: Category;
  priceInPiasters: number;
  orders: Order[];
  variants: Variant[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Variant = {
  _id: Types.ObjectId;
  sku: string;
  quantity: number;
  color?: string;
  size?: string | number;
};
type Category = {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  subcategories: Category[];
  createdAt: Date;
  updatedAt: Date;
};
type Customer = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: Date;
  updatedAt: Date;
};

type Order = {
  _id: Types.ObjectId;
  pricePaidInPiasters: number;
  products: Array<Product>;
  customer: Customer;
  status: "pending" | "delivered";
  createdAt: Date;
  updatedAt: Date;
};
export type { Product, Variant, Category, Order, Customer };
