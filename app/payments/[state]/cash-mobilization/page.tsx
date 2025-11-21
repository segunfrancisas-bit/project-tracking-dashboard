"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // <-- safe params hook
import { supabase } from "@/lib/supabaseClient";
import PaymentCard, { Status } from "@/app/components/PaymentCard";

interface CashMobilizationItem {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: Status;
  dateRequested: string;
}

export default function CashMobilizationPage() {
  const params = useParams();
  const stateParam = params?.state;
  const state = Array.isArray(stateParam) ? stateParam[0].toUpperCase() : (stateParam || "");

  const [data, setData] = useState<CashMobilizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!state) return;

      const { data, error } = await supabase
  .from("cash_mobilization")
  .select("*")
  .ilike("state", state);  // <-- FIX: case-insensitive

      if (!error && data) setData(data as CashMobilizationItem[]);
      setLoading(false);
    };
    fetchData();
  }, [state]);

  const filteredData = data.filter((item) => {
  const term = searchTerm.toLowerCase();
  return (
    item.project?.toLowerCase().includes(term) ||
    item.contractor?.toLowerCase().includes(term) ||
    (item.status ?? "").toLowerCase().includes(term) ||
    item.amount?.toString().includes(term) ||
    item.dateRequested?.toLowerCase().includes(term)
  );
});

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">
        Cash Mobilization – {state}
      </h1>

      <div className="mb-6 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, amount, or date..."
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
                amount={item.amount}
                category={item.category as "BUILDING" | "INFRASTRUCTURE" | "PILING"}
                status={item.status}
                dateRequested={item.dateRequested}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No results found.</p>
        )}
      </main>
    </div>
  );
}
