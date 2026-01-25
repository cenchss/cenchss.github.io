// Supabase configuration
const SUPABASE_URL = 'https://iwemimumekwgumexvwez.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml3ZW1pbXVtZWt3Z3VtZXh2d2V6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjkzNTYwMTcsImV4cCI6MjA4NDkzMjAxN30.bxV0DT2hzBtYhMZDglnwwdiS39g1wdO90hyNji_1ANs';

// Initialize Supabase client (v2 CDN syntax)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
