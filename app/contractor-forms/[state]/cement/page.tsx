"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function CementForm() {
  const params = useParams();
  const stateParam = params?.state;
const state = Array.isArray(stateParam)
  ? stateParam[0].toUpperCase()
  : stateParam?.toUpperCase() || "";

  const [form, setForm] = useState({
    project: "",
    contractor: "",
    bags: "",
    category: "",
    dateRequested: "",
  });

  const categories = ["BUILDING", "INFRASTRUCTURE", "PILING"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!state) return alert("State parameter missing!");

    const { error } = await supabase.from("cement_request").insert([
      {
        ...form,
        state,
        bags: Number(form.bags),
      },
    ]);

    if (error) alert("Upload failed: " + error.message);
    else {
      alert("Cement Request submitted!");
      setForm({ project: "", contractor: "", bags: "", category: "", dateRequested: "" });
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Cement Form – {state}</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          className="border p-2 w-full"
          placeholder="Project"
          value={form.project}
          onChange={(e) => setForm({ ...form, project: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Contractor"
          value={form.contractor}
          onChange={(e) => setForm({ ...form, contractor: e.target.value })}
          required
        />

        <input
          className="border p-2 w-full"
          placeholder="Bags"
          type="number"
          value={form.bags}
          onChange={(e) => setForm({ ...form, bags: e.target.value })}
          required
        />

        <select
          className="border p-2 w-full"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input
          className="border p-2 w-full"
          type="date"
          value={form.dateRequested}
          onChange={(e) => setForm({ ...form, dateRequested: e.target.value })}
          required
        />

        <button className="bg-black text-white p-2 w-full rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
