"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

const zonesMap: Record<string, string[]> = {
  lagos: ["lagos zone 1", "lagos zone 2", "lagos zone 3"],
  abuja: ["abuja zone 1", "abuja zone 2", "abuja zone 3"],
};

export default function StateZonesPage() {
  const params = useParams();
  const state = params.state as string;
  const zones = zonesMap[state] || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF5]">
      {/* MAIN CONTENT */}
      <div className="flex flex-col flex-grow items-center justify-center p-4">
        <h1 className="text-3xl font-bold mb-6 text-black">Please select a zone</h1>
        <div className="flex flex-wrap gap-4 justify-center">
          {zones.map((zone) => (
            <Link
              key={zone}
              href={`/projects/${state}/${zone}`}
              className="bg-gray-200 rounded-lg p-6 text-lg font-semibold text-black hover:bg-black hover:text-white transition-colors w-48 text-center"
            >
              {zone.toUpperCase()}
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
