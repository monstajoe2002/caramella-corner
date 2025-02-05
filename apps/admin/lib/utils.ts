export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("en-US").format(num);
};
export const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EGP",
  }).format(price);
};
