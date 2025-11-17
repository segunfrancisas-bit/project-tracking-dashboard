"use client";

import { useState, useEffect } from "react";
import PaymentCard, { Status } from "./PaymentCard";

// Type for Milestone data
interface MilestoneItem {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: Status;
  signOff: string;
  presented: string;
}

// Hardcoded initial data
const initialData: MilestoneItem[] = [
  { project: "Orchid 2", contractor: "REALMYTE", amount: 45150, category: "INFRASTRUCTURE", status: "PENDING", signOff: "27-Oct-25", presented: "29-Oct-25" },
  { project: "Orchid 2", contractor: "REALMYTE", amount: 2425850, category: "BUILDING", status: "OVERDUE", signOff: "27-Oct-25", presented: "29-Oct-25" },
  { project: "Orchid 1", contractor: "REALMYTE", amount: 63210, category: "PILING", status: "PAID", signOff: "27-Oct-25", presented: "29-Oct-25" },
];

export default function MilestonePaymentPage() {
  const [data, setData] = useState<MilestoneItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedData = localStorage.getItem("milestoneData");
    const parsed = savedData ? JSON.parse(savedData) : [];
    // Merge new entries at the top
    setData([...parsed, ...initialData]);
  }, []);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.project.toLowerCase().includes(term) ||
      item.contractor.toLowerCase().includes(term) ||
      item.status.toLowerCase().includes(term) ||
      item.amount.toString().includes(term) ||
      item.signOff.toLowerCase().includes(term) ||
      item.presented.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter(x => x.status === "PENDING").length;
  const overdueCount = data.filter(x => x.status === "OVERDUE").length;

  return (
    <div className="relative min-h-screen bg-gray-50 p-6 pb-24">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Milestone Payments</h1>

      {/* Search */}
      <div className="mb-6 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, amount, sign off, or presented date..."
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
                amount={item.amount}
                category={item.category}
                status={item.status}
                signOff={item.signOff}
                presented={item.presented}
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
