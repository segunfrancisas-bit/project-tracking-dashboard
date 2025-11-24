"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function CementRequestPage() {
  const params = useParams() as { name: string; state: string };

  const [formData, setFormData] = useState({
    project: "",
    contractor: "",
    bags: "",
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

    const { project, contractor, bags, category, dateRequested } = formData;

    const { error } = await supabase.from("cement_request").insert([
      {
        project,
        contractor: params.name,
        state: params.state.toUpperCase(),
        bags: Number(bags),
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
        bags: "",
        category: "",
        dateRequested: "",
      });
    }

    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-8 px-4 animate-gradient-xy"
      style={{ backgroundSize: "400% 400%" }}
    >
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl md:text-3xl font-semibold mb-8 text-center text-black drop-shadow-lg">
        Cement Request Form
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl p-6 sm:p-8 shadow-2xl grid gap-4 transition-transform duration-300 hover:scale-[1.02]"
      >
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleChange}
          placeholder="Project"
          className="p-3 rounded-lg bg-white/30 border border-white/40 placeholder-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <input
          type="text"
          name="contractor"
          value={formData.contractor}
          onChange={handleChange}
          placeholder="Contractor"
          className="p-3 rounded-lg bg-white/30 border border-white/40 placeholder-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <input
          type="number"
          name="bags"
          value={formData.bags}
          onChange={handleChange}
          placeholder="Quantity (Bags)"
          className="p-3 rounded-lg bg-white/30 border border-white/40 placeholder-gray-300 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="p-3 rounded-lg bg-white/30 border border-white/40 text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
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
          className="p-3 rounded-lg bg-white/30 border border-white/40 text-black focus:outline-none focus:ring-2 focus:ring-black/50 focus:border-black transition"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition shadow-lg"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>
      </form>

      {/* Message */}
      {message && (
        <p className="mt-4 text-center font-medium text-lg text-black drop-shadow-md">
          {message}
        </p>
      )}

      {/* Footer */}
      <footer className="w-full mt-auto text-center text-sm text-black p-4 backdrop-blur-sm">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="font-semibold hover:text-black transition"
        >
          Iroko🌴
        </a>
      </footer>

      {/* Background Animation */}
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
