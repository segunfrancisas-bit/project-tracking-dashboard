import { supabase } from "./supabaseClient";

export async function getMilestoneRequest() {
  return await supabase.from("milestone_request").select("*");
}
