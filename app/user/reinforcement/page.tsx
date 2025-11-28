"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard from "../../components/PaymentCard";

interface ReinforcementItem {
  project: string;
  contractor: string;
  y10: number;
  y12: number;
  y16: number;
  y20: number;
  y25: number;
  y32: number;
  category: string;
  status: "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";
  dateRequested: string;
}

export default function UserReinforcementRequest() {
  const [items, setItems] = useState<ReinforcementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase
        .from("reinforcement_request")
        .select("*")
        .order("dateRequested", { ascending: false });

      if (!error && data) setItems(data as ReinforcementItem[]);
      setLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-[#FFFDF7] text-black">
      <h1 className="text-3xl font-bold mb-4">Reinforcement Requests</h1>

      {loading && <p>Loading...</p>}

      <div className="grid gap-4">
        {items.map((item, i) => (
          <PaymentCard
            key={i}
            project={item.project}
            contractor={item.contractor}
            category={item.category as any}
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
    </div>
  );
}
