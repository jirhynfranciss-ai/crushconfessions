import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ====================================================
// 🔧 CONFIGURE YOUR SUPABASE HERE
// Replace these with your actual Supabase project URL and anon key
// Get them from: https://supabase.com/dashboard → Settings → API
// ====================================================
const SUPABASE_URL = 'https://newiyzdnjqhsfsyokpzs.supabase.co';  // e.g. 'https://abcdefg.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ld2l5emRuanFoc2ZzeW9rcHpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5MDIzNzEsImV4cCI6MjA4NzQ3ODM3MX0.QFIBKx_w5-7fM0qC8bd9uXawE8B_y7nE4LJ1PAIPulo'; // e.g. 'eyJhbGciOi...'

// Admin password for accessing the dashboard
export const ADMIN_PASSWORD = 'iloveyou123';

let supabase: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  return SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabase;
}
