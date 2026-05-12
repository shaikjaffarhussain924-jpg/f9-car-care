import { createClient } from "@supabase/supabase-js";
const SUPABASE_URL = "https://wdkhsnbzdlfvbtuukjfj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indka2hzbmJ6ZGxmdmJ0dXVramZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMTE5NDYsImV4cCI6MjA5MjY4Nzk0Nn0.w_sNhOsLTdaueaIo2xtV4OSTvSmbkInLJ26ZzrepsHg";
const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true
  }
});
export {
  supabase as s
};
