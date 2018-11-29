export const getLatestOrderSummary = orderSummaries => {
  if (orderSummaries.length === 0) {
    return [];
  }

  return orderSummaries[orderSummaries.length - 1];
};

export const getMealNamesFromSummary = orderSummary => {
  return orderSummary.meals.map(meal => meal.name);
};

export const getMenuDates = orderSummaries => {
  if (orderSummaries.length === 0) {
    return [];
  }

  return orderSummaries.map(x => x.menuDate);
};
