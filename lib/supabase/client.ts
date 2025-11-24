import { createClient } from '@supabase/supabase-js';

// For client-side usage, these need to be hardcoded or use window object
// Environment variables in Next.js client components need NEXT_PUBLIC_ prefix
// and are replaced at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://hjmlhzoxvaglgdzibwxn.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqbWxoem94dmFnbGdkemlid3huIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2MjUxMDAsImV4cCI6MjA3OTIwMTEwMH0.F6Vwyfq_hK21ha-PZt7tZ4gbGoV7BQiIRqgXa339NgE';

// Validate that we have proper values
if (!supabaseUrl || supabaseUrl === 'undefined') {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}
if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    }
});
