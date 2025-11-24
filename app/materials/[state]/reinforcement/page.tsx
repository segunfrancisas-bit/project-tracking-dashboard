"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard, { Status } from "@/app/components/PaymentCard";

interface ReinforcementItem {
  project: string;
  contractor: string;
  y10: number;
  y12: number;
  y16: number;
  y20: number;
  y25: number;
  y32: number;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested: string;
}

export default function ReinforcementPage() {
  const params = useParams();
  const state = Array.isArray(params?.state) ? params.state[0].toUpperCase() : params?.state?.toUpperCase() ?? "";

  const [data, setData] = useState<ReinforcementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!state) return;
      const { data, error } = await supabase
        .from("reinforcement_request")
        .select("*")
        .eq("state", state);
      if (!error && data) setData(data as ReinforcementItem[]);
      setLoading(false);
    };
    fetchData();
  }, [state]);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    const totalTons = (item.y10 || 0) + (item.y12 || 0) + (item.y16 || 0) + (item.y20 || 0) + (item.y25 || 0) + (item.y32 || 0);
    return (
      item.project.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      totalTons.toString().includes(term) ||
      item.dateRequested.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter((x) => x.status === "PENDING").length;
  const overdueCount = data.filter((x) => x.status === "OVERDUE").length;

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">
        Reinforcement – {state}
      </h1>

      <div className="mb-6 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, tons, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <main>
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.map((item, index) => (
              <PaymentCard
                key={index}
                project={item.project}
                contractor={item.contractor}
                category={item.category}
                status={item.status}
                dateRequested={item.dateRequested}
                y10={item.y10}
                y12={item.y12}
                y16={item.y16}
                y20={item.y20}
                y25={item.y25}
                y32={item.y32}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No results found.</p>
        )}
      </main>

      <div className="fixed bottom-24 right-6 bg-gray-200 text-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <p><strong>Pending:</strong> {pendingCount}</p>
        <p><strong>Overdue:</strong> {overdueCount}</p>
      </div>
    </div>
  );
}
