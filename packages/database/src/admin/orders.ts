import { OrderModel } from "../models/order";

export const getOrders = async () => {
  const ordersData = await OrderModel.find().lean();
  const orderCount = await OrderModel.countDocuments();
  return { orders: ordersData || [], count: orderCount || 0 };
};
