"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard from "../../../../components/PaymentCard";

export default function MaterialRequestPage({ params }: any) {
  const { name, state } = params;
  const [form, setForm] = useState({
    project: "",
    category: "",
    tons: 0,
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

    const { error } = await supabase.from("material_request").insert([
      {
        contractor: name,
        state,
        project: form.project,
        category: form.category,
        tons: form.tons,
        status: "DELIVERED",
        dateRequested: form.dateRequested,
      },
    ]);

    setSubmitting(false);
    if (error) setError("Error uploading form: " + error.message);
    else setSuccess("Form uploaded successfully!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFFCF5] p-6">
      <h1 className="text-3xl font-bold text-black mb-6">Material Request</h1>

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
            placeholder="Tons"
            name="tons"
            value={form.tons}
            onChange={handleChange}
            className="px-4 py-2 rounded-lg border border-gray-300"
          />
          <input
            type="date"
            placeholder="Date Requested"
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
          project={form.project || "Orchid 1"}
          contractor={name}
          category={form.category || "PILING"}
          tons={form.tons || 15}
          dateRequested={form.dateRequested || "29-Oct-25"}
          status="DELIVERED"
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
