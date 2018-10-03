export const getLatestOrder = state => {
  const arr = state.orders;
  return arr[arr.length - 1];
};
