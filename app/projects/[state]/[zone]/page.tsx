"use client";

import { useRouter, useParams } from "next/navigation";

export default function ZoneCategoriesPage() {
  const router = useRouter();
  const params = useParams();

  const state = params.state;
  const zone = params.zone;

  const categories = [
    { name: "Building", slug: "building" },
    { name: "Infrastructure", slug: "infrastructure" },
    { name: "Piling", slug: "piling" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col">

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <h1 className="text-3xl font-bold text-black mb-8 text-center uppercase">
          Select a Category
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="bg-gray-200 p-6 rounded-xl text-black 
                         hover:bg-black hover:text-white cursor-pointer 
                         flex items-center justify-center font-semibold transition"
              onClick={() =>
                router.push(`/projects/${state}/${zone}/${category.slug}`)
              }
            >
              {category.name}
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
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
