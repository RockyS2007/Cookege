import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const api_key = process.env.API_KEY

import { createClient } from '@supabase/supabase-js';

/*
Validation: reject invalid cooking times, missing names, etc.
Authentication and authorization.
Pagination for recipe searches.
Consistent error responses.

Database migrations.
Indexes once search volume grows.
*/

export const supabase = createClient(dbUrl, api_key);


/*
Keep user-facing recipe types separate from raw database row types when practical.
Use database migrations and commit them to Git.
*/


// I make all the functions here then export them to the UI
// CURRENT GOAL: View recipes, Search recipes, Filter recipes, Open recipe details

const { data: loginData, error: loginError } =
  await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL!,
    password: process.env.TEST_PASSWORD!,
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