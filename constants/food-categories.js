export const foodCategories = [
  { name: "Starter", icon: "carrot" },
  { name: "Main", icon: "bowl-food" },
  { name: "Dessert", icon: "cake-candles" },
  { name: "Drinks", icon: "glass-water" },
];

export function getCategoryIcon(course) {
  return (
    foodCategories.find((category) => category.name === course)?.icon ??
    "utensils"
  );
}
