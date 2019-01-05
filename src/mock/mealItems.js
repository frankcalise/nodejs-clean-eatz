const itemCategories = {
  protein: 1,
  carbohydrate: 2,
  vegetable: 3,
  sauce: 4,
  spice: 5,
  addon: 6
};

const mealItems = [
  {
    id: 1,
    categoryId: 1,
    name: "Turkey",
    pricePerAmount: 0.75,
    extraCost: 0.0,
    protein: 16,
    carbohydrates: 0.0,
    fats: 7.1
  },
  {
    id: 2,
    categoryId: 1,
    name: "Steak",
    pricePerAmount: 0.75,
    extraCost: 0.0
  },
  {
    id: 3,
    categoryId: 1,
    name: "Chicken",
    pricePerAmount: 0.75,
    extraCost: 0.0
  },
  {
    id: 4,
    categoryId: 1,
    name: "Salmon",
    pricePerAmount: 0.75,
    extraCost: 0.0
  },
  {
    id: 5,
    categoryId: 1,
    name: "Tofu",
    pricePerAmount: 0.75,
    extraCost: 0.0
  },
  {
    id: 6,
    categoryId: 1,
    name: "Beef Crumbles (Beyond Meat) +$1.50",
    pricePerAmount: 0.75,
    extraCost: 1.5
  },
  {
    id: 7,
    categoryId: 1,
    name: "Chicken Strips (Beyond Meat) +$1.50",
    pricePerAmount: 0.75,
    extraCost: 1.5
  },
  {
    id: 8,
    categoryId: 1,
    name: "Bison +$2.00",
    pricePerAmount: 0.75,
    extraCost: 2.0
  },
  {
    id: 9,
    categoryId: 2,
    name: "No carb",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 10,
    categoryId: 2,
    name: "Sweet Potato",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 11,
    categoryId: 2,
    name: "Brown Rice",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 12,
    categoryId: 2,
    name: "Black Beans",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 13,
    categoryId: 2,
    name: "Cauliflower Rice",
    pricePerAmount: 0.0,
    extraCost: 0.5
  },
  {
    id: 14,
    categoryId: 2,
    name: "Quinoa",
    pricePerAmount: 0.0,
    extraCost: 0.5
  },
  {
    id: 15,
    categoryId: 3,
    name: "No vegetables",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 16,
    categoryId: 3,
    name: "Broccoli",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 17,
    categoryId: 3,
    name: "Asparagus",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 18,
    categoryId: 3,
    name: "Spinach",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 19,
    categoryId: 3,
    name: "Zucchini",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 20,
    categoryId: 3,
    name: "Green Beans",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 33,
    categoryId: 4,
    name: "No sauce",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 21,
    categoryId: 4,
    name: "Sweet Chili",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 22,
    categoryId: 4,
    name: "BBQ",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 23,
    categoryId: 4,
    name: "Buffalo",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 24,
    categoryId: 4,
    name: "Teriyaki",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 25,
    categoryId: 4,
    name: "Cilantro Lime",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 32,
    categoryId: 5,
    name: "No spice",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 26,
    categoryId: 5,
    name: "Fiesta Fit",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 27,
    categoryId: 5,
    name: "Clean Herbz",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 28,
    categoryId: 5,
    name: "Swole N Spicy",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 29,
    categoryId: 6,
    name: "No add-ons",
    pricePerAmount: 0.0,
    extraCost: 0.0
  },
  {
    id: 30,
    categoryId: 6,
    name: "1 Tbsp Olive Oil",
    pricePerAmount: 0.0,
    extraCost: 0.75
  },
  {
    id: 31,
    categoryId: 6,
    name: "1/2 Avocado",
    pricePerAmount: 0.0,
    extraCost: 0.75
  }
];

export { itemCategories };

export default mealItems;
