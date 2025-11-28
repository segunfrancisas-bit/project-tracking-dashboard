"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Project } from "./types";

export default function ProjectCardMilestones({ project }: { project: Project }) {
  const [milestones, setMilestones] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("milestones")
        .select("*")
        .eq("project_id", project.id);

      setMilestones(data || []);
    };

    load();
  }, []);

  return (
    <Link
      href={`/projects/${project.state}/${project.zone}/${project.category}/${project.id}`}
    >
      <div className="bg-white p-6 border rounded-xl shadow">
        <h3 className="font-bold text-lg">{project.project_name}</h3>

        <h4 className="font-semibold mt-3 text-sm">Milestones</h4>
        <ul className="text-xs mt-1">
          {milestones.slice(0, 3).map((m) => (
            <li key={m.id}>• {m.milestone_name}</li>
          ))}
        </ul>

        {milestones.length > 3 && (
          <p className="text-xs mt-2 text-blue-600">+ More…</p>
        )}
      </div>
    </Link>
  );
}
