"use client";

import React, { useState, useMemo, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import * as XLSX from "xlsx";

type Milestone = {
  name: string;
  amount: string;
  target?: boolean;
  achieved?: boolean;
  achieved_at?: string | null;
  target_date?: string;
};

interface ProjectFormProps {
  state: string;
}

export default function ProjectForm({ state }: ProjectFormProps) {
  const [zone, setZone] = useState("Zone 1");
  const [category, setCategory] = useState("Building");

  const [projectName, setProjectName] = useState("");
  const [contractor, setContractor] = useState("");
  const [site, setSite] = useState("");
  const [contractSum, setContractSum] = useState("");

  const [cashMobilization, setCashMobilization] = useState(""); // NEW FIELD

  const [milestones, setMilestones] = useState<Milestone[]>([
    { name: "", amount: "" },
  ]);

  const [cement, setCement] = useState("");
  const [reinforcement, setReinforcement] = useState<Record<string, string>>({
    y10: "",
    y12: "",
    y16: "",
    y20: "",
    y25: "",
    y32: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const dropRef = useRef<HTMLDivElement>(null);

  // ----------------------------
  // Helpers
  // ----------------------------
  const parseNumber = (v: string) => {
    if (!v) return 0;
    const n = parseFloat(v.replace(/,/g, ""));
    return Number.isFinite(n) ? n : 0;
  };

  const milestoneTotal = useMemo(
    () => milestones.reduce((s, m) => s + parseNumber(m.amount), 0),
    [milestones]
  );

  const cashMobilizationNumber = useMemo(
    () => parseNumber(cashMobilization),
    [cashMobilization]
  );

  const totalIncludingCash = useMemo(
    () => milestoneTotal + cashMobilizationNumber,
    [milestoneTotal, cashMobilizationNumber]
  );

  const contractSumNumber = useMemo(() => parseNumber(contractSum), [
    contractSum,
  ]);

  const updateMilestone = (
    index: number,
    field: "name" | "amount" | "target_date",
    value: string
  ) => {
    const copy = [...milestones];
    copy[index][field] = value;
    setMilestones(copy);
  };

  const addMilestone = () =>
    setMilestones([...milestones, { name: "", amount: "" }]);

  const removeMilestone = (i: number) => {
    const filtered = milestones.filter((_, idx) => idx !== i);
    setMilestones(filtered.length ? filtered : [{ name: "", amount: "" }]);
  };

  const blockScroll = (e: any) => e.target.blur();
  const equal = (a: number, b: number) => Math.abs(a - b) < 0.0001;

  // ----------------------------
  // Excel Upload
  // ----------------------------
  const parseExcelDate = (excelDate: any) => {
    let formattedDate = "";
    if (excelDate) {
      if (typeof excelDate === "number") {
        const date = XLSX.SSF.parse_date_code(excelDate);
        formattedDate = `${date.y.toString().padStart(4, "0")}-${date.m
          .toString()
          .padStart(2, "0")}-${date.d.toString().padStart(2, "0")}`;
      } else if (excelDate instanceof Date) {
        formattedDate = excelDate.toISOString().split("T")[0];
      } else if (typeof excelDate === "string") {
        const d = new Date(excelDate);
        if (!isNaN(d.getTime())) {
          formattedDate = d.toISOString().split("T")[0];
        }
      }
    }
    return formattedDate;
  };

  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    const uploadedMilestones = json.map((row: any) => ({
      name: row.name || "",
      amount: row.amount ? String(row.amount) : "",
      target_date: parseExcelDate(row["target date"] || row["target_date"]),
      target: false,
      achieved: false,
      achieved_at: null,
    }));

    setMilestones(uploadedMilestones);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      const uploadedMilestones = json.map((row: any) => ({
        name: row.name || "",
        amount: row.amount ? String(row.amount) : "",
        target_date: parseExcelDate(row["target date"] || row["target_date"]),
        target: false,
        achieved: false,
        achieved_at: null,
      }));

      setMilestones(uploadedMilestones);
      e.dataTransfer.clearData();
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // ----------------------------
  // Submission
  // ----------------------------
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!projectName || !contractor || !site) {
      setError("Project Name, Contractor and Site are required.");
      return;
    }

    for (let i = 0; i < milestones.length; i++) {
      const m = milestones[i];
      if (!m.name.trim()) {
        setError(`Milestone ${i + 1} must have a name.`);
        return;
      }
      if (!m.amount.trim()) {
        setError(`Milestone ${i + 1} must have an amount.`);
        return;
      }
      if (isNaN(parseFloat(m.amount))) {
        setError(`Milestone ${i + 1} has invalid amount.`);
        return;
      }
    }

    if (!equal(totalIncludingCash, contractSumNumber)) {
      setError("Milestone total + Cash Mobilization MUST match Contract Sum.");
      return;
    }

    const payload = {
      project_name: projectName,
      contractor,
      site,
      state,
      zone,
      category,
      contract_sum: contractSumNumber,
      cement: parseNumber(cement),
      reinforcement_given: {
        y10: parseNumber(reinforcement.y10),
        y12: parseNumber(reinforcement.y12),
        y16: parseNumber(reinforcement.y16),
        y20: parseNumber(reinforcement.y20),
        y25: parseNumber(reinforcement.y25),
        y32: parseNumber(reinforcement.y32),
      },
      amount_paid: 0,
      value_of_work_done: 0,
      cash_mobilization: cashMobilizationNumber, // NEW FIELD
      milestones: milestones.map((m) => ({
        name: m.name,
        amount: parseNumber(m.amount),
        target_date: m.target_date || null,
        target: false,
        achieved: false,
        achieved_at: null,
      })),
      target_total: 0,
      achieved_total: 0,
    };

    const { error: err } = await supabase.from("projects").insert(payload);
    if (err) {
      setError(err.message);
      return;
    }

    setSuccess("Project created successfully!");
    // reset fields
    setProjectName("");
    setContractor("");
    setSite("");
    setContractSum("");
    setCashMobilization(""); // reset
    setMilestones([{ name: "", amount: "" }]);
    setCement("");
    setReinforcement({
      y10: "",
      y12: "",
      y16: "",
      y20: "",
      y25: "",
      y32: "",
    });
  };

  // ----------------------------
  // JSX
  // ----------------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 glass-card max-w-2xl mx-auto"
    >
      <h1 className="text-2xl font-bold mb-4">{state} Project Form</h1>

      {/* Project Name */}
      <label className="block">Project Name</label>
      <input
        className="input"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />

      {/* Contractor */}
      <label className="block mt-3">Contractor</label>
      <input
        className="input"
        value={contractor}
        onChange={(e) => setContractor(e.target.value)}
      />

      {/* Site */}
      <label className="block mt-3">Site</label>
      <input
        className="input"
        value={site}
        onChange={(e) => setSite(e.target.value)}
      />

      {/* Cash Mobilization */}
      <label className="block mt-3">Cash Mobilization (₦)</label>
      <input
        className="input"
        inputMode="decimal"
        value={cashMobilization}
        onWheel={blockScroll}
        onChange={(e) => setCashMobilization(e.target.value)}
      />

      {/* Zone / Category */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div>
          <label>Zone</label>
          <select
            className="input"
            value={zone}
            onChange={(e) => setZone(e.target.value)}
          >
            <option>Zone 1</option>
            <option>Zone 2</option>
            <option>Zone 3</option>
          </select>
        </div>

        <div>
          <label>Category</label>
          <select
            className="input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Building</option>
            <option>Infrastructure</option>
            <option>Piling</option>
          </select>
        </div>
      </div>

      {/* Contract Sum */}
      <label className="block mt-3">Contract Sum (₦)</label>
      <input
        className="input"
        inputMode="decimal"
        value={contractSum}
        onWheel={blockScroll}
        onChange={(e) => setContractSum(e.target.value)}
      />

      {/* Excel Upload / Drag and Drop */}
      <label className="block mt-4 font-semibold">Upload Milestones Excel</label>
      <div
        ref={dropRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-400 p-6 rounded-lg text-center text-gray-500 cursor-pointer hover:border-gray-600 transition mb-4"
      >
        Drag & drop your Excel file here, or click to select
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleExcelUpload}
          className="hidden"
        />
      </div>

      {/* Milestones */}
      <h2 className="text-xl font-semibold mt-5 mb-2">Milestones</h2>
      {milestones.map((m, index) => (
        <div key={index} className="border p-3 rounded-lg mb-3 bg-white/80">
          <p className="font-semibold mb-2">Milestone {index + 1}</p>

          <label>Name</label>
          <input
            className="input"
            value={m.name}
            onChange={(e) => updateMilestone(index, "name", e.target.value)}
          />

          <label className="mt-2 block">Amount (₦)</label>
          <div className="flex gap-2">
            <input
              className="input w-full"
              inputMode="decimal"
              value={m.amount}
              onWheel={blockScroll}
              onChange={(e) =>
                updateMilestone(index, "amount", e.target.value)
              }
            />
            <button
              type="button"
              className="px-3 py-1 bg-red-600 text-white rounded"
              onClick={() => removeMilestone(index)}
            >
              X
            </button>
          </div>

          <label className="mt-2 block">Target Date</label>
          <input
            type="date"
            className="input"
            value={m.target_date || ""}
            onChange={(e) =>
              updateMilestone(index, "target_date", e.target.value)
            }
          />
        </div>
      ))}

      <button
        type="button"
        className="bg-black text-white px-3 py-2 rounded mb-4"
        onClick={addMilestone}
      >
        + Add Milestone
      </button>

      {/* Total */}
      <div className="mt-3 font-semibold">
        Total (Milestones + Cash Mobilization):{" "}
        <span
          style={{
            color: equal(totalIncludingCash, contractSumNumber) ? "green" : "red",
          }}
        >
          ₦{totalIncludingCash.toLocaleString()}
        </span>
      </div>

      {/* Cement */}
      <h2 className="text-xl font-semibold mt-5">Materials</h2>

      <label className="block mt-2">Cement</label>
      <input
        className="input"
        value={cement}
        onWheel={blockScroll}
        onChange={(e) => setCement(e.target.value)}
      />

      {/* Reinforcement */}
      <h3 className="font-semibold mt-3">Reinforcement (tons)</h3>
      <div className="grid grid-cols-2 gap-3">
        {["y10", "y12", "y16", "y20", "y25", "y32"].map((type) => (
          <div key={type}>
            <label>{type.toUpperCase()}</label>
            <input
              className="input"
              inputMode="decimal"
              value={reinforcement[type]}
              onWheel={blockScroll}
              onChange={(e) =>
                setReinforcement((prev) => ({
                  ...prev,
                  [type]: e.target.value,
                }))
              }
            />
          </div>
        ))}
      </div>

      {/* Messages */}
      {error && <p className="text-red-600 mt-4">{error}</p>}
      {success && <p className="text-green-600 mt-4">{success}</p>}

      {/* Submit */}
      <button className="w-full mt-6 bg-black text-white py-3 rounded-lg">
        Submit
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 8px;
          border-radius: 10px;
          border: 1px solid #ccc;
          background: white;
          color: black;
          outline: none;
        }
      `}</style>
    </form>
  );
}
