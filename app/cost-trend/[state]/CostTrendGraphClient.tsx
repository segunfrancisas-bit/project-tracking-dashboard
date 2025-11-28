"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

interface CostTrendItem {
  commodity: string;
  week41: number;
  week42: number;
  week43: number;
  week44: number;
}

interface Props {
  state: string;
}

// Sample data for Lagos / Abuja
const lagosData: CostTrendItem[] = [
  { commodity: "Cement (Dangote)", week41: 9000, week42: 9900, week43: 9900, week44: 9900 },
  { commodity: "Reinforcement (Hitech/Landcraft - TMT)", week41: 1200000, week42: 1160000, week43: 1160000, week44: 1160000 },
  { commodity: "Marine Board (18mm thick)", week41: 56000, week42: 39000, week43: 39000, week44: 39000 },
  { commodity: "Roofing Sheet (0.55mm)", week41: 9500, week42: 8100, week43: 8100, week44: 8100 },
  { commodity: "Roofing Sheet (0.70mm)", week41: 14000, week42: 12800, week43: 12800, week44: 12800 },
  { commodity: "Blocks 6 inches (150mm)", week41: 900, week42: 700, week43: 700, week44: 700 },
  { commodity: "Blocks 9 inches (225mm)", week41: 1200, week42: 800, week43: 800, week44: 800 },
  { commodity: "Sharp Sand (30tons)", week41: 270000, week42: 250000, week43: 250000, week44: 250000 },
  { commodity: "Granite (30tons)", week41: 700000, week42: 650000, week43: 650000, week44: 650000 },
];

const abujaData: CostTrendItem[] = [
  { commodity: "Cement (Dangote)", week41: 9800, week42: 9800, week43: 9800, week44: 9800 },
  { commodity: "Reinforcement (Hitech/Landcraft - TMT)", week41: 1100000, week42: 1100000, week43: 1100000, week44: 1100000 },
  { commodity: "Marine Board (18mm thick)", week41: 39000, week42: 39000, week43: 39000, week44: 39000 },
  { commodity: "Roofing Sheet (0.55mm) Regular", week41: 7800, week42: 7800, week43: 7800, week44: 7800 },
  { commodity: "Roofing Sheet (0.55mm) Full Gauge", week41: 11200, week42: 11200, week43: 11200, week44: 11200 },
  { commodity: "Roofing Sheet (0.70mm)", week41: 15200, week42: 15200, week43: 15200, week44: 15200 },
  { commodity: "Blocks 6 inches (150mm)", week41: 650, week42: 650, week43: 650, week44: 650 },
  { commodity: "Blocks 9 inches (225mm)", week41: 750, week42: 750, week43: 750, week44: 750 },
  { commodity: "Sharp Sand (30tons)", week41: 300000, week42: 300000, week43: 300000, week44: 300000 },
  { commodity: "Granite (30tons)", week41: 390000, week42: 390000, week43: 390000, week44: 390000 },
];

export default function CostTrendGraphClient({ state }: Props) {
  const lowerState = state.toLowerCase();
  const data = lowerState === "lagos" ? lagosData : abujaData;

  const [showWeek, setShowWeek] = useState({
    week41: true,
    week42: true,
    week43: true,
    week44: true,
  });

  const toggleWeek = (week: keyof typeof showWeek) => {
    setShowWeek((prev) => ({ ...prev, [week]: !prev[week] }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-200 text-black p-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center mb-6 text-black">
        COST TREND - {state.toUpperCase()}
      </h1>

      {/* Week Toggles */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {Object.keys(showWeek).map((week) => (
          <button
            key={week}
            onClick={() => toggleWeek(week as keyof typeof showWeek)}
            className={`px-4 py-2 rounded-full font-semibold shadow ${
              showWeek[week as keyof typeof showWeek]
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700"
            } transition-colors duration-200`}
          >
            {week.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Chart Card */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-4">
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="5 5" />
            <XAxis dataKey="commodity" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            {showWeek.week41 && <Line type="monotone" dataKey="week41" stroke="#8884d8" />}
            {showWeek.week42 && <Line type="monotone" dataKey="week42" stroke="#82ca9d" />}
            {showWeek.week43 && <Line type="monotone" dataKey="week43" stroke="#ffc658" />}
            {showWeek.week44 && <Line type="monotone" dataKey="week44" stroke="#ff7300" />}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer */}
      <footer className="mt-2 bg-gray-200 p-4 text-center text-sm text-gray-700 shadow-inner">
        © 2025 Vision by{" "}
        <a href="https://wa.me/2348140730579" className="hover:text-black">
          Iroko🌴
        </a>
      </footer>
    </div>
  );
}
