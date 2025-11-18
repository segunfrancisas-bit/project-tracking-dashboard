import { supabase } from "./supabaseClient";

export async function getMaterialRequest() {
  return await supabase.from("material_request").select("*");
}
