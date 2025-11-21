import { supabase } from "./supabaseClient";

export async function getMilestonePayment() {
  const { data, error } = await supabase
    .from("milestone_payment")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching milestone payment:", error.message);
    return [];
  }

  return data || [];
}
