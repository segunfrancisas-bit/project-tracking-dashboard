"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function CementRequestPage() {
  const params = useParams() as { name: string; state: string };

  const [formData, setFormData] = useState({
    project: "",
    contractor: "",
    quantity: "",
    category: "",
    dateRequested: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { project, contractor, quantity, category, dateRequested } = formData;

    const { error } = await supabase.from("cement_request").insert([
      {
        project,
        contractor: params.name,
        state: params.state.toUpperCase(),
        quantity: Number(quantity),
        category,
        dateRequested,
        status: "PENDING",
      },
    ]);

    if (error) setMessage("❌ Upload failed: " + error.message);
    else {
      setMessage("✅ Cement request submitted!");
      setFormData({
        project: "",
        contractor: "",
        quantity: "",
        category: "",
        dateRequested: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="w-full min-h-screen p-6 bg-gray-100 flex flex-col">
      <h1 className="text-2xl font-bold mb-4 text-black text-center">
        Cement Request – {params.name.toUpperCase()} ({params.state.toUpperCase()})
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md grid gap-4 max-w-xl text-black"
      >
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleChange}
          placeholder="Project"
          className="p-3 border rounded-lg text-black"
          required
        />

        <input
          type="text"
          name="contractor"
          value={formData.contractor}
          onChange={handleChange}
          placeholder="Contractor"
          className="p-3 border rounded-lg text-black"
          required
        />

        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          placeholder="Quantity (Bags)"
          className="p-3 border rounded-lg text-black"
          required
        />

        <select
          name="category"
          value={formData.category}
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
          value={formData.dateRequested}
          onChange={handleChange}
          className="p-3 border rounded-lg text-black"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          {loading ? "Submitting..." : "Submit Request"}
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
