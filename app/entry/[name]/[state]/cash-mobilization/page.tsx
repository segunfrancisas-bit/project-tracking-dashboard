"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";

export default function CashMobilizationForm() {
  const searchParams = useSearchParams();
  const contractor = searchParams.get("name") || "Contractor";
  const state = searchParams.get("state") || "Lagos";

  const [form, setForm] = useState({
    project: "",
    amount: "",
    category: "",
    dateRequested: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { project, amount, category, dateRequested } = form;

    const { error } = await supabase.from("cash_mobilization").insert([
      {
        project,
        contractor,
        state,
        amount: Number(amount),
        category,
        dateRequested,
        status: "PENDING",
      },
    ]);

    if (error) setMessage("❌ Error: " + error.message);
    else {
      setMessage("✅ Cash mobilization submitted!");
      setForm({ project: "", amount: "", category: "", dateRequested: "" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50 flex flex-col">
      <h1 className="text-3xl font-bold mb-6 text-black text-center">Cash Mobilization</h1>

      <form className="max-w-lg mx-auto grid gap-4 text-black" onSubmit={handleSubmit}>
        <input
          name="project"
          value={form.project}
          onChange={handleChange}
          placeholder="Project Name"
          className="p-3 border rounded-lg text-black"
          required
        />

        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount (₦)"
          className="p-3 border rounded-lg text-black"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-3 border rounded-lg text-black"
          required
        >
          <option value="">Select Category</option>
          <option value="BUILDING">BUILDING</option>
          <option value="INFRASTRUCTURE">INFRASTRUCTURE</option>
          <option value="PILING">PILING</option>
        </select>

        <input
          type="date"
          name="dateRequested"
          value={form.dateRequested}
          onChange={handleChange}
          className="p-3 border rounded-lg text-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {message && <p className="mt-4 text-lg font-semibold text-black text-center">{message}</p>}

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#FFFDF7] p-1 text-center text-sm text-black">
        © Vision by{" "}
        <a href="https://wa.me/2348140730579" className="hover:text-black">Iroko🌴</a>
      </footer>
    </div>
  );
}
