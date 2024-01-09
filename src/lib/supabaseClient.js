import { createClient } from '@supabase/supabase-js'
require('dotenv').config(); 
export const supabase = createClient(PROCESS.env.PUBLIC_SUPABASE_URL, PROCESS.env.PUBLIC_SUPABASE_ANON_KEY)