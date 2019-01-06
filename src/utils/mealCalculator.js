import mealItems from "../mock/mealItems";

const calculateProteinCost = ({ protein, proteinPortion }) => {
  const id = Number(protein);
  const meta = mealItems.find(x => x.id === id);
  const { pricePerAmount, extraCost } = meta;

  return pricePerAmount * proteinPortion + extraCost;
};

const calculateCarbohydrateCost = ({ carbohydrate, carbohydratePortion }) => {
  const id = Number(carbohydrate);
  const meta = mealItems.find(x => x.id === id);
  if (meta.id === 9) {
    return 0.0;
  }

  return carbohydratePortion === "3" ? 0.5 : 0.0;
};

const calculateAddonCost = ({ addon }) => {
  const id = Number(addon);
  const meta = mealItems.find(x => x.id === id);

  return meta.extraCost;
};

const calculateSauceCost = ({ sauce, extraSauce }) => {
  const id = Number(sauce);

  if (id !== 33 && extraSauce) {
    return 0.5;
  }

  return 0.0;
};

const calculateSingleMealCost = meal => {
  const basePrice = 3.5;
  const proteinCost = calculateProteinCost(meal);
  const carbohydrateCost = calculateCarbohydrateCost(meal);
  const sauceCost = calculateSauceCost(meal);
  const addonCost = calculateAddonCost(meal);

  const singleMealCost =
    basePrice + proteinCost + carbohydrateCost + sauceCost + addonCost;

  return singleMealCost;
};

// calculateSingleMealMacros = meal => {
//   const macros = {
//     calories: 0,
//     protein: 0,
//     carbs: 0,
//     fat: 0
//   };

//   const proteinMacros = calculateMacros(meal);
// };

const calculateOrderCost = meals => {
  const mealCosts = meals.map(meal => {
    return calculateSingleMealCost(meal) * meal.quantity;
  });

  const totalOrderCost = mealCosts.reduce((a, b) => a + b);

  return totalOrderCost.toFixed(2);
};

export { calculateOrderCost, calculateSingleMealCost };
