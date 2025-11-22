"use client";

import { useState } from "react";

export default function HomePage() {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [entering, setEntering] = useState(false);

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

    let url = "";

    if (contractorPasscodes[passcode]) {
      url = `/entry/${contractorPasscodes[passcode]}`;
    } else if (normalUsers[passcode]) {
      url = `/dashboard?name=${normalUsers[passcode]}`;
    }

    if (url) {
      setEntering(true);
      setTimeout(() => (window.location.href = url), 1800);
    } else {
      setError("Access Denied");
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between min-h-screen items-center px-4 text-black animate-gradient-xy ${
        entering ? "screen-fade-out" : ""
      }`}
      style={{ backgroundSize: "500% 500%" }}
    >
      {/* VISION reveal smaller + sleeker */}
      {entering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-black animate-vision-reveal tracking-tight">
            VISION
          </h1>
        </div>
      )}

      <div className="flex flex-col items-center justify-center flex-1 w-full max-w-md content-wrapper">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-8 text-center whitespace-nowrap drop-shadow-lg animate-pulse-slow">
          Welcome to Vision - Your #1 Project Tracker
        </h1>

        <div className="w-full bg-white/30 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-black/10 transition-all duration-500">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Enter your passkey"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-black bg-white/40 placeholder-black/60 focus:outline-none border border-black/20 transition-all duration-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-black hover:bg-gray-900 text-white font-bold rounded-lg transition"
            >
              Access
            </button>
          </form>
          {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        </div>
      </div>

      <footer className="w-full p-4 text-center text-sm text-black/80 bg-transparent drop-shadow-md content-wrapper">
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

      <style jsx>{`
        /* STRONG, OBVIOUS GRADIENT with new colors: ORANGE → CREAM → GRAY → YELLOW → GRAY */
        .animate-gradient-xy {
          background: linear-gradient(
            -45deg,
            #ffb27a,
            #ffe9c7,
            #d6d6d6,
            #fff48a,
            #bfbfbf,
            #ffe4b3,
            #e0dfdf
          );
          animation: gradient-xy 12s ease-in-out infinite;
        }

        @keyframes gradient-xy {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.85;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2.5s ease-in-out infinite;
        }

        .screen-fade-out .content-wrapper {
          animation: fadeOutContent 0.8s forwards ease-in;
        }
        @keyframes fadeOutContent {
          from {
            opacity: 1;
            transform: scale(1);
          }
          to {
            opacity: 0;
            transform: scale(0.9);
          }
        }

        /* VISION reveal smaller, sleeker, tighter spacing */
        @keyframes visionAppear {
          0% {
            opacity: 0;
            transform: scale(0.65);
            letter-spacing: -2px;
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
            text-shadow: 0 0 12px rgba(255, 255, 255, 0.6);
          }
          100% {
            opacity: 1;
            transform: scale(1);
            letter-spacing: 0px;
          }
        }
        .animate-vision-reveal {
          animation: visionAppear 1.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
