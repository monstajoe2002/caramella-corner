import { OrderModel } from "../models/order";
import { Order } from "../types";

export const getOrders = async () => {
  const ordersData = await OrderModel.find().lean();
  const orderCount = await OrderModel.countDocuments();
  return { orders: ordersData || [], count: orderCount || 0 };
};

export const getTotalRevenue = async () => {
  const [totalRevenue] = await OrderModel.aggregate([
    { $group: { _id: null, revenue: { $sum: "$pricePaidInPiasters" } } },
  ]);
  return totalRevenue;
};
