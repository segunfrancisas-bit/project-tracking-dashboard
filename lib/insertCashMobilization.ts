// lib/insertCashMobilization.ts
import { supabase } from "./supabaseClient";

// Define the type for a cash mobilization record
export interface CashMobilizationItem {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: "PENDING" | "OVERDUE" | "PAID";
  dateRequested: string; // ISO date string or e.g., "27-Oct-25"
}

// Function to insert a single record or an array of records
export async function insertCashMobilization(
  data: CashMobilizationItem | CashMobilizationItem[]
) {
  try {
    const { data: insertedData, error } = await supabase
      .from("cash_mobilization")
      .insert(data);

    if (error) {
      throw error;
    }

    return insertedData;
  } catch (err) {
    console.error("Error inserting cash mobilization data:", err);
    throw err;
  }
}
