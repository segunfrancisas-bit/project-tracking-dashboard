import { supabase } from "./supabaseClient";

export async function getRequests() {
  const { data, error } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching requests:", error.message);
    return [];
  }

  return data || [];
}
