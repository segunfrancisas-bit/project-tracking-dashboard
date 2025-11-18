"use client";

import { useRouter, useParams } from "next/navigation";

export default function StateSelectionPage() {
  const { name } = useParams() as { name: string };
  const router = useRouter();

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#FFFCF5]">
      <div className="flex flex-col items-center justify-center flex-1 gap-6">
        <h1 className="text-3xl font-bold text-black text-center">
          Hello {name}, please select a state
        </h1>

        <div className="flex flex-col md:flex-row gap-6">
          <button
            className="px-12 py-12 bg-white shadow-lg rounded-xl text-black text-xl font-bold w-64"
            onClick={() => router.push(`/entry/${name}/lagos`)}
          >
            Lagos
          </button>
          <button
            className="px-12 py-12 bg-white shadow-lg rounded-xl text-black text-xl font-bold w-64"
            onClick={() => router.push(`/entry/${name}/abuja`)}
          >
            Abuja
          </button>
        </div>
      </div>

      <footer className="bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a href="https://wa.me/2348140730579" className="hover:text-black transition">
          Iroko🌴
        </a>
      </footer>
    </div>
  );
}
