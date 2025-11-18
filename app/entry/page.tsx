// app/entry/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";

export default function ContractorEntryPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Contractor";
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 p-6">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-bold text-black text-center">Hello, {name}</h1>
        <p className="text-lg text-black/80 mb-6">Please select a state</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
          <button
            className="p-12 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 font-bold text-2xl text-black"
            onClick={() => router.push(`/entry/${name}/lagos`)}
          >
            LAGOS
          </button>
          <button
            className="p-12 bg-white rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 font-bold text-2xl text-black"
            onClick={() => router.push(`/entry/${name}/abuja`)}
          >
            ABUJA
          </button>
        </div>
      </div>

      <footer className="bg-gray-200 p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a href="https://wa.me/2348140730579" className="hover:text-black">
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
