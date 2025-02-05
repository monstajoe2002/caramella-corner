import { CustomerModel } from "../models/customer";

export const getMonthlyCustomers = async () => {
  const [customerCount] = await CustomerModel.aggregate([
    {
      $group: {
        _id: { month: "$createdAt.getMonth()" },
        count: { $sum: 1 },
      },
    },
  ]);
  return customerCount || 0;
};
