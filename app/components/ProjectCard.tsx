"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

interface ProjectProps {
  id: string;
}

export default function ProjectCard({ id }: ProjectProps) {
  const [project, setProject] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState(false);

  const [inputAmountPaid, setInputAmountPaid] = useState<string>("");
  const [inputValueOfWorkDone, setInputValueOfWorkDone] = useState<string>("");

  const [amountPaidFront, setAmountPaidFront] = useState<number>(0);
  const [valueOfWorkDoneFront, setValueOfWorkDoneFront] = useState<number>(0);
  const [cementFront, setCementFront] = useState<number>(0);

  const [reinforcementFront, setReinforcementFront] = useState<Record<string, number>>({});
  const reinforcementCols = ["y10", "y12", "y16", "y20", "y25", "y32"];

  /** LOAD PROJECT */
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

      if (!error && data) {
        setProject(data);

        setAmountPaidFront(Number(data.amount_paid || 0));
        setValueOfWorkDoneFront(Number(data.value_of_work_done || 0));
        setCementFront(Number(data.cement || 0));

        /** Load reinforcement from JSONB correctly */
        const reinforcementData: Record<string, number> = {};
        const raw = data.reinforcement_given || {};

        reinforcementCols.forEach((col) => {
          reinforcementData[col] = Number(raw[col] || 0);
        });

        setReinforcementFront(reinforcementData);
      }

      setLoading(false);
    };

    fetchProject();
  }, [id]);

  if (loading)
    return (
      <div className="p-4 bg-white rounded-lg shadow text-center text-sm">
        Loading...
      </div>
    );

  if (!project)
    return (
      <div className="p-4 bg-white rounded-lg shadow text-center text-sm">
        Project not found
      </div>
    );

  const totalTarget = project.milestones?.filter((m: any) => m.target).length || 0;
  const totalAchieved = project.milestones?.filter((m: any) => m.achieved).length || 0;

  const contractSum = Number(project.contract_sum) || 1;

  const mostRecentTarget =
    project.milestones
      ?.filter((m: any) => m.target)
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime()
      )[0]?.name || "";

  const mostRecentAchieved =
    project.milestones
      ?.filter((m: any) => m.achieved)
      .sort(
        (a: any, b: any) =>
          new Date(b.timestamp || 0).getTime() -
          new Date(a.timestamp || 0).getTime()
      )[0]?.name || "";

  const percent = (value: number) => {
    const raw = (value / project.milestones.length) * 100;
    return raw > 100 ? 100 : raw % 1 === 0 ? raw.toFixed(0) : raw.toFixed(1);
  };

  const ProgressBar = ({ value, color }: { value: number; color: string }) => {
    const p = percent(value);
    return (
      <div className="relative w-full bg-gray-300 rounded-full h-4 overflow-hidden">
        <div
          className="h-4 rounded-full transition-all"
          style={{ width: `${p}%`, backgroundColor: color }}
        ></div>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black font-semibold">
          {p}%
        </span>
      </div>
    );
  };

  /** VALUE UPDATES */
  const handleRunAmountPaid = async () => {
    const amt = Number(inputAmountPaid || 0);

    if (amountPaidFront + amt > contractSum) {
      alert("Contract sum exceeded");
      return;
    }

    const newValue = amountPaidFront + amt;
    setAmountPaidFront(newValue);
    setInputAmountPaid("");

    await supabase
      .from("projects")
      .update({ amount_paid: newValue })
      .eq("id", id);
  };

  const handleRunValueOfWorkDone = async () => {
    const val = Number(inputValueOfWorkDone || 0);

    if (valueOfWorkDoneFront + val > contractSum) {
      alert("Contract sum exceeded");
      return;
    }

    const newValue = valueOfWorkDoneFront + val;
    setValueOfWorkDoneFront(newValue);
    setInputValueOfWorkDone("");

    await supabase
      .from("projects")
      .update({ value_of_work_done: newValue })
      .eq("id", id);
  };

  const handleToggleMilestone = async (
    index: number,
    field: "target" | "achieved"
  ) => {
    const updated = [...project.milestones];
    updated[index][field] = !updated[index][field];

    if (updated[index][field]) {
      updated[index].timestamp = new Date().toISOString();
    }

    setProject({ ...project, milestones: updated });

    await supabase
      .from("projects")
      .update({ milestones: updated })
      .eq("id", id);
  };

  /** STATUS BADGE */
  let tagText = "";
  let tagColor = "";

  if (valueOfWorkDoneFront < amountPaidFront) {
    tagText = "Exposed";
    tagColor = "bg-red-500";
  } else if (valueOfWorkDoneFront > amountPaidFront) {
    tagText = "Not Exposed";
    tagColor = "bg-green-500";
  } else {
    tagText = "Balanced";
    tagColor = "bg-gray-500";
  }

  return (
    <div
      className="relative rounded-xl shadow-lg transition-transform duration-500 w-full"
      style={{
        height: "460px",
        transformStyle: "preserve-3d",
        transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
    >
      {/* FRONT */}
      <div
        className="absolute inset-0 p-4 flex flex-col justify-between rounded-xl text-white"
        style={{
          backfaceVisibility: "hidden",
          background:
            "radial-gradient(circle at top right, #555555 5%, #000000 95%)",
        }}
      >
        <div>
          <h2 className="text-xl font-extrabold mb-1">
            {project.project_name}
          </h2>

          <p className="text-[12px] font-medium">{project.contractor}</p>

          {/* SITE / STATE */}
          <p className="text-[11px]">
            {decodeURIComponent(project.zone)} / {project.site} -{" "}
            {project.state?.toUpperCase()}
          </p>

          <p className="text-[11px] mb-2">{project.category}</p>

          <p className="text-[12px] font-bold mb-2">
            Contract Sum: ₦{contractSum.toLocaleString()}
          </p>

          {/* Cement & Reinforcement ON FRONT ONLY */}
          <div className="mb-3">
            <div className="flex items-center gap-2 text-[12px] font-semibold">
              <span>Cement:</span>
              <span className="bg-white/20 px-2 py-1 rounded">
                {cementFront.toLocaleString()} bags
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold overflow-x-auto flex-nowrap">
              <span>Reinforcement:</span>

              {Object.entries(reinforcementFront).map(([type, qty]) => (
                <span
                  key={type}
                  className="bg-white/20 px-2 py-1 rounded text-[10px]"
                >
                  {type.toUpperCase()}: {qty.toFixed(2)}
                </span>
              ))}
            </div>
          </div>

          {/* Status */}
          <div
            className={`absolute top-2 right-2 px-2 py-0.5 text-sm rounded-md font-semibold ${tagColor} bg-opacity-80 backdrop-blur-sm border border-white/20`}
          >
            {tagText}
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-[10px] mb-1 font-semibold">
                Target {mostRecentTarget}
              </p>
              <ProgressBar value={totalTarget} color="#f97316" />
            </div>

            <div>
              <p className="text-[10px] mb-1 font-semibold">
                Achieved {mostRecentAchieved}
              </p>
              <ProgressBar value={totalAchieved} color="#16a34a" />
            </div>

            <div>
              <p className="text-[11px] font-semibold">Amount Paid</p>
              <div className="border border-white/70 rounded-md p-2 text-[12px] font-bold bg-white/10">
                ₦{amountPaidFront.toLocaleString()}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-semibold">Value of Work Done</p>
              <div className="border border-white/70 rounded-md p-2 text-[12px] font-bold bg-white/10">
                ₦{valueOfWorkDoneFront.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setFlipped(true)}
          className="absolute bottom-4 right-3 px-2 py-0.5 bg-white/10 border border-white/30 backdrop-blur-sm text-white rounded-md text-xs font-semibold hover:bg-white/20 transition-all"
        >
          Flip
        </button>
      </div>

      {/* BACK — CLEAN VERSION (NO MATERIALS) */}
      <div
        className="absolute inset-0 p-3 rounded-xl overflow-y-auto"
        style={{
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "white",
        }}
      >
        <h2 className="text-lg font-bold mb-2">Milestones</h2>

        {project.milestones?.length === 0 && (
          <p className="text-sm">No milestones added yet.</p>
        )}

        <div className="mb-3 space-y-1 text-[11px]">
          {project.milestones?.map((m: any, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-[90px] bg-white/20 rounded px-1 py-0.5 text-[10px] truncate">
                {m.name}
              </div>

              <input
                type="checkbox"
                checked={m.target}
                onChange={() => handleToggleMilestone(index, "target")}
              />

              <input
                type="checkbox"
                checked={m.achieved}
                onChange={() => handleToggleMilestone(index, "achieved")}
              />

              <span className="text-[10px] ml-1">
                {m.timestamp ? new Date(m.timestamp).toLocaleString() : ""}
              </span>
            </div>
          ))}
        </div>

        {/* ONLY MONEY INPUTS REMAIN */}
        <div className="space-y-2 flex flex-col items-start text-[11px] mt-3">
          <div className="flex justify-between w-full items-center">
            <input
              type="text"
              inputMode="numeric"
              value={inputAmountPaid}
              onChange={(e) => setInputAmountPaid(e.target.value)}
              placeholder="Amount Paid"
              className="w-[180px] p-1 text-black border border-black rounded-md"
            />

            <button
              onClick={handleRunAmountPaid}
              className="px-2 py-1 bg-black text-white text-[10px] rounded-md hover:bg-gray-700"
            >
              Run
            </button>
          </div>

          <div className="flex justify-between w-full items-center">
            <input
              type="text"
              inputMode="numeric"
              value={inputValueOfWorkDone}
              onChange={(e) => setInputValueOfWorkDone(e.target.value)}
              placeholder="Value of Work Done"
              className="w-[180px] p-1 text-black border border-black rounded-md"
            />

            <button
              onClick={handleRunValueOfWorkDone}
              className="px-2 py-1 bg-black text-white text-[10px] rounded-md hover:bg-gray-700"
            >
              Run
            </button>
          </div>
        </div>

        <button
          onClick={() => setFlipped(false)}
          className="absolute bottom-2 right-2 px-2 py-1 bg-black text-white text-[10px] rounded-md hover:bg-gray-700"
        >
          Flip Back
        </button>
      </div>
    </div>
  );
}
