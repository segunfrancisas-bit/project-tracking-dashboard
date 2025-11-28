"use client";

import Link from "next/link";
import { Project } from "./types";

export default function ProjectCardProgress({ project }: { project: Project }) {
  const targetPercent = Math.min(
    (project.target_total / project.contract_sum) * 100,
    100
  );

  const achievedPercent = Math.min(
    (project.achieved_total / project.contract_sum) * 100,
    100
  );

  return (
    <Link
      href={`/projects/${project.state}/${project.zone}/${project.category}/${project.id}`}
    >
      <div className="bg-white p-6 rounded-xl border shadow hover:shadow-xl duration-300 cursor-pointer">
        <h3 className="text-lg font-bold">{project.project_name}</h3>
        <p>{project.contractor}</p>

        <div className="mt-4">
          <p className="text-sm font-semibold">Target Progress</p>
          <div className="w-full bg-gray-300 h-2 rounded">
            <div
              className="h-2 bg-blue-600 rounded"
              style={{ width: `${targetPercent}%` }}
            />
          </div>

          <p className="text-sm font-semibold mt-3">Achieved Progress</p>
          <div className="w-full bg-gray-300 h-2 rounded">
            <div
              className="h-2 bg-green-600 rounded"
              style={{ width: `${achievedPercent}%` }}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
