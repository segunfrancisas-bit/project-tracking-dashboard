// lib/insertMaterialRequest.ts
import { supabase } from "./supabaseClient";

// Define the type for a material request
export interface MaterialRequestItem {
  project: string;
  contractor: string;
  material: string;
  quantity: number;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "DELIVERED";
  dateRequested: string; // ISO date string or e.g., "27-Oct-25"
}

// Function to insert a single record or multiple records
export async function insertMaterialRequest(
  data: MaterialRequestItem | MaterialRequestItem[]
) {
  try {
    const { data: insertedData, error } = await supabase
      .from("material_request")
      .insert(data);

    if (error) {
      throw error;
    }

    return insertedData;
  } catch (err) {
    console.error("Error inserting material request:", err);
    throw err;
  }
}
