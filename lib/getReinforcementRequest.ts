import { supabase } from "./supabaseClient";

export async function getReinforcementRequest() {
  const { data, error } = await supabase
    .from("reinforcement_request")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching reinforcement request:", error.message);
    return [];
  }

  return data || [];
}
