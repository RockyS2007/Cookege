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

// Read operations
export async function viewFirstNRecipes(limit: number): Promise<recipe[]> {
  // I want to randomize this but it seems somewhat challenging with the Supabase API
  // I'll revisit this idea later...
  const { data, error} = await supabase
                              .from('recipes')
                              .select('*')
                              .limit(limit);

  if (error) {
    throw new Error(`Unable to query ${limit} recipes`);
  } else {
    const recipes: Array<recipe> = []; 

    // stupid type conversion
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
        original_link: row.original_link,
        image_link: row.image_link
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
    const queriedRecipe: recipe = {
      id: data.id,
      recipe_name: data.recipe_name,
      description: data.description,
      created_at: data.created_at,
      total_time_min: data.total_time_min,
      servings: data.servings,
      oven_required: data.oven_required,
      stove_required: data.stove_required,
      microwave_required: data.microwave_required,
      original_link: data.original_link,
      image_link: data.image_link
    }
    return queriedRecipe;
  }
}
export async function returnInstructions(recipe_id: number): Promise<instruction[]> {
  const { data, error } = await supabase  
                                .from('instructions')
                                .select('*')
                                .eq('recipe_id', recipe_id)
                                .order('step_num');
  if (error) {
    throw new Error(`Unable to retrieve instructions for recipe ${recipe_id}`);
  } else {
    const instructions: instruction[] = [];

    for (const row of data) {
      const inst: instruction = {
        instruction_id: row.instruction_id,
        recipe_id: row.recipe_id,
        step_num: row.step_num,
        instruction_detail: row.instruction
      }

      instructions.push(inst);
    }

    return instructions;
  }
}
export async function returnIngredientQuantities(recipe_id: number): Promise<ingredient_quantity[]> {
  const { data, error } = await supabase
                                .from('ingredient_quantity')
                                .select('*')
                                .eq('recipe_id', recipe_id);
  if (error) {
    throw new Error(`Could not retrieve ingredients for recipe ${recipe_id}`);
  } else {
    const ingredientQuantities: ingredient_quantity[] = [];

    for (const row of data) {
      const ingredQnty: ingredient_quantity = {
        recipe_id: row.recipe_id,
        ingredient_id: row.ingredient_id,
        quantity: row.quantity
      }

      ingredientQuantities.push(ingredQnty);
    }
    
    return ingredientQuantities;
  }
}
export async function returnIngredient(ingredient_id: number): Promise<ingredient> {
  const { data, error } = await supabase
                                .from('ingredients')
                                .select('*')
                                .eq('ingredient_id', ingredient_id)
                                .single();
  if (error) {
    throw new Error(`Could not retrieve ingredient ${ingredient_id}`);
  } else {
    const ingred: ingredient = {
        ingredient_id: data.ingredient_id,
        ingredient_name: data.ingredient_name
    }
    return ingred;
  }
}

// FIX, not fully implemented. Use this for the search functionality
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