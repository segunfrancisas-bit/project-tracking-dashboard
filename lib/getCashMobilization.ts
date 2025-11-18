import { supabase } from "./supabaseClient";

export async function getCashMobilization() {
  return await supabase.from("cash_mobilization").select("*");
}
