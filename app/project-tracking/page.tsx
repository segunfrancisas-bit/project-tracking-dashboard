"use client";

import Link from "next/link";

const states = ["Lagos", "Abuja"];

export default function ProjectTrackingHome() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-black text-center">
          Select a State
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 justify-center">
          {states.map((state) => (
            <Link
              key={state}
              href={`/project-tracking/${encodeURIComponent(state)}`}
              className="
                bg-gray-300
                rounded-xl
                w-48 h-48
                flex items-center justify-center
                text-center
                text-black
                font-semibold text-lg
                shadow-lg
                hover:bg-black hover:text-white
                transition-colors duration-300
                cursor-pointer
              "
            >
              {state}
            </Link>
          ))}
        </div>
      </div>

      <footer className="w-full bg-[#FFFDF7] p-4 text-center text-sm text-black">
        © 2025 Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-gray-700 transition"
          style={{ textDecoration: "none" }}
        >
          Iroko🌴
        </a>
      </footer>
    </div>
  );
}
