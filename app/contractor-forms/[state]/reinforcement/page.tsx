"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import PaymentCard, { Status } from "@/app/components/PaymentCard";

interface ReinforcementItem {
  id: number;
  project: string;
  contractor: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested: string;
  y10: number;
  y12: number;
  y16: number;
  y20: number;
  y25: number;
  y32: number;
}

export default function ContractorReinforcementPage() {
  const params = useParams();
  const state = (() => {
    const value = params?.state;
    if (Array.isArray(value)) return value[0].toUpperCase();
    return value?.toUpperCase() ?? "";
  })();

  const [form, setForm] = useState({
    project: "",
    category: "",
    y10: "",
    y12: "",
    y16: "",
    y20: "",
    y25: "",
    y32: "",
    dateRequested: "",
  });

  const [submissions, setSubmissions] = useState<ReinforcementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [contractor, setContractor] = useState<string>("");

  // Get logged-in contractor from Supabase Auth
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) setContractor(user.email);
    };
    getUser();
  }, []);

  // Load previous submissions
  const loadSubmissions = async () => {
    if (!state || !contractor) return;
    const { data, error } = await supabase
      .from("reinforcement_request")
      .select("*")
      .eq("state", state)
      .eq("contractor", contractor)
      .order("dateRequested", { ascending: false });

    if (!error && data) setSubmissions(data as ReinforcementItem[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!contractor) return;
    loadSubmissions();

    // Real-time updates using Supabase v2 channel API
    const channel = supabase
      .channel("reinforcement_request_channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "reinforcement_request",
          filter: `contractor=eq.${contractor}&state=eq.${state}`,
        },
        (payload) => {
          const newData = payload.new as ReinforcementItem;
          setSubmissions((prev) => [newData, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state, contractor]);

  const toNumber = (value: string) => (value === "" ? 0 : Number(value));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractor) return alert("Contractor not detected!");
    setMessage("");

    const data = {
      ...form,
      state,
      contractor,
      status: "PENDING" as Status,
      y10: toNumber(form.y10),
      y12: toNumber(form.y12),
      y16: toNumber(form.y16),
      y20: toNumber(form.y20),
      y25: toNumber(form.y25),
      y32: toNumber(form.y32),
    };

    const { error } = await supabase.from("reinforcement_request").insert([data]);

    if (error) setMessage("❌ Submission failed: " + error.message);
    else {
      setMessage("✅ Submission successful!");
      setForm({
        project: "",
        category: "",
        y10: "",
        y12: "",
        y16: "",
        y20: "",
        y25: "",
        y32: "",
        dateRequested: "",
      });
    }
  };

  const categories = ["BUILDING", "INFRASTRUCTURE", "PILING"];

  return (
    <div className="p-6 min-h-screen bg-[#FFFDF7]">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Reinforcement Form – {state}
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Project"
          value={form.project}
          onChange={(e) => setForm({ ...form, project: e.target.value })}
          required
          className="border p-2 w-full rounded"
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
          className="border p-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={form.dateRequested}
          onChange={(e) => setForm({ ...form, dateRequested: e.target.value })}
          required
          className="border p-2 w-full rounded"
        />

        <div className="grid grid-cols-3 gap-2">
          {["y10", "y12", "y16", "y20", "y25", "y32"].map((size) => (
            <input
              key={size}
              type="number"
              min={0}
              step={0.1}
              placeholder={size.toUpperCase()}
              value={(form as any)[size]}
              onChange={(e) => setForm({ ...form, [size]: e.target.value })}
              className="border p-2 rounded"
            />
          ))}
        </div>

        <button className="bg-black text-white p-2 w-full rounded">Submit</button>
      </form>

      {message && <p className="text-center mt-2 font-medium">{message}</p>}

      <h2 className="text-xl font-semibold mt-8 mb-4 text-center">
        Your Previous Submissions
      </h2>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : submissions.length === 0 ? (
        <p className="text-center text-gray-500">No previous submissions</p>
      ) : (
        <div className="grid gap-4">
          {submissions.map((item) => (
            <PaymentCard
              key={item.id}
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
      )}
    </div>
  );
}
