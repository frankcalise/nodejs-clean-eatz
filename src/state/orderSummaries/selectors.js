export const getLatestOrderSummary = state => {
  const arr = state.orderSummaries;
  return arr[arr.length - 1];
};
