"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard, { Status } from "@/components/PaymentCard";

interface CementItem {
  project: string;
  contractor: string;
  bags: number;
  category: string;
  status: Status;
  dateRequested: string;
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
      item.bags.toString().includes(term) ||
      item.dateRequested.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter(x => x.status === "PENDING").length;
  const overdueCount = data.filter(x => x.status === "OVERDUE").length;

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">
        Cement – {state}
      </h1>

      <div className="mb-6 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, bags, or date..."
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
                amount={item.bags}
                category={item.category as "BUILDING" | "INFRASTRUCTURE" | "PILING"}
                status={item.status}
                dateRequested={item.dateRequested}
                unit="Bags"
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
