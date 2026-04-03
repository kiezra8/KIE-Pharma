import { createClient } from '@supabase/supabase-js';

// Supplied by the user for the anon project "acyhenvewbfkzcevpenk"
const supabaseUrl = 'https://acyhenvewbfkzcevpenk.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjeWhlbnZld2Jma3pjZXZwZW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNDAxNjAsImV4cCI6MjA5MDgxNjE2MH0.SpJwH3mMBW-xbntpUjemQJhopiByC5N3p7XpHNgtpt4';

export const supabase = createClient(supabaseUrl, supabaseKey);
