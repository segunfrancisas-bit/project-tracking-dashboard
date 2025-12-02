"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import ReinforcementCard, { Status } from "@/app/components/ReinforcementCard";

interface ReinforcementItem {
  id: number;
  project: string;
  contractor: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested: string;

  y10?: number;
  y12?: number;
  y16?: number;
  y20?: number;
  y25?: number;
  y32?: number;

  sent_to_award?: boolean;
  sent_to_award_date?: string | null;
  sent_for_approval?: boolean;
  sent_for_approval_date?: string | null;
  approved?: boolean;
  approved_date?: string | null;
  sent_to_procurement?: boolean;
  sent_to_procurement_date?: string | null;
  delivered?: boolean;
  delivered_date?: string | null;
}

export default function ReinforcementPage() {
  const params = useParams();
  const state = Array.isArray(params?.state)
    ? params.state[0].toUpperCase()
    : params?.state?.toUpperCase() ?? "";

  const [items, setItems] = useState<ReinforcementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = useCallback(async () => {
    if (!state) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("reinforcement_request")
      .select("*")
      .eq("state", state)
      .order("dateRequested", { ascending: true });

    if (!error && data) setItems(data as ReinforcementItem[]);
    setLoading(false);
  }, [state]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // when child updates a card (toggle), update the list so UI persists in this view
  const handleCardUpdate = (id: number | string, updated: Partial<ReinforcementItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updated } : item));
  };

  const filtered = items.filter((item) => {
    const term = search.toLowerCase();
    const totalTons =
      (item.y10 ?? 0) +
      (item.y12 ?? 0) +
      (item.y16 ?? 0) +
      (item.y20 ?? 0) +
      (item.y25 ?? 0) +
      (item.y32 ?? 0);
    return (
      item.project.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      totalTons.toString().includes(term) ||
      item.dateRequested.toLowerCase().includes(term)
    );
  });

  // Status overview
  const statusCounts = {
    PENDING: items.filter((x) => x.status === "PENDING").length,
    OVERDUE: items.filter((x) => x.status === "OVERDUE").length,
    DELIVERED: items.filter((x) => x.status === "DELIVERED").length,
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-4 pb-16">
      <h1 className="text-xl font-semibold text-center mb-6 text-black">REINFORCEMENT REQUEST – {state}</h1>

      <div className="mb-4 flex justify-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by project, contractor, status or tonnage..." className="w-full max-w-md p-2 border rounded-full shadow-sm text-sm" />
      </div>

      <main>
        {loading ? (
          <p className="text-center text-gray-500 mt-10">Loading...</p>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <ReinforcementCard
                key={item.id}
                id={item.id}
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
                sent_to_award={item.sent_to_award}
                sent_to_award_date={item.sent_to_award_date}
                sent_for_approval={item.sent_for_approval}
                sent_for_approval_date={item.sent_for_approval_date}
                approved={item.approved}
                approved_date={item.approved_date}
                sent_to_procurement={item.sent_to_procurement}
                sent_to_procurement_date={item.sent_to_procurement_date}
                delivered={item.delivered}
                delivered_date={item.delivered_date}
                onUpdate={handleCardUpdate}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6 text-sm">No results found.</p>
        )}
      </main>

      <div className="fixed bottom-4 right-4 p-3 bg-white shadow-sm rounded-lg border border-gray-300 text-sm">
        <h4 className="text-sm font-semibold text-gray-800 mb-2">Status Overview</h4>
        <div className="flex flex-col gap-2 text-xs text-gray-700">
          <div className="flex justify-between"><div className="font-medium">PENDING:</div><div>{statusCounts.PENDING}</div></div>
          <div className="flex justify-between"><div className="font-medium">OVERDUE:</div><div>{statusCounts.OVERDUE}</div></div>
          <div className="flex justify-between"><div className="font-medium">DELIVERED:</div><div>{statusCounts.DELIVERED}</div></div>
        </div>
      </div>
    </div>
  );
}
