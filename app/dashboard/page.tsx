"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [name, setName] = useState("User");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryName = params.get("name");
    if (queryName) setName(queryName);
  }, []);

  const goTo = (path: string) => {
    window.location.href = `${path}?name=${name}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">

      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <h1 className="text-4xl font-bold mb-4 text-black text-center">
          Hello {name}
        </h1>
        <p className="text-gray-700 mb-12 text-center">
          Welcome to your dashboard, what can I help you with today?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[ 
            { label: "Project Tracking", path: "/projects" },
            { label: "Payment Tracking", path: "/payments" },
            { label: "Material Request", path: "/materials" },
            { label: "Cost Trend", path: "/cost-trend" },
          ].map((btn) => (
            <button
              key={btn.label}
              onClick={() => goTo(btn.path)}
              className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center text-center text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
            >
              {btn.label}
            </button>
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
