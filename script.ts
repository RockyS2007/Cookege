import { createClient } from '@supabase/supabase-js';
import type { Database } from './src/database.types.ts';

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const testEmail = process.env.TEST_EMAIL ?? "";
const testPassword = process.env.TEST_PASS ?? "";

if (!supabaseUrl || !supabaseAnonKey || !testEmail || !testPassword) {
  throw new Error(
    'Missing VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, TEST_EMAIL, or TEST_PASS in .env.local',
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// for operations that require an authenticated user

// Create operations
export async function insertRecipe(
  recipe_name: string, description: string,
  total_time_min: number, servings: number,
  oven_required: boolean, stove_required: boolean,
  microwave_required: boolean, original_link: string, image_link: string): Promise<number> {

  const { data, error } = await supabase
                                .from('recipes')
                                .insert({ recipe_name: recipe_name, 
                                          description: description,
                                          total_time_min: total_time_min,
                                          servings: servings,
                                          oven_required: oven_required,
                                          stove_required: stove_required,
                                          microwave_required: microwave_required,
                                          original_link: original_link,
                                          image_link: image_link })
                                .select('id')
                                .single();

  if (error) {
    throw new Error(`${error}`);
  } else {
    console.log("Successfully inserted recipe");
    return data.id;
  }
}
export async function insertIngredient(ingredient_name: string): Promise<number> {
  const { error: readError, count, data: readData } = await supabase 
                                                            .from('ingredients')
                                                            .select('*', { count: 'exact', head: true })
                                                            .eq('ingredient_name', ingredient_name);
  if (readError) {
    throw new Error(`${readError}`);
  } else {
    if (count === 0) {  // ingredient doesn't already exist, insert it
      const { data, error: InsertError } = await supabase
                                                .from('ingredients')
                                                .insert({ ingredient_name: ingredient_name })
                                                .select('ingredient_id')
                                                .single();
      if (InsertError) {
        throw new Error(`${InsertError}`)
      } else {
        console.log(`Successfully inserted ingredient ${ingredient_name}`);
        return data.ingredient_id;
      }
    } else { // ingredient already exists
      return readData[0].ingredient_id;
    }
  }
}
export async function insertInstruction(recipe_id: number, step_num: number, instruction: string) {
  const { error } = await supabase
                          .from('instructions')
                          .insert({ recipe_id: recipe_id, step_num: step_num, instruction: instruction });
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully inserted instruction for recipe ${recipe_id}`);
  }
}
export async function insertIngredientQuantity(recipe_id: number, ingredient_id: number, quantity: string) {
  const { error } = await supabase
                          .from('ingredient_quantity')
                          .insert({ recipe_id: recipe_id, ingredient_id: ingredient_id, quantity: quantity });
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully inserted instruction for recipe ${recipe_id}`);
  }
}

// Delete operations, CHECK IMPLEMENTATIONS
export async function deleteRecipe(recipe_id: number) {
  /**
  in the deleteRecipes function, we purposely choose to leave ingredients, despite potentially never using them
  if a recipe is deleted, the idea is we rather keep ingredients that could be potentially used in the future
  rather than keep duplicate copies of the same ingredient for each respective recipe which uses it
  */
  deleteIngredientQuantity(recipe_id);
  deleteInstructions(recipe_id);

  const { error } = await supabase
                          .from('recipes')
                          .delete()
                          .eq('id', recipe_id);
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully deleted recipe ${recipe_id}`);
  }
}
export async function deleteIngredientQuantity(recipe_id: number) {
  const { error } = await supabase
                          .from('ingredient_quantity')
                          .delete()
                          .eq('recipe_id', recipe_id);
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully deleted all ingredient quantities associated with recipe ${recipe_id}`);
  }
}
export async function deleteInstructions(recipe_id: number) {
  const { error } = await supabase
                          .from('instructions')
                          .delete()
                          .eq('recipe_id', recipe_id);
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully deleted all instructions associated with recipe ${recipe_id}`);
  }
}


// Update operations
// Still haven't fully thought out how I want to handle this yet, so I'll hold off for now


// Manually inserting recipes
async function main() {
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    throw new Error(`Login failed: ${loginError.message}`);
  }


  // await insertRecipe(
  //   "Fluffy Mayo Pancakes",
  //   "Light, tender, easy to make pancakes",
  //   20,
  //   4,
  //   false,
  //   true,
  //   false,
  //   "https://www.allrecipes.com/fluffy-mayo-pancakes-recipe-11979757",
  //   "https://xkzfggmpsghtedjzttmi.supabase.co/storage/v1/object/public/recipe-images/11979757-Fluffy-Mayo-Pancakes-Peyton-Beckwith-Beauty-4x3-543813eb1c864064ad10fd6eebb1648f.webp"
  // );

  // await insertInstruction(
  //   4,
  //   4,
  //   "Cook, undisturbed, until bubbles form on the surface  and lightly browned around the edges, about 3 minutes. Flip and cook until lightly browned on the second side."
  // );

  // await insertIngredient(
  //   "flour"
  // );
  // await insertIngredient(
  //   "sugar"
  // );
  // await insertIngredient(
  //   "baking powder"
  // );
  // await insertIngredient(
  //   "kosher salt"
  // );
  // await insertIngredient(
  //   "mayonnaise"
  // );
  // await insertIngredient(
  //   "water"
  // );
  // await insertIngredient(
  //   "vanilla extract"
  // );

  await insertIngredientQuantity(
    4,
    1,
    "1 1/2 cups"
  );
  await insertIngredientQuantity(
    4,
    2,
    "2 1/2 tablespoons"
  );
  await insertIngredientQuantity(
    4,
    3,
    "1 1/2 teaspoons"
  );
  await insertIngredientQuantity(
    4,
    4,
    "1/4 teasoon"
  );
  await insertIngredientQuantity(
    4,
    5,
    "1/2 cup"
  );
  await insertIngredientQuantity(
    4,
    6,
    "1 1/4 cups"
  );
  await insertIngredientQuantity(
    4,
    7,
    "1 1/2 teaspoons"
  );
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
