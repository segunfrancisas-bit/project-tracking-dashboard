"use client";

import { useParams } from "next/navigation";

export default function MaterialsCategoryPage() {
  const params = useParams();
  const { state } = params as { state: string };

  const goTo = (category: string) => {
    window.location.href = `/materials/${state}/${category}`;
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FFFDF7] text-black">

      {/* Main Center Content */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <h1 className="text-3xl font-bold mb-10 text-black text-center">
          PLEASE SELECT A CATEGORY
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* REINFORCEMENT */}
          <button
            onClick={() => goTo("reinforcement")}
            className="w-64 h-40 bg-gray-300 rounded-2xl flex flex-col items-center justify-center 
                       font-semibold text-xl text-black shadow-lg transition-all duration-300
                       hover:bg-black hover:text-white"
          >
            Reinforcement
            <span className="text-sm mt-2 opacity-80">₦1,100,000 per Ton</span>
          </button>

          {/* CEMENT */}
          <button
            onClick={() => goTo("cement")}
            className="w-64 h-40 bg-gray-300 rounded-2xl flex flex-col items-center justify-center
                       font-semibold text-xl text-black shadow-lg transition-all duration-300
                       hover:bg-black hover:text-white"
          >
            Cement
            <span className="text-sm mt-2 opacity-80">₦9,000 per Bag</span>
          </button>

        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-[#FFFDF7] p-4 text-center text-sm text-gray-700">
        © 2025 Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="hover:text-black transition"
          style={{ textDecoration: "none" }}
        >
          Iroko🌴
        </a>
      </footer>
    </div>
  );
}
