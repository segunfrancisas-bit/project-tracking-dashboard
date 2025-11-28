"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MilestoneCard({ milestone }: any) {
  const [target, setTarget] = useState(milestone.target_completed);
  const [achieved, setAchieved] = useState(milestone.achieved_completed);

  async function updateFlag(field: "target_completed" | "achieved_completed", value: boolean) {
    await supabase
      .from("milestones")
      .update({ [field]: value })
      .eq("id", milestone.id);
  }

  return (
    <div className="bg-white/10 backdrop-blur p-3 rounded-lg mb-3">
      <p className="font-semibold">{milestone.milestone_name}</p>
      <p className="text-sm text-gray-300">₦ {Number(milestone.milestone_amount).toLocaleString()}</p>

      <div className="mt-2 flex items-center gap-3">
        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={target}
            onChange={(e) => {
              setTarget(e.target.checked);
              updateFlag("target_completed", e.target.checked);
            }}
          />
          Target
        </label>

        <label className="text-sm flex items-center gap-1">
          <input
            type="checkbox"
            checked={achieved}
            onChange={(e) => {
              setAchieved(e.target.checked);
              updateFlag("achieved_completed", e.target.checked);
            }}
          />
          Achieved
        </label>
      </div>
    </div>
  );
}
