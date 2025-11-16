"use client";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { allProjects, Project } from "../../../data/projects"; // <- fixed path

const formatCurrency = (num: number) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    num
  );

export default function CategoryPage() {
  const params = useParams();
  const { state, zone, category } = params as {
    state: string;
    zone: string;
    category: string;
  };

  const decodedZone = decodeURIComponent(zone);
  const [searchTerm, setSearchTerm] = useState("");

  const projects = useMemo(() => {
    return allProjects.filter((p) => {
      const matchesZone = p.zone.toLowerCase() === decodedZone.toLowerCase();
      const matchesCategory = p.category.toLowerCase() === category.toLowerCase();
      const matchesSearch =
        p.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.contractor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.site.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesZone && matchesCategory && matchesSearch;
    });
  }, [decodedZone, category, searchTerm]);

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF5]">
      {/* Header */}
      <header className="sticky top-0 bg-gray-300 shadow-md z-10 p-1">
        <h1 className="text-2xl font-bold text-center text-black uppercase">
          Projects in {decodedZone} {category}
        </h1>
        <input
          type="text"
          placeholder="Search by project, contractor or site"
          className="w-full mt-2 p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-black text-black text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </header>

      {/* Projects Grid */}
      <main className="flex-1 p-4">
        {projects.length === 0 ? (
          <p className="text-black text-center mt-10 text-sm">No projects found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {projects.map((project) => {
              // Exposure dot colors (top-right corner)
              let dotColor = "bg-gray-400"; // default balanced
              let tooltipText = "Balanced";
              if (project.amountPaid > project.valueOfWorkDone) {
                dotColor = "bg-red-700";
                tooltipText = "Exposed";
              } else if (project.valueOfWorkDone > project.amountPaid) {
                dotColor = "bg-green-700";
                tooltipText = "Not-Exposed";
              }

              return (
                <div
                  key={`${project.zone}-${project.sNo}-${project.contractor}-${project.site}`}
                  className="relative bg-gray-200 p-2 rounded-lg shadow text-black hover:bg-gray-600 hover:text-white transition text-xs group"
                >
                  {/* Exposure dot */}
                  <div className="absolute top-2 right-2 flex flex-col items-center">
                    <span
                      className={`w-3 h-3 rounded-full animate-pulse ${dotColor}`}
                    ></span>
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity mt-1 text-[9px] bg-black text-white px-2 py-1 rounded-lg whitespace-nowrap z-50 absolute top-0 translate-y-[-120%]">
                      {tooltipText}
                    </span>
                  </div>

                  <h2 className="font-bold text-base mb-1">{project.project}</h2>
                  <p className="mb-1">
                    <span className="font-semibold">Contractor:</span> {project.contractor}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Site:</span> {project.site}
                  </p>

                  <p className="mt-1 mb-1 font-semibold">Target</p>
                  <div className="relative w-full bg-white rounded-full h-4 mb-1">
                    <div
                      className="bg-green-500 h-4 rounded-full flex items-center justify-center text-white text-[10px] font-semibold"
                      style={{ width: `${project.targetProgress}%` }}
                    >
                      {project.targetProgress}%
                    </div>
                  </div>

                  <p className="mt-1 mb-1 font-semibold">Achieved</p>
                  <div className="relative w-full bg-white rounded-full h-4 mb-2">
                    <div
                      className={`h-4 rounded-full flex items-center justify-center text-white text-[10px] font-semibold ${
                        project.workProgress >= project.targetProgress
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${project.workProgress}%` }}
                    >
                      {project.workProgress}%
                    </div>
                  </div>

                  <p className="mb-1">
                    <span className="font-semibold">Contract Sum:</span>{" "}
                    {formatCurrency(project.contractSum)}
                  </p>
                  <p className="mb-1">
                    <span className="font-semibold">Amount Paid:</span>{" "}
                    {formatCurrency(project.amountPaid)}
                  </p>
                  <p>
                    <span className="font-semibold">Value of Work Done:</span>{" "}
                    {formatCurrency(project.valueOfWorkDone)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="hover:text-black transition"
          style={{ textDecoration: "none" }}
        >
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
