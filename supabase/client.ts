import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ydbznbjedyezkndicfqj.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlkYnpuYmplZHllemtuZGljZnFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkxODA0MDYsImV4cCI6MjA4NDc1NjQwNn0.sqoLGX3sj2fEHxd3wnEBCInGxVHbtZoIrXPK65lGoQw';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase URL and Anon Key are missing. Authentication features will be disabled.');
}

// Create client even if keys are missing to avoid crashing the whole app, 
// but it will fail on actual requests.
export const supabase = createClient(
  supabaseUrl, 
  supabaseAnonKey || 'placeholder'
);
