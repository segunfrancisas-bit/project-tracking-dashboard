// lib/getProjects.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface Milestone {
  id: string;
  milestone_name: string;
  milestone_amount: number;
  target_completed: boolean;
  achieved_completed: boolean;
  achieved_timestamp?: string | null;
}

export interface ProjectRow {
  id: string;
  project_name: string;
  contractor: string;
  state: string;
  zone: string;
  site: string;
  category: string;
  contract_sum: number;
  amount_paid: number;
  value_of_work_done: number;
  cement: number;
  y10: number;
  y12: number;
  y16: number;
  y20: number;
  y25: number;
  y32: number;
  milestones: Milestone[];
}

// Fetch projects by state / zone / category
export async function getProjectsByFilter(state: string, zone: string, category: string): Promise<ProjectRow[]> {
  const { data: projects, error } = await supabase
    .from("projects")
    .select(`
      *,
      milestones:milestones (
        id,
        milestone_name,
        milestone_amount,
        target_completed,
        achieved_completed,
        achieved_timestamp
      )
    `)
    .eq("state", state)
    .eq("zone", zone)
    .eq("category", category);

  if (error) throw new Error(error.message);
  return projects as ProjectRow[];
}
