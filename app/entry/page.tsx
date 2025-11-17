"use client";

import { useState, useEffect } from "react";
import PaymentCard, { Status } from "../payments/[state]/milestone-payment/PaymentCard";

// Types
interface MilestoneItem {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: Status;
  signOff: string;
  presented: string;
}

interface CashMobilizationItem {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: Status;
  dateRequested: string;
}

type Category = "Cash Mobilization" | "Milestone";

export default function EntryPage() {
  const [category, setCategory] = useState<Category | "">("");
  const [formData, setFormData] = useState<any>({});
  const [name, setName] = useState("CURCEL");

  // Get name from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryName = params.get("name");
    if (queryName) setName(queryName);

    // Load last saved form for CURCEL
    const savedCash = localStorage.getItem("cashMobilizationData");
    const savedMilestone = localStorage.getItem("milestoneData");

    if (savedCash) setFormData(JSON.parse(savedCash).slice(-1)[0]); // Load last
    else if (savedMilestone) setFormData(JSON.parse(savedMilestone).slice(-1)[0]);
  }, []);

  // Handle input changes dynamically
  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  // Save to localStorage
  const handleSave = () => {
    if (category === "Cash Mobilization") {
      const saved = localStorage.getItem("cashMobilizationData");
      const newEntry: CashMobilizationItem = {
        project: formData.project || "",
        contractor: formData.contractor || "",
        amount: Number(formData.amount) || 0,
        category: formData.category || "",
        status: formData.status as Status || "PENDING",
        dateRequested: formData.dateRequested || new Date().toISOString().split("T")[0],
      };
      const updated = saved ? [...JSON.parse(saved), newEntry] : [newEntry];
      localStorage.setItem("cashMobilizationData", JSON.stringify(updated));
      alert("Cash Mobilization saved!");
    } else if (category === "Milestone") {
      const saved = localStorage.getItem("milestoneData");
      const newEntry: MilestoneItem = {
        project: formData.project || "",
        contractor: formData.contractor || "",
        amount: Number(formData.amount) || 0,
        category: formData.category || "",
        status: formData.status as Status || "PENDING",
        signOff: formData.signOff || new Date().toISOString().split("T")[0],
        presented: formData.presented || new Date().toISOString().split("T")[0],
      };
      const updated = saved ? [...JSON.parse(saved), newEntry] : [newEntry];
      localStorage.setItem("milestoneData", JSON.stringify(updated));
      alert("Milestone saved!");
    }

    setFormData({});
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col">

      {/* MAIN CONTENT */}
      <div className="flex flex-col items-center flex-1 p-6">

        <h1 className="text-4xl font-bold text-black mb-6 text-center">
          Hello {name}, Add a New Entry
        </h1>
        <p className="text-gray-700 mb-12 text-center">
          Select a category to begin
        </p>

        {/* Category Selection */}
        {!category && (
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 mt-12">
            <button
              className="w-64 h-40 md:w-72 md:h-48 bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-2xl md:text-3xl"
              onClick={() => setCategory("Cash Mobilization")}
            >
              Cash Mobilization
            </button>
            <button
              className="w-64 h-40 md:w-72 md:h-48 bg-green-500 text-white font-bold rounded-xl shadow-lg hover:bg-green-600 transform hover:scale-105 transition-all duration-300 flex items-center justify-center text-2xl md:text-3xl"
              onClick={() => setCategory("Milestone")}
            >
              Milestone Payment
            </button>
          </div>
        )}

        {/* Form */}
        {category && (
          <div className="max-w-md w-full mt-8 bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">{category} Form</h2>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Project"
                value={formData.project || ""}
                onChange={(e) => handleChange("project", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Contractor"
                value={formData.contractor || ""}
                onChange={(e) => handleChange("contractor", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={formData.amount || ""}
                onChange={(e) => handleChange("amount", e.target.value)}
                className="p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category || ""}
                onChange={(e) => handleChange("category", e.target.value)}
                className="p-2 border rounded"
              />
              <select
                value={formData.status || "PENDING"}
                onChange={(e) => handleChange("status", e.target.value)}
                className="p-2 border rounded"
              >
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
                <option value="PAID">PAID</option>
              </select>

              {category === "Cash Mobilization" && (
                <input
                  type="date"
                  placeholder="Date Requested"
                  value={formData.dateRequested || ""}
                  onChange={(e) => handleChange("dateRequested", e.target.value)}
                  className="p-2 border rounded"
                />
              )}

              {category === "Milestone" && (
                <>
                  <input
                    type="date"
                    placeholder="Sign Off"
                    value={formData.signOff || ""}
                    onChange={(e) => handleChange("signOff", e.target.value)}
                    className="p-2 border rounded"
                  />
                  <input
                    type="date"
                    placeholder="Presented"
                    value={formData.presented || ""}
                    onChange={(e) => handleChange("presented", e.target.value)}
                    className="p-2 border rounded"
                  />
                </>
              )}

              <button
                className="mt-4 px-6 py-2 bg-black text-white font-bold rounded-lg hover:bg-gray-800"
                onClick={handleSave}
              >
                Save
              </button>

              <button
                className="mt-2 px-6 py-2 bg-gray-300 text-black font-bold rounded-lg hover:bg-gray-400"
                onClick={() => setCategory("")}
              >
                Back
              </button>
            </div>

            {/* Preview Card */}
            {category === "Cash Mobilization" && Object.keys(formData).length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Preview:</h3>
                <PaymentCard
                  project={formData.project || ""}
                  contractor={formData.contractor || ""}
                  amount={Number(formData.amount) || 0}
                  category={formData.category || ""}
                  status={formData.status || "PENDING"}
                  dateRequested={formData.dateRequested || new Date().toISOString().split("T")[0]}
                />
              </div>
            )}

            {category === "Milestone" && Object.keys(formData).length > 0 && (
              <div className="mt-6">
                <h3 className="font-bold mb-2">Preview:</h3>
                <PaymentCard
                  project={formData.project || ""}
                  contractor={formData.contractor || ""}
                  amount={Number(formData.amount) || 0}
                  category={formData.category || ""}
                  status={formData.status || "PENDING"}
                  signOff={formData.signOff || new Date().toISOString().split("T")[0]}
                  presented={formData.presented || new Date().toISOString().split("T")[0]}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="w-full bg-gray-200 shadow-inner p-4 text-center text-sm text-gray-700 mt-auto">
        © Vision by{" "}
        <a
          href="https://wa.me/2348140730579"
          target="_blank"
          className="hover:text-black transition"
          style={{ textDecoration: "none" }}
        >
          C.Boaz🌴
        </a>
      </footer>
    </div>
  );
}
