import { createClient } from '@supabase/supabase-js';

// Supplied by the user for the anon project
const supabaseUrl = 'https://jpflujjakyhnutdpkpgv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwZmx1ampha3lobnV0ZHBrcGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NTU0MDAsImV4cCI6MjA5MTAzMTQwMH0.cF0mJ4kc__w_s7uVX6z94Ve4JFuclTb4qce_E8UgCv0';

export const supabase = createClient(supabaseUrl, supabaseKey);
