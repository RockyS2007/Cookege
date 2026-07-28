import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);

/*
Validation: reject invalid cooking times, missing names, etc.
Authentication and authorization.
Database migrations.
Indexes once search volume grows.
*/


// I make all the functions here then export them to the UI

// NOTE: I have removed the supabase login and moved it auth.ts
// ONLY READ OPERATIONS from this file will work without the sign in

// Create operations
export async function insertRecipe(
  recipe_name: string, description: string,
  total_time_min: number, servings: number,
  oven_required: boolean, stove_required: boolean,
  microwave_required: boolean, original_link: string): Promise<number> {

  const { data, error } = await supabase
                                .from('recipes')
                                .insert({ recipe_name: recipe_name, 
                                          description: description,
                                          total_time_min: total_time_min,
                                          servings: servings,
                                          oven_required: oven_required,
                                          stove_required: stove_required,
                                          microwave_required: microwave_required,
                                          original_link: original_link })
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

// Read operations
// CURRENT GOAL: View recipes, Search recipes, Filter recipes, Open recipe details
export async function viewFirstNRecipes(limit: number) {  // define the type
  // Probably use this for pagination
  // I want to randomize this but it seems somewhat challenging with the Supabase API
  // I'll revisit this idea later...
  const { data, error} = await supabase
                              .from('recipes')
                              .select('*')
                              .limit(limit);

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}
export async function searchRecipes(query: string, limit: number) {
  const { data, error} = await supabase
                              .from('recipes')
                              .select('*')
                              .ilike('recipe_name', `%${query}%`)
                              .limit(limit)
                              .order('recipe_name');

  if (error) {
    console.error(error);
  } else {
    return data;
  }
}
export async function returnRecipe(recipe_id: number) {
  const { data, error } = await supabase
                                .from('recipes')
                                .select('*')
                                .eq('id', recipe_id)
                                .single();
  if (error) {
    console.error(error);
  } else {
    return data;
  }
}
export async function returnInstructions(recipe_id: number) {
  const { data, error } = await supabase  
                                .from('instructions')
                                .select('*')
                                .eq('recipe_id', recipe_id)
                                .order('step_num');
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}
export async function returnIngredientQuantity(recipe_id: number) {
  const { data, error } = await supabase
                                .from('ingredient_quantity')
                                .select('*')
                                .eq('recipe_id', recipe_id)
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}
export async function returnIngredient(_ingredient_id: number) {
  const { data, error } = await supabase
                                .from('ingredients')
                                .select('ingredient_name')
                                .eq('ingredient_id', _ingredient_id)
                                .single();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
}

// Update operations
// Still haven't fully thought out how I want to handle this yet, so I'll hold off for now

// Delete operations
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
