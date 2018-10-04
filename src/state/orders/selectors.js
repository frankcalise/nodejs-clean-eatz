export const getLatestOrder = orders => {
  if (orders.length === 0) {
    return [];
  }

  return orders[orders.length - 1];
};
