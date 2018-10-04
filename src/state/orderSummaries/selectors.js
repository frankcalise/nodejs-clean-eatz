export const getLatestOrderSummary = orderSummaries => {
  if (orderSummaries.length === 0) {
    return [];
  }

  return orderSummaries[orderSummaries.length - 1];
};
