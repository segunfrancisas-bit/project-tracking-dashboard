"use client";

import { useState, useEffect } from "react";
import PaymentCard from "../../../components/PaymentCard"; // reuse the same card if structure is similar
import { Status } from "@/lib/types"; // import Status from types.ts

// Define type for reinforcement data
interface ReinforcementItem {
  project: string;
  contractor: string;
  tons: number; // replace amount with tons
  category: string;
  status: Status;
  dateRequested: string;
}

// Example hardcoded data
const initialData: ReinforcementItem[] = [
  { project: "Orchid 2", contractor: "REALMYTE", tons: 10, category: "INFRASTRUCTURE", status: "PENDING", dateRequested: "27-Oct-25" },
  { project: "Orchid 2", contractor: "REALMYTE", tons: 200, category: "BUILDING", status: "OVERDUE", dateRequested: "28-Oct-25" },
  { project: "Orchid 1", contractor: "REALMYTE", tons: 15, category: "PILING", status: "DELIVERED", dateRequested: "29-Oct-25" },
  { project: "Orchid 1", contractor: "REALMYTE", tons: 35, category: "INFRASTRUCTURE", status: "DELIVERED", dateRequested: "30-Oct-25" },
  { project: "Orchid 1", contractor: "REALMYTE", tons: 70, category: "BUILDING", status: "DELIVERED", dateRequested: "31-Oct-25" },
];

export default function ReinforcementPage() {
  const [data, setData] = useState<ReinforcementItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("reinforcementData");
    const parsed = savedData ? JSON.parse(savedData) : [];
    setData([...parsed, ...initialData]);
  }, []);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.project.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.tons.toString().includes(term) ||
      item.dateRequested.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter(x => x.status === "PENDING").length;
  const overdueCount = data.filter(x => x.status === "OVERDUE").length;

  return (
    <div className="relative min-h-screen bg-gray-50 p-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Reinforcement</h1>

      {/* Search */}
      <div className="mb-6 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, tons, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-lg p-3 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <main>
        {filteredData.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredData.map((item, index) => (
              <PaymentCard
                key={index}
                project={item.project}
                contractor={item.contractor}
                amount={item.tons} // showing tons instead of money
                category={item.category}
                status={item.status} // PENDING / OVERDUE / DELIVERED
                dateRequested={item.dateRequested}
                unit="Tons" // optional: pass unit to PaymentCard for display
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-10">No results found.</p>
        )}
      </main>

      {/* Summary */}
      <div className="fixed bottom-24 right-6 bg-gray-200 text-gray-800 p-3 rounded-lg shadow-lg text-sm">
        <p><strong>Pending:</strong> {pendingCount}</p>
        <p><strong>Overdue:</strong> {overdueCount}</p>
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-gray-200 p-4 text-center text-gray-700 text-sm shadow-inner z-50">
        © Vision by <a href="https://wa.me/2348140730579" className="hover:text-black">C.Boaz🌴</a>
      </footer>
    </div>
  );
}
