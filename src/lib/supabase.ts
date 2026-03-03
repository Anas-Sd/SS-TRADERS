import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables. Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in the .env file.");
}

// Provide a valid dummy URL to prevent `createClient` from throwing a URL parsing error instantly if environment is unconfigured
export const supabase = createClient(supabaseUrl || 'https://example.supabase.co', supabaseAnonKey || 'dummy-key')
