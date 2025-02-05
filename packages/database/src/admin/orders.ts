import { OrderModel } from "../models/order";
import { Order } from "../types";

export const getOrders = async () => {
  const ordersData = await OrderModel.find().lean();
  const orderCount = await OrderModel.countDocuments();
  return { orders: ordersData || [], count: orderCount || 0 };
};

export const getTotalRevenue = async () => {
  const [totalRevenueData] = await OrderModel.aggregate([
    { $group: { _id: null, revenue: { $sum: "$pricePaidInPiasters" } } },
  ]);
  const totalRevenue = totalRevenueData ? totalRevenueData.revenue / 100 : 0; // Assuming 100 piasters = 1 pound
  return totalRevenue;
};
