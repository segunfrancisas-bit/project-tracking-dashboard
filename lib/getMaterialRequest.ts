import { supabase } from "./supabaseClient";

export async function getMaterialRequest() {
  const { data, error } = await supabase
    .from("material_request")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching material request:", error.message);
    return [];
  }

  return data || [];
}
