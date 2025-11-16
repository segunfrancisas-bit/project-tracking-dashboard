"use client";
import Link from "next/link";

const states = ["lagos", "abuja"];

export default function ProjectsHomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF5]">
      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6 text-black">
          Please select a state
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {states.map((state) => (
            <Link
              key={state}
              href={`/projects/${state}`}
              className="bg-gray-200 rounded-lg p-6 text-xl font-semibold text-black hover:bg-black hover:text-white transition-colors w-40 text-center"
            >
              {state.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-200 text-center py-3 text-black text-sm">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-black hover:text-gray-700 no-underline"
        >
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
