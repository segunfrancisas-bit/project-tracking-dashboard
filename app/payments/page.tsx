"use client";
import { useState } from "react";

export default function PaymentsPage() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const goToCategory = (state: string) => {
    window.location.href = `/payments/${state}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF7]">

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-8 text-black">Please select a state</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {["lagos", "abuja"].map((state) => (
            <button
              key={state}
              onClick={() => goToCategory(state)}
              className="bg-gray-300 rounded-xl w-48 h-48 flex items-center justify-center 
                         text-center text-black font-semibold text-lg 
                         hover:bg-black hover:text-white transition-colors duration-300 shadow-lg"
            >
              {state.toUpperCase()}
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#FFFDF7] p-4 text-center text-sm text-gray-700">
        © 2025 Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black transition"
          style={{ textDecoration: "none" }}
        >
          Iroko🌴
        </a>
      </footer>
    </div>
  );
}
