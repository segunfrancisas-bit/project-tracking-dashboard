"use client";
export const dynamic = "force-dynamic";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ClientProjectCard from "@/app/components/ClientProjectCard";

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
  milestones: any[];
  cement: number;
  reinforcement_given: Record<string, number> | string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const client = searchParams.get("client") || "";

  const [data, setData] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!client) return;

      const { data: projects, error } = await supabase
        .from("projects")
        .select("*")
        .ilike("contractor", client);

      if (!error && projects) {
        setData(projects as ProjectItem[]);
      }

      setLoading(false);
    };

    fetchData();
  }, [client]);

  const filteredData = data.filter((p) =>
    p.project_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gray-50 py-10 px-6">
      {/* Header: PROJECTS + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
        {/* PROJECTS with pulsing */}
        <h1 className="text-3xl font-extrabold text-gray-900 animate-pulse">
          PROJECTS
        </h1>

        {/* Search bar */}
        <div className="flex-1 sm:ml-6">
          <input
            type="text"
            placeholder="Search by project name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black placeholder-gray-200"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading projects...</p>
      ) : filteredData.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
          {filteredData.map((p) => {
            const reinforcement =
              typeof p.reinforcement_given === "string"
                ? JSON.parse(p.reinforcement_given)
                : p.reinforcement_given;

            return (
              <ClientProjectCard
                key={p.id}
                project_name={p.project_name}
                contractor={p.contractor}
                site={p.site || "N/A"}
                zone={p.zone || "N/A"}
                state={p.state || "N/A"}
                category={p.category}
                contract_sum={p.contract_sum}
                amount_paid={p.amount_paid}
                value_of_work_done={p.value_of_work_done}
                milestones={p.milestones ?? []}
                cement={p.cement}
                reinforcement={reinforcement}
                className="transition-transform transform hover:scale-105 hover:shadow-xl"
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 text-lg">
          No projects found for <span className="font-semibold">{client}</span>.
        </p>
      )}
    </div>
  );
}

export default function ClientDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center text-gray-500">Loading dashboard...</div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
