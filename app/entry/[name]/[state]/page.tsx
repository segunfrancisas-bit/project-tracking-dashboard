"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ContractorCategoryPage() {
  const { name, state } = useParams() as { name: string; state: string };
  const router = useRouter();

  // 🔒 AUTH GUARD — if name or state missing, send back to login
  useEffect(() => {
    if (!name || !state) {
      router.push("/entry"); // redirect back to entry login
    }
  }, [name, state]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFCF5] text-black">
      <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">

        <h1 className="text-3xl font-bold mb-10">
          Welcome {name.toUpperCase()} — {state.toUpperCase()}
        </h1>

        {/* BIG CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">

          <button
            onClick={() => router.push(`/entry/${name}/${state}/cash-mobilization`)}
            className="bg-gray-300 w-full py-10 rounded-2xl text-xl font-semibold shadow-lg hover:bg-black hover:text-white transition-all"
          >
            Cash Mobilization
          </button>

          <button
            onClick={() => router.push(`/entry/${name}/${state}/milestone-request`)}
            className="bg-gray-300 w-full py-10 rounded-2xl text-xl font-semibold shadow-lg hover:bg-black hover:text-white transition-all"
          >
            Milestone Request
          </button>

          <button
            onClick={() => router.push(`/entry/${name}/${state}/material-request`)}
            className="bg-gray-300 w-full py-10 rounded-2xl text-xl font-semibold shadow-lg hover:bg-black hover:text-white transition-all"
          >
            Material Request
          </button>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
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
