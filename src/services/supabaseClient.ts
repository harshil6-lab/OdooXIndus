import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

// Debug logging
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key Loaded:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase environment variables are missing')
}

export const supabase = createClient(supabaseUrl, supabaseKey)
