"use client";

import Link from "next/link";
import { Project } from "./types";
import "./flip.css"; // create this file

export default function ProjectCardFlip({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.state}/${project.zone}/${project.category}/${project.id}`}
      className="flip-card"
    >
      <div className="flip-card-inner">
        {/* FRONT */}
        <div className="flip-card-front">
          <h2 className="text-xl font-bold">{project.project_name}</h2>
          <p>{project.contractor}</p>
          <p>{project.site}</p>
        </div>

        {/* BACK */}
        <div className="flip-card-back">
          <p>Contract Sum: ₦{project.contract_sum}</p>
          <p>Paid: ₦{project.amount_paid}</p>
          <p>Work Done: ₦{project.value_of_work_done}</p>
        </div>
      </div>
    </Link>
  );
}
