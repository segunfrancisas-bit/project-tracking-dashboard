"use client";

import Link from "next/link";
import { Project } from "./types";

export default function ProjectCardExpand({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.state}/${project.zone}/${project.category}/${project.id}`}
    >
      <div className="bg-white p-6 rounded-xl shadow hover:scale-105 duration-300 cursor-pointer border">
        <h3 className="text-xl font-bold">{project.project_name}</h3>
        <p className="text-gray-500">{project.contractor}</p>

        <div className="mt-4">
          <p className="text-sm">Contract Sum: ₦{project.contract_sum}</p>
          <p className="text-sm">Value Done: ₦{project.value_of_work_done}</p>
        </div>
      </div>
    </Link>
  );
}
