"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const zonesMap: Record<string, string[]> = {
  lagos: ["Zone 1", "Zone 2", "Zone 3"],
  abuja: ["Zone 1", "Zone 2", "Zone 3"],
};

export default function StateZonesPage() {
  const params = useParams();
  const stateRaw = params.state as string;

  const stateKey = stateRaw.toLowerCase();
  const zones = zonesMap[stateKey] || [];

  if (!zones.length) {
    return (
      <div className="p-6 text-red-600 text-center text-lg">
        No zones available for this state.
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">
      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-grow items-center justify-center p-4 md:p-6">
        <h1 className="text-2xl md:text-4xl font-extrabold mb-8 text-black text-center">
          Select a Zone
        </h1>

        {/* MOBILE-OPTIMIZED BUTTON LAYOUT */}
        <div className="
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:flex md:flex-row 
          gap-4 
          md:gap-6 
          justify-center 
          w-full 
          max-w-md 
        ">
          {zones.map((zone) => (
            <Link
              key={zone}
              href={`/project-tracking/${stateRaw}/${zone}`}
              className="
                bg-gray-300
                rounded-xl
                w-full 
                h-20 
                md:w-48 md:h-48
                flex items-center justify-center
                text-center
                text-black
                font-semibold 
                text-lg 
                shadow-lg
                hover:bg-black hover:text-white
                transition-colors duration-300
              "
            >
              {zone}
            </Link>
          ))}
        </div>
      </div>

      {/* FOOTER */}
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
