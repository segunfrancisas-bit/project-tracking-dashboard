"use client";

import { useState } from "react";

export default function HomePage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (passcode === "POTUS101T") {
      window.location.href = "/creator-dashboard?name=Captain";
    } else if (passcode === "TOMICOTS") {
      window.location.href = "/dashboard?name=Queen";
    } else if (passcode === "PETER.CB") {
      window.location.href = "/dashboard?name=QS PETER";  
    } else if (passcode === "IFEANYI.CB") {
      window.location.href = "/dashboard?name=Dr Ifeanyi";
    } else if (passcode === "RICHARD.CB") {
      window.location.href = "/dashboard?name=Dr Richard";
    } else if (passcode === "CURCEL.CB") {
      window.location.href = "/entry?name=CURCEL";
    } else {
      setError("Invalid passcode. Try again!");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen" style={{ backgroundColor: "#FFFCF5" }}>
      <div className="flex flex-col items-center justify-center flex-1">
        <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-black mb-5 text-center whitespace-nowrap pop-out-text">
          Welcome to Vision - Your #1 Project Tracker
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col justify-center gap-4">
          <input
            type="text"
            placeholder="Enter your passkey"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="px-4 py-2 rounded-lg text-black focus:outline-none border border-gray-300"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
          >
            Access
          </button>
        </form>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </div>

      <footer className="bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700">
        © Vision by{" "}
        <a href="https://wa.me/2348140730579" target="_blank" className="hover:text-black transition" style={{ textDecoration: "none" }}>
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
