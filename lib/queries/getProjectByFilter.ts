import { supabase } from "@/lib/supabaseClient";

export default async function getProjectByFilter(state: string, zone: string, category: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("state", state)
    .eq("zone", zone)
    .eq("category", category);

  if (error) {
    console.error("Supabase error:", error);
    return [];
  }

  return data || [];
}
