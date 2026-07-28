import type { RecipeCardProps } from "./RecipeCard";

const taco: RecipeCardProps = {
  recipe_id: 1,
  recipe_name: "taco",
  total_time_min: 15,
  servings: 2,
  oven_required: false,
  stove_required: false,
  microwave_required: true,
  image_url: "./assets/Griddle-Tacos.jpg",
};

const pizza: RecipeCardProps = {
  recipe_id: 2,
  recipe_name: "pizza",
  total_time_min: 15,
  servings: 4,
  oven_required: true,
  stove_required: false,
  microwave_required: false,
  image_url: "./assets/Griddle-Tacos.jpg",
};

export const foods = [
  taco, pizza, taco, taco, taco, taco, taco,
  pizza, pizza, pizza, pizza, pizza, pizza, pizza,
];
