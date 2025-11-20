"use client";

import { useState } from "react";

export default function HomePage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contractorPasscodes: Record<string, string> = {
      DUTUM101: "Dutum",
      OAT101: "OAT",
      CURCEL101: "Curcel",
      NETENGIN101: "Netengin",
      TABIS101: "Tabis",
      FASTTRACK101: "Fastrack",
    };

    const normalUsers: Record<string, string> = {
      POTUS101T: "Captain",
      TOMICOTS: "Sweet Queen",
      "PETER.CB": "QS PETER",
      "IFEANYI.CB": "Dr Ifeanyi",
      "RICHARD.CB": "Dr Richard",
    };

    if (contractorPasscodes[passcode]) {
      window.location.href = `/entry/${contractorPasscodes[passcode]}`;
    } else if (normalUsers[passcode]) {
      window.location.href = `/dashboard?name=${normalUsers[passcode]}`;
    } else {
      setError("Access Denied");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen bg-[#FFFCF5] px-4">
      <div className="flex flex-col items-center justify-center flex-1">

        {/* 🔥 WELCOME HEADING */}
        <h1 className="text-2xl sm:text-3xl font-bold text-black mb-8 text-center break-words">
          Welcome to Vision - Your #1 Project Tracker
        </h1>

        {/* 🔥 GLASS CARD */}
        <div className="w-full max-w-md bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-lg">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your passkey"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black focus:outline-none border border-gray-300 bg-white/80"
            />

            <button
              type="submit"
              className="w-full px-4 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition"
            >
              Access
            </button>
          </form>

          {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-[#FFFCF5] p-4 text-center text-sm text-gray-700">
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
