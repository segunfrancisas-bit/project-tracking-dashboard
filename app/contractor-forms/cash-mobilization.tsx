"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CashMobilizationForm() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") || "Contractor";
  const state = searchParams.get("state") || "Lagos";

  const [project, setProject] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("cashMobilizationData");
    if (savedData) setData(JSON.parse(savedData));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry = {
      project,
      contractor: name,
      state,
      amount: parseInt(amount),
      category,
      dateRequested: new Date().toLocaleDateString(),
      status: "PENDING",
    };
    const updatedData = [newEntry, ...data];
    localStorage.setItem("cashMobilizationData", JSON.stringify(updatedData));
    setData(updatedData);
    alert("Saved successfully!");
    setProject("");
    setAmount("");
    setCategory("");
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6 text-center">Cash Mobilization Form</h1>

      <form onSubmit={handleSubmit} className="max-w-lg mx-auto flex flex-col gap-4">
        <input
          type="text"
          placeholder="Project Name"
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="p-3 border rounded-lg"
        />
        <button type="submit" className="bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800">
          Submit
        </button>
      </form>

      <div className="mt-8 max-w-lg mx-auto">
        {data.length > 0 && <h2 className="font-semibold mb-2">Recent Entries</h2>}
        {data.map((entry, i) => (
          <div key={i} className="bg-white p-3 rounded-lg shadow mb-2 flex justify-between">
            <div>
              <p><strong>Project:</strong> {entry.project}</p>
              <p><strong>Category:</strong> {entry.category}</p>
              <p><strong>State:</strong> {entry.state}</p>
            </div>
            <p className="font-bold">₦{entry.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
