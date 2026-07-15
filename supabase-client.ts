import * as dotenv from 'dotenv';
dotenv.config();

const dbUrl = process.env.DATABASE_URL;
const api_key = process.env.API_KEY

import { createClient } from '@supabase/supabase-js';



export const supabase = createClient(dbUrl, api_key);