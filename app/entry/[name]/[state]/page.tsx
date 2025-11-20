"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContractorCategoryPage() {
  const params = useParams() as { name: string; state: string };
  const name = params?.name ?? "CONTRACTOR";
  const state = params?.state ?? "LAGOS";

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7] text-black">
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Select a Category</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          <Link href={`/entry/${name}/${state}/cash-mobilization`} className="block bg-gray-300 py-12 rounded-2xl shadow-lg text-center font-semibold text-xl hover:bg-black hover:text-white transition">
            Cash Mobilization
          </Link>

          <Link href={`/entry/${name}/${state}/milestone-request`} className="block bg-gray-300 py-12 rounded-2xl shadow-lg text-center font-semibold text-xl hover:bg-black hover:text-white transition">
            Milestone Request
          </Link>

          <Link href={`/entry/${name}/${state}/material-request/cement`} className="block bg-gray-300 py-12 rounded-2xl shadow-lg text-center font-semibold text-xl hover:bg-black hover:text-white transition">
            Cement
          </Link>

          <Link href={`/entry/${name}/${state}/material-request/reinforcement`} className="block bg-gray-300 py-12 rounded-2xl shadow-lg text-center font-semibold text-xl hover:bg-black hover:text-white transition">
            Reinforcement
          </Link>
        </div>
      </div>

      <footer className="w-full bg-[#FFFDF7] p-4 text-center text-sm text-gray-700">
        © Vision by <a href="https://wa.me/2348140730579" className="hover:text-black">Iroko🌴</a>
      </footer>
    </div>
  );
}
