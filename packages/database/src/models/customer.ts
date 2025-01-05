import mongoose from "mongoose";
import { Customer } from "../lib/types";

const CustomerSchema = new mongoose.Schema<Customer>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

export const CustomerModel =
  (mongoose.models.Customer as mongoose.Model<Customer>) ||
  mongoose.model<Customer>("Customer", CustomerSchema);
