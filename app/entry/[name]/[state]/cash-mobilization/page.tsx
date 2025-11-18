"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard from "../../../../components/PaymentCard";

interface CashMobilizationForm {
  project: string;
  category: string;
  amount: number;
  dateRequested: string;
}

export default function CashMobilizationPage({ params }: any) {
  const { name, state } = params;
  const [form, setForm] = useState<CashMobilizationForm>({
    project: "",
    category: "",
    amount: 0,
    dateRequested: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.from("cash_mobilization").insert([
      {
        contractor: name,
        state,
        project: form.project,
        category: form.category,
        amount: form.amount,
        status: "PENDING",
        dateRequested: form.dateRequested,
      },
    ]);

    setSubmitting(false);
    if (error) setError("Error uploading form: " + error.message);
    else setSuccess("Form uploaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCF5] p-6">
      <h1 className="text-3xl font-bold text-black mb-6">Cash Mobilization</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Project"
            name="project"
            value={form.project}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            placeholder="Category"
            name="category"
            value={form.category}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            placeholder="Amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="date"
            name="dateRequested"
            value={form.dateRequested}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-black text-white font-bold py-2 rounded-lg hover:bg-gray-800"
          >
            {submitting ? "Submitting..." : "Upload"}
          </button>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
        </div>

        {/* Preview Card */}
        <PaymentCard
          project={form.project || "TMF-D"}
          contractor={name}
          category={form.category || "Building"}
          amount={form.amount || 1000000}
          dateRequested={form.dateRequested || "2025-11-28"}
          status="PENDING"
        />
      </div>

      <footer className="w-full mt-auto bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="hover:text-black transition"
        >
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
