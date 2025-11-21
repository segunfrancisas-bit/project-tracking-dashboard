import { supabase } from "./supabaseClient";

export async function getCementRequest() {
  const { data, error } = await supabase
    .from("cement_request")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cement requests:", error.message);
    return [];
  }

  return data || [];
}
