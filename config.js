// Supabase configuration
const SUPABASE_URL = 'https://iwemimumekwgumexvwez.supabase.co';
const SUPABASE_ANON_KEY = 'sb_secret_ae75G9iZY18ICD1Y-01_rg_-U92F8Z_';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
