"use client";

import { useRouter, useParams } from "next/navigation";

export default function StateSelectionPage() {
  const { name } = useParams() as { name: string };
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between min-h-screen animate-gradient-xy px-4 py-8" style={{ backgroundSize: "400% 400%" }}>
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <h1 className="text-3xl sm:text-4xl font-semibold text-black text-center drop-shadow-lg">
          Hello {name}, please select a state
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          {["lagos", "abuja"].map((state) => (
            <button
              key={state}
              className="px-12 py-12 bg-white/20 backdrop-blur-xl border border-black/20 rounded-xl text-black text-xl font-bold w-64 transition-all duration-300 hover:bg-black hover:text-white hover:scale-105"
              onClick={() => router.push(`/entry/${name}/${state}`)}
            >
              {state.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full mt-12 text-center text-sm text-black p-4 bg-transparent">
        © 2025 Vision by{" "}
        <a href="https://wa.me/2348140730579" className="font-semibold hover:text-black transition">
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
