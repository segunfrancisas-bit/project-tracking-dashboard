"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import CementCard from "@/app/components/CementCard";

interface CementItem {
  id: number;
  project: string;
  contractor: string;
  quantity: number;
  category: string;
  status: Status;
  dateRequested: string;

  delivered?: boolean;         // ← Ensure this exists in DB
  delivered_date?: string | null;
}

export default function CementPage() {
  const params = useParams();
  const stateParam = params?.state;
  const state = Array.isArray(stateParam)
    ? stateParam[0].toUpperCase()
    : stateParam?.toUpperCase() || "";

  const [data, setData] = useState<CementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!state) return;

      const { data, error } = await supabase
        .from("cement_request")
        .select("*")
        .eq("state", state);

      if (!error && data) setData(data as CementItem[]);
      setLoading(false);
    };
    fetchData();
  }, [state]);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.project.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.quantity.toString().includes(term) ||
      item.dateRequested.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter(x => x.status === "PENDING").length;
  const overdueCount = data.filter(x => x.status === "OVERDUE").length;
  const deliveredCount = data.filter(x => x.delivered === true).length; // ← Added

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-4 pb-16">
      <h1 className="text-xl font-semibold text-center mb-4 text-black">
        CEMENT REQUESTS – {state}
      </h1>

      <div className="mb-4 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, bags, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <main>
        {loading ? (
          <p className="text-center text-gray-500 mt-6 text-sm">Loading...</p>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredData.map((item) => (
              <CementCard
                key={item.id}
                id={item.id}
                project={item.project}
                contractor={item.contractor}
                quantity={item.quantity}
                category={item.category as "BUILDING" | "INFRASTRUCTURE" | "PILING"}
                status={item.status}
                dateRequested={item.dateRequested}
                unit="Bags"
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6 text-sm">No results found.</p>
        )}
      </main>

      {/* Status Overview Box */}
      <div className="fixed bottom-16 right-4 bg-white text-gray-800 p-2 rounded-lg shadow-sm text-xs">
        <p className="font-medium mb-1">Status Overview</p>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="font-medium">Pending:</span>
            <span>{pendingCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Overdue:</span>
            <span>{overdueCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Delivered:</span>
            <span>{deliveredCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
