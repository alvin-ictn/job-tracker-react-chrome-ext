import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lhgtqskqykkmpqhznjks.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZ3Rxc2txeWtrbXBxaHpuamtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQxNzg3NzYsImV4cCI6MjA1OTc1NDc3Nn0.FjYxr8gcCzGc8e8OI8m2NOv6M7o2KXdRQHXreNQ8ad8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);