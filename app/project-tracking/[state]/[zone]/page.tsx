"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ProjectCard from "@/app/components/ProjectCard"; // your card component

interface ProjectItem {
  id: string;
  project_name: string;
  contractor: string;
  site: string;
  category: string;
  contract_sum: number;
  amount_paid: number;
  value_of_work_done: number;
  zone: string;
  state: string;
  created_at: string;
  milestones: any[];
}

export default function ZoneProjectsPage() {
  const params = useParams();
  const stateParam = params?.state;
  const zoneParam = params?.zone;

  const state = Array.isArray(stateParam) ? stateParam[0] : stateParam || "";
  const zone = Array.isArray(zoneParam) ? zoneParam[0] : zoneParam || "";

  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch projects
  useEffect(() => {
    const fetchData = async () => {
      if (!state || !zone) return;

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("state", state)
        .eq("zone", zone);

      if (!error && data) setData(data as ProjectItem[]);
      setLoading(false);
    };
    fetchData();
  }, [state, zone]);

  // Determine project status
  const getStatus = (project: ProjectItem) => {
    if (project.value_of_work_done < project.amount_paid) return "exposed";
    if (project.value_of_work_done > project.amount_paid) return "not exposed";
    return "balanced";
  };

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();

    return (
      item.project_name.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.site.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term) ||
      item.zone.toLowerCase().includes(term) ||
      item.state.toLowerCase().includes(term) ||
      item.contract_sum.toString().includes(term) ||
      getStatus(item).includes(term)
    );
  });

  return (
    <div className="relative min-h-screen flex flex-col bg-gradient-to-br from-[#fdfcfb] to-[#f5f5f5] overflow-x-hidden">
      
      {/* Floating VISION logo */}
      <div className="absolute top-6 right-6 text-black font-bold text-2xl opacity-20 animate-float">
        V
      </div>

      <div className="flex flex-col items-center flex-grow p-6">
        {/* Centered Header */}
        <h1 className="text-2xl md:text-3xl font-semibold text-black mb-6 text-center tracking-wide">
          Project Overview
        </h1>

        {/* Search Input */}
        <div className="text-gray-400 mb-6 w-full max-w-md">
          <input
            type="text"
            placeholder="Search by project, contractor, site, category, location, contract sum, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-3 text-sm rounded-full shadow-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-slate-400 transition"
          />
        </div>

        {/* Projects Grid */}
        <main className="w-full flex-1">
          {loading ? (
            <p className="text-center text-gray-500 mt-12 text-sm">Loading...</p>
          ) : filteredData.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-center">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="transform transition duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <ProjectCard
                    id={item.id}
                    project_name={item.project_name}
                    contractor={item.contractor}
                    site={item.site}
                    category={item.category}
                    contract_sum={item.contract_sum}
                    amount_paid={item.amount_paid}
                    value_of_work_done={item.value_of_work_done}
                    milestones={item.milestones}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-12 text-sm">
              No projects found for {zone} in {state}.
            </p>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#FFFDF7] p-4 text-center text-sm text-black mt-auto border-t border-gray-200">
        © 2025 Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 transition font-semibold"
        >
          Iroko🌴
        </a>
      </footer>

      <style jsx>{`
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); opacity: 0.2; }
          50% { transform: translateY(-10px); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
}
