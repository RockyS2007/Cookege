import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

import type { recipe, instruction, ingredient, ingredient_quantity } from './types.ts';

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

// NOTE: I have removed the supabase login and moved it auth.ts
// ONLY READ OPERATIONS from this file will work without the sign in

// Read operations
export async function viewFirstNRecipes(limit: number): Promise<recipe[]> {  // define the type
  // I want to randomize this but it seems somewhat challenging with the Supabase API
  // I'll revisit this idea later...
  const { data, error} = await supabase
                              .from('recipes')
                              .select('*')
                              .limit(limit);

  if (error) {
    // console.error(error);
    throw new Error(`Unable to ${limit} recipes`);
  } else {
    const recipes: Array<recipe> = []; 

    // Pretty stupid type conversion
    for (const row of data) {
      const newRecipe: recipe = {
        id: row.id,
        recipe_name: row.recipe_name,
        description: row.description,
        created_at: row.created_at,
        total_time_min: row.total_time_min,
        servings: row.servings,
        oven_required: row.oven_required,
        stove_required: row.stove_required,
        microwave_required: row.microwave_required,
        original_link: row.original_link
      }
      recipes.push(newRecipe);
    }
    return recipes;
  }
}
export async function returnRecipe(recipe_id: number): Promise<recipe> {
  const { data, error } = await supabase
                                .from('recipes')
                                .select('*')
                                .eq('id', recipe_id)
                                .single();
  if (error) {
    throw new Error(`Unable to retrieve recipe with id: ${recipe_id}`);
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
export async function returnIngredientQuantity(recipe_id: number, ingredient_id: number) {
  const { data, error } = await supabase
                                .from('ingredient_quantity')
                                .select('*')
                                .eq('recipe_id', recipe_id)
                                .eq('ingredient_id', ingredient_id)
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
// FIX, not fully implemented
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