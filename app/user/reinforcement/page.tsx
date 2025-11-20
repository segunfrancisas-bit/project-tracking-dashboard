"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard from "@/components/PaymentCard";

export default function UserReinforcementRequest() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    const { data, error } = await supabase
      .from("reinforcement_request")
      .select("*")
      .order("dateRequested", { ascending: false });

    if (!error) setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
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
            category={item.category}
            amount={item.tons}
            unit="Tons"
            status={item.status}
            dateRequested={item.dateRequested}
          />
        ))}
      </div>
    </div>
  );
}
