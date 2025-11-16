"use client";

import { useEffect, useState } from "react";

export default function ProjectsPage() {
  const [user, setUser] = useState("User");

  // Temporary sample projects (we will make them dynamic later)
  const [projects, setProjects] = useState([
    {
      title: "Foundation Work",
      assignedTo: "Richard",
      progress: 60,
      lastUpdated: "2025-11-14",
      status: "Ongoing",
    },
    {
      title: "Roof Construction",
      assignedTo: "Ifeanyi",
      progress: 30,
      lastUpdated: "2025-11-13",
      status: "Pending",
    },
    {
      title: "Interior Design",
      assignedTo: "Tomi",
      progress: 80,
      lastUpdated: "2025-11-10",
      status: "Ongoing",
    },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nameParam = params.get("name");
    if (nameParam) setUser(nameParam);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-black mb-6 text-center">
        Projects Overview — Dr {user}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <div
            key={index}
            className="bg-white shadow p-5 rounded-xl border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-2">{project.title}</h2>

            <p className="text-sm text-gray-600">
              Assigned to: <strong>{project.assignedTo}</strong>
            </p>

            <p className="text-sm text-gray-600">
              Status: <strong>{project.status}</strong>
            </p>

            <p className="text-sm text-gray-600 mb-3">
              Last Updated: {project.lastUpdated}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 overflow-hidden">
              <div
                className="bg-blue-600 h-4 transition-all duration-500"
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>

            <p className="text-right text-sm mt-1 font-medium">
              {project.progress}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
