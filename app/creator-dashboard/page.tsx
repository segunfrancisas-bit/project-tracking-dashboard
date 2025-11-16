"use client";

import { useEffect, useState } from "react";

export default function CreatorDashboard() {
  const [name, setName] = useState("Creator");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryName = params.get("name");
    if (queryName) setName(queryName);
  }, []);

  const goTo = (path: string) => {
    window.location.href = path;
  };

  const dashboardButtonClasses =
    "bg-gray-300 rounded-xl min-w-56 h-56 flex items-center justify-center text-center text-black font-semibold text-lg " +
    "hover:bg-yellow-600 hover:text-white transition-colors duration-300 shadow-xl";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h1 className="text-4xl font-bold text-black mb-10">
        Welcome {name}
      </h1>

      {/* HORIZONTAL WRAPPER */}
      <div className="flex gap-6 overflow-x-auto px-6 pb-4">
        
        <button onClick={() => goTo("/projects?admin=true")} className={dashboardButtonClasses}>
          Project Tracking
        </button>

        <button onClick={() => goTo("/payments?admin=true")} className={dashboardButtonClasses}>
          Payment Tracking
        </button>

        <button onClick={() => goTo("/materials?admin=true")} className={dashboardButtonClasses}>
          Material Request
        </button>

        <button onClick={() => goTo("/cost-trend?admin=true")} className={dashboardButtonClasses}>
          Cost Trend
        </button>

      </div>
    </div>
  );
}
