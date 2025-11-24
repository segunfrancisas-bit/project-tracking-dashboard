"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function ReinforcementRequestPage() {
  const params = useParams() as { name: string; state: string };

  const [formData, setFormData] = useState({
    project: "",
    contractor: "",
    category: "",
    dateRequested: "",
    y10: "",
    y12: "",
    y16: "",
    y20: "",
    y25: "",
    y32: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { project, contractor, category, dateRequested, y10, y12, y16, y20, y25, y32 } = formData;

    const data = {
      project,
      contractor,
      category,
      dateRequested,
      state: params.state.toUpperCase(),
      status: "PENDING",
      y10: parseFloat(y10) || 0,
      y12: parseFloat(y12) || 0,
      y16: parseFloat(y16) || 0,
      y20: parseFloat(y20) || 0,
      y25: parseFloat(y25) || 0,
      y32: parseFloat(y32) || 0,
    };

    const { error } = await supabase.from("reinforcement_request").insert([data]);

    if (error) setMessage("❌ Upload failed: " + error.message);
    else {
      setMessage("✅ Reinforcement request submitted!");
      setFormData({
        project: "",
        contractor: "",
        category: "",
        dateRequested: "",
        y10: "",
        y12: "",
        y16: "",
        y20: "",
        y25: "",
        y32: "",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-10 px-4 animate-gradient-xy space-y-10" style={{ backgroundSize: "400% 400%" }}>
      <h1 className="text-2xl sm:text-3xl font-semibold text-center text-black drop-shadow-lg">
        Reinforcement Request Form
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-8 shadow-2xl flex flex-col space-y-6 transition-transform duration-300 hover:scale-[1.02]"
      >
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleChange}
          placeholder="Project"
          className="p-4 rounded-lg bg-white/30 border border-white/40 placeholder-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <input
          type="text"
          name="contractor"
          value={formData.contractor}
          onChange={handleChange}
          placeholder="Contractor"
          className="p-4 rounded-lg bg-white/30 border border-white/40 placeholder-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-4 rounded-lg bg-white/30 border border-white/40 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
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
          className="p-4 rounded-lg bg-white/30 border border-white/40 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          {["y10","y12","y16","y20","y25","y32"].map((size) => (
            <input
              key={size}
              type="number"
              name={size}
              value={formData[size as keyof typeof formData]}
              onChange={handleChange}
              step="0.1"
              min={0}
              placeholder={size.toUpperCase() + " (Tons)"}
              className="p-3 rounded-lg bg-white/30 border border-white/40 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {message && (
        <p className="text-center font-medium text-lg text-black drop-shadow-md">
          {message}
        </p>
      )}

      <footer className="w-full text-center text-sm text-black p-4 backdrop-blur-sm">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="font-semibold hover:text-black transition"
        >
          Iroko🌴
        </a>
      </footer>

      <style jsx>{`
        @keyframes gradient-xy {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-xy {
          background: linear-gradient(-45deg, #FFFDF7, #FFF8E7, #FFFCE2, #FFFDF7);
          animation: gradient-xy 20s ease infinite;
        }
      `}</style>
    </div>
  );
}
