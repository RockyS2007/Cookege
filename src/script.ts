import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';
import * as readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
declare const process: any;

const SERVER_URL = "http://127.0.0.1:8000";

const supabaseUrl = process.env.VITE_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY ?? "";
const testEmail = process.env.TEST_EMAIL ?? "";
const testPassword = process.env.TEST_PASS ?? "";

interface RecipeModel {
  recipe_name: string;
  description: string;
  total_time_min: number;
  servings: number;
  oven_required: boolean;
  stove_required: boolean;
  microwave_required: boolean;
  original_link: string;
  image_link: string;
}
interface IngredientsModel {
  ingredients_list: Array<string>;
}
interface QuantitiesModel {
  quantities_list: Array<string>;
}
interface InstructionsModel {
  instructions_list: Array<string>;
}

if (!supabaseUrl || !supabaseAnonKey || !testEmail || !testPassword) {
  throw new Error(
    'Missing VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, TEST_EMAIL, or TEST_PASS in .env.local',
  );
}

// for operations that require an authenticated/development user, Login at bottom of file
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

/**
 * Sends the recipe link and image link to the API layer.
 * 
 * @param recipe_link - The allrecipes.com link to the recipe.
 * @param image_link - The image link stored in S3 corresponding to the recipe cover image.
 * 
 * @returns A promise resolving to undefined if the links were successfully set.
 * 
 * @throws {Error} If the links were unable to be successfully processed by the API.
 * 
 * @example
 * ```typescript
 * await setLinks("https://www.allrecipes.com/recipe/123", "https://myproject.supabase.co/storage");
 * ```
 */
export async function setLinks(recipe_link: string, image_link: string) {
  const SET_LINK_ROUTE = "/send_links";

  try {
    const response = await fetch(SERVER_URL + SET_LINK_ROUTE, 
                                { method: "POST",
                                  headers: { 
                                    "Content-Type": "application/json", 
                                  },
                                  body: JSON.stringify({ 
                                    recipe_url: recipe_link,
                                    image_url: image_link,
                                  }),
                                });

    if (!response.ok) throw new Error(`Failed to update recipe links: ${response.status}`);
    console.log("Links successfully set");
  } catch (error) {
    console.error("Error sending links:", error);
    throw error
  }
}
/**
 * Prints all information for a recipe in the terminal.
 * 
 * @param recipe - The RecipeModel containing the details of the recipe.
 * @param ingredients - The IngredientsModel containing the ingredients of the recipe.
 * @param quantities - The QuantitiesModel containing the quantities of the recipe.
 * @param instructions - The InstructionsModel containing the instructions for the recipe.
 */
export function printAllDetails(recipe: RecipeModel, ingredients: IngredientsModel, quantities: QuantitiesModel, instructions: InstructionsModel) {
    console.log(`Please validate the following:
    ------------------------------------------------------
    RECIPE DETAILS
    ------------------------------------------------------
    Recipe name: ${recipe.recipe_name}
    Recipe description: ${recipe.description}
    Recipe cooking time (min): ${recipe.total_time_min}
    Recipe servings: ${recipe.servings}
    Oven requirements: ${recipe.oven_required ? "YES": "NO"}
    Stove requirements: ${recipe.stove_required ? "YES": "NO"}
    Microwave requirements: ${recipe.microwave_required ? "YES": "NO"}
    Recipe original link: ${recipe.original_link}
    Check image link: ${recipe.image_link}`);

    console.log("------------------------------------------------------");
    console.log("INGREDIENTS");
    console.log("------------------------------------------------------");
    for (const ingredient of ingredients.ingredients_list) {
      console.log(ingredient);
    }
    
    console.log("------------------------------------------------------");
    console.log("QUANTITIES");
    console.log("------------------------------------------------------");
    for (const quantity of quantities.quantities_list) {
      console.log(
      quantity);
    }

    console.log("------------------------------------------------------");    
    console.log(`INGREDIENTS LIST MATCHES QUANTITIES LIST: 
      ${ingredients.ingredients_list.length == quantities.quantities_list.length ? "YES": "NO"}`);

    console.log("------------------------------------------------------");
    console.log("INSTRUCTIONS");
    console.log("------------------------------------------------------");
    for (const [index, instruction] of instructions.instructions_list.entries()) {
      console.log(`${index+1}: ${instruction}`);
    }
}

// Create operations
//--------------------------------------------------------------------------------

/**
 * Requests all required data from the API and inserts all data to appropriate database tables.
 * This is the only function that is required to insert a recipe. All recipe details will be 
 * printed in the console, the user must manually verify all the details with the actual recipe
 * before confirming the insert.
 * 
 * @remark A future feature would be to add the ability to augment the details prior to inserting.
 * 
 * @param recipe_link - The allrecipes.com link to the recipe.
 * @param image_link - The image link stored in S3 corresponding to the recipe cover image.
 * 
 * @returns A promise resolving to undefined if the recipe was successfully inserted.
 * 
 * @throws {Error} Please see terminal output, this function calls a variety of helper functions
 * all of which could throw a unique error.
 * 
 * @example
 * ```typescript
 * await addEntireRecipe("https://www.allrecipes.com/recipe/123", "https://myproject.supabase.co/storage");
 * ```
 */
export async function addEntireRecipe(recipe_link: string, image_link: string) {
  await setLinks(recipe_link, image_link).catch((error: unknown) => {throw error});

  const GET_RECIPE_ROUTE = "/recipe";
  const GET_INGREDIENTS_ROUTE = "/ingredients";
  const GET_QUANTITIES_ROUTE = "/quantities";
  const GET_INSTRUCTIONS_ROUTE = "/instructions"

  try {
    const recipe_response = await fetch(SERVER_URL + GET_RECIPE_ROUTE);
    const ingredients_response = await fetch(SERVER_URL + GET_INGREDIENTS_ROUTE);
    const quantities_response = await fetch(SERVER_URL + GET_QUANTITIES_ROUTE);
    const instructions_response = await fetch(SERVER_URL + GET_INSTRUCTIONS_ROUTE) ;   


    const recipe: RecipeModel = await recipe_response.json();
    const ingredients: IngredientsModel = await ingredients_response.json();
    const quantities: QuantitiesModel = await quantities_response.json();
    const instructions: InstructionsModel = await instructions_response.json();

    console.log("Would you like to insert this recipe?");
    printAllDetails(recipe, ingredients, quantities, instructions);

    const rl = readline.createInterface({ input, output });
    const response: string = await rl.question("(y/n): ");
    rl.close();
    if (response != "y") throw new Error("Recipe Details Rejected");

    // Call DB operations here
    // The required order is recipes table -> instructions table -> ingredient table -> quantities table
    const recipe_id = await insertRecipe(recipe);
    for (const [index, instruction] of instructions.instructions_list.entries()) {
      await insertInstruction(recipe_id, index+1, instruction);
    }
    for (let i = 0; i < ingredients.ingredients_list.length; i++) {
      const ingredient_id = await insertIngredient(ingredients.ingredients_list[i]);
      await insertIngredientQuantity(recipe_id, ingredient_id, quantities.quantities_list[i]);
    }

    console.log("DATABASES UPDATED SUCCESSFULLY");
  } catch (error) {
    throw new Error(`Unable to add recipe, no database changes made. ${error}`);
  }
}
/**
 * Query the Supabase API to insert a recipe into the recipes table.
 * 
 * @param recipe - The RecipeModel containing the details of the recipe.
 * 
 * @returns A promise resolving to the id given to the recipe in the table.
 * 
 * @throws {Error} There was a problem adding the recipe in Supabase.
 */
export async function insertRecipe(recipe: RecipeModel): Promise<number> {
  const { data, error } = await supabase
                                .from('recipes')
                                .insert({ recipe_name: recipe.recipe_name, 
                                          description: recipe.description,
                                          total_time_min: recipe.total_time_min,
                                          servings: recipe.servings,
                                          oven_required: recipe.oven_required,
                                          stove_required: recipe.stove_required,
                                          microwave_required: recipe.microwave_required,
                                          original_link: recipe.original_link,
                                          image_link: recipe.image_link })
                                .select('id')
                                .single();

  if (error) {
    throw error;
  } else {
    console.log(`recipe table has been updated with recipe id: ${data.id}`);
    return data.id;
  }
}
/**
 * Query the Supabase API to insert an ingredient into the ingredients table. 
 * 
 * @remark If the ingredient already exists it's id will be returned and no new insertion is made.
 * 
 * @param ingredient_name - The name of the ingredient.
 * 
 * @returns A promise resolving to a number, the id of the ingredient.
 * 
 * @throws {Error} There was a problem adding the ingredient in Supabase.
 */
export async function insertIngredient(ingredient_name: string): Promise<number> {
  const { error: ReadError, count, data: readData } = await supabase 
                                                            .from('ingredients')
                                                            .select('*', { count: 'exact' })
                                                            .eq('ingredient_name', ingredient_name);
  if (ReadError) {
    throw ReadError;
  } else {
    if (count === 0) {  // ingredient doesn't already exist, insert it
      const { data, error: InsertError } = await supabase
                                                .from('ingredients')
                                                .insert({ ingredient_name: ingredient_name })
                                                .select('ingredient_id')
                                                .single();
      if (InsertError) {
        throw InsertError
      } else {
        console.log(`Successfully inserted ingredient ${ingredient_name} with id: ${data.ingredient_id}`);
        return data.ingredient_id;
      }
    } else { // ingredient already exists, if readData.length is > 1 we are COOKED
      console.log(`${ingredient_name} already exists with id: ${readData[0].ingredient_id}`);
      return readData[0].ingredient_id;
    }
  }
}
/**
 * Query the Supabase API to insert a instruction into the instructions table. 
 * 
 * @param recipe_id - The id of the recipe this instruction belongs to.
 * @param step_num - The step of the instruction in the list of instructions.
 * @param instruction - The instruction itself.
 * 
 * @throws {Error} There was a problem adding an ingredient in Supabase.
 */
export async function insertInstruction(recipe_id: number, step_num: number, instruction: string) {
  const { error } = await supabase
                          .from('instructions')
                          .insert({ recipe_id: recipe_id, step_num: step_num, instruction: instruction });
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully inserted instruction ${step_num} for recipe ${recipe_id}`);
  }
}
/**
 * Query the Supabase API to insert a quantity into the quantities table. 
 * 
 * @param recipe_id - The id of the recipe this quantity belongs to.
 * @param ingredient_id - The ingredient this quantity is for.
 * @param quantity - The quantity of this ingredient.
 * 
 * @throws {Error} There was a problem adding the quantity in Supabase.
 */
export async function insertIngredientQuantity(recipe_id: number, ingredient_id: number, quantity: string) {
  const { error } = await supabase
                          .from('ingredient_quantity')
                          .insert({ recipe_id: recipe_id, ingredient_id: ingredient_id, quantity: quantity });
  if (error) {
    console.log(error);
  } else {
    console.log(`Successfully inserted quantity for ingredient: ${ingredient_id} in recipe: ${recipe_id}`);
  }
}

// Delete operations, CHECK IMPLEMENTATIONS gotta fix how the deletes cascade
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

async function main() {
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (loginError) {
    throw new Error(`Login failed: ${loginError.message}`);
  }

  // for local development run in Cookege (not src): npx tsx --env-file=.env.local src/script.ts
  await addEntireRecipe("https://www.allrecipes.com/ultimate-pool-sandwich-recipe-8653433", 
                process.env.VITE_SUPABASE_ANON_KEY + "/storage/v1/object/public/recipe-images/Pool-Sandwich.webp");
}

main().catch((error: unknown) => {
  console.error(error);
});
