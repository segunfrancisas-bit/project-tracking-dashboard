import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://komuzoutpnncjuayxljn.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvbXV6b3V0cG5uY2p1YXl4bGpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDYwODIsImV4cCI6MjA3OTAyMjA4Mn0.7joo_nA6B-Fo8vJFXik6hWGBI9FPpjNHSFwb68aSK-A"; // Replace with your anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
