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
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col">

      <div className="flex flex-col items-center justify-center flex-1 p-6">
        <h1 className="text-4xl font-bold text-black mb-8">Hello {name}</h1>
        <p className="text-gray-700 mb-12">
          Welcome to your dashboard, what can I help you with today?
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          <button
            onClick={() => goTo("/projects")}
            className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center text-center text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
          >
            Project Tracking
          </button>

          <button
            onClick={() => goTo("/payments")}
            className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center text-center text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
          >
            Payment Tracking
          </button>

          <button
            onClick={() => goTo("/materials")}
            className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center text-center text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
          >
            Material Request
          </button>

          <button
            onClick={() => goTo("/cost-trend")}
            className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center text-center text-black font-semibold text-lg hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
          >
            Cost Trend
          </button>

        </div>
      </div>

      <footer className="w-full bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a href="https://wa.me/2348140730579" target="_blank" className="hover:text-black transition">
          C.Boaz🌴
        </a>
      </footer>

    </div>
  );
}
