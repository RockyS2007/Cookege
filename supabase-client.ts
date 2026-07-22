import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const api_key = process.env.API_KEY

import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.ts';

export const supabase = createClient<Database>(dbUrl, api_key);

/*
Validation: reject invalid cooking times, missing names, etc.
Authentication and authorization.
Pagination for recipe searches.
Consistent error responses.

Database migrations.
Indexes once search volume grows.
*/

/*
Keep user-facing recipe types separate from raw database row types when practical.
Use database migrations and commit them to Git.
*/


// I make all the functions here then export them to the UI
// CURRENT GOAL: View recipes, Search recipes, Filter recipes, Open recipe details

const { data: loginData, error: loginError } =
  await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASS,
  });

if (loginError) {
  throw loginError;
}


export async function searchRecipes(query: string) {
  return supabase
    .from("recipes")
    .select("*")
    .ilike("name", `%${query}%`)
    .order("name");
}

// insert test
export async function _insertRecipe() {
  const { error } = await supabase
                    .from('recipes')
                    .insert({ recipe_name: 'pizza', 
                              description: 'pepperoni pizza',
                              total_time_min: 20,
                              servings: 5,
                              oven_required: true,
                              stove_required: false,
                              microwave_required: false,
                              original_link: 'howtomakepizza.com' });
  if (error) {
    console.log(error);
  } else {
    console.log("Successfully inserted recipe");
  }
}

_insertRecipe();