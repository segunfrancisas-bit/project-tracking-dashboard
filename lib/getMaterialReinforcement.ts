import { supabase } from "./supabaseClient";

export async function getMaterialReinforcement() {
  const { data, error } = await supabase
    .from("material_reinforcement")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching material reinforcement:", error.message);
    return [];
  }

  return data || [];
}
