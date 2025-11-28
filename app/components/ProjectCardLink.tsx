"use client";

import Link from "next/link";
import { Project } from "./types";

export default function ProjectCardLink({ project }: { project: Project }) {
  return (
    <div className="bg-white p-6 shadow rounded-xl border">
      <h3 className="text-lg font-bold">{project.project_name}</h3>
      <p>{project.contractor}</p>

      <Link
        href={`/projects/${project.state}/${project.zone}/${project.category}/${project.id}`}
      >
        <button className="mt-4 bg-black text-white px-4 py-2 rounded">
          View Project →
        </button>
      </Link>
    </div>
  );
}
