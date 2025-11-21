"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContractorCategoryPage() {
  const params = useParams() as { name: string; state: string };
  const name = params?.name ?? "CONTRACTOR";
  const state = params?.state ?? "LAGOS";

  const categories = [
    { label: "Cash Mobilization", path: "cash-mobilization" },
    { label: "Milestone Request", path: "milestone-request" },
    { label: "Cement", path: "material-request/cement" },
    { label: "Reinforcement", path: "material-request/reinforcement" },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between px-4 py-8 animate-gradient-xy"
      style={{ backgroundSize: "400% 400%" }}
    >
      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-center text-black drop-shadow-lg">
        Select a Category
      </h1>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {categories.map((cat) => (
          <Link
            key={cat.path}
            href={`/entry/${name}/${state}/${cat.path}`}
            className="block bg-white/20 backdrop-blur-xl border border-black/20 rounded-2xl shadow-2xl text-center font-semibold text-xl text-black py-12 transition-transform duration-300 hover:scale-[1.03] hover:bg-black hover:text-white hover:text-black"
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {/* Footer */}
      <footer className="w-full mt-12 text-center text-sm text-black p-4 bg-transparent">
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
