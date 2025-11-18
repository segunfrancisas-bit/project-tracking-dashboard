// lib/insertMilestoneRequest.ts
import { supabase } from "./supabaseClient";

// Define the type for a milestone request
export interface MilestoneRequestItem {
  project: string;
  contractor: string;
  milestone: string;
  amount: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "PAID";
  dateRequested: string; // ISO date string or e.g., "27-Oct-25"
}

// Function to insert a single record or multiple records
export async function insertMilestoneRequest(
  data: MilestoneRequestItem | MilestoneRequestItem[]
) {
  try {
    const { data: insertedData, error } = await supabase
      .from("milestone_request")
      .insert(data);

    if (error) {
      throw error;
    }

    return insertedData;
  } catch (err) {
    console.error("Error inserting milestone request:", err);
    throw err;
  }
}
