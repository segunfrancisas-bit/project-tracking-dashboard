import { supabase } from "./supabaseClient";

export async function getCashMobilization() {
  const { data, error } = await supabase
    .from("cash_mobilization")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cash mobilization:", error.message);
    return [];
  }

  return data || [];
}
