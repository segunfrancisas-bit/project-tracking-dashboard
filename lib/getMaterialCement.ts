import { supabase } from "./supabaseClient";

export async function getMaterialCement() {
  const { data, error } = await supabase
    .from("material_cement")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching material cement:", error.message);
    return [];
  }

  return data || [];
}
