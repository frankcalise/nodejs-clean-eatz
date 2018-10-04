export const getLatestOrder = orders => {
  if (orders.length === 0) {
    return [];
  }

  return orders[orders.length - 1];
};

export const getSatelliteOrders = (orders, orderKey) => {
  if (orders.length === 0) {
    return [];
  }

  return orders.filter(order => order.satellite);
};
