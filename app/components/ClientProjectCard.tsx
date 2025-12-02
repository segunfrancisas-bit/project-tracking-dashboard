"use client";

import { useEffect, useState } from "react";
import { FaCube, FaHammer, FaPaperPlane } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";

interface Milestone {
  name: string;
  target?: boolean;
  achieved?: boolean;
  timestamp?: string | number;
}

interface Props {
  project_name: string;
  contractor: string;
  site?: string;
  state?: string;
  category?: string;
  contract_sum?: number;
  amount_paid?: number;
  value_of_work_done?: number;
  cement?: number;
  reinforcement?: Record<string, number | string> | string;
  milestones?: Milestone[];
}

export default function ClientProjectCard({
  project_name,
  contractor,
  site,
  state,
  category = "N/A",
  contract_sum = 0,
  amount_paid = 0,
  value_of_work_done = 0,
  cement = 0,
  reinforcement,
  milestones = [],
}: Props) {

  const [flipped, setFlipped] = useState(false);

  // cement states
  const [showCementDropdown, setShowCementDropdown] = useState(false);
  const [cementRequestValue, setCementRequestValue] = useState("");
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [requestPending, setRequestPending] = useState(false);
  const [requestId, setRequestId] = useState<number | null>(null);
  const [localCement, setLocalCement] = useState<number>(cement || 0);

  // reinforcement states
  const [showRebarDropdown, setShowRebarDropdown] = useState(false);
  const [rebarRequestValues, setRebarRequestValues] = useState<Record<string, string>>({});
  const [localRebar, setLocalRebar] = useState<Record<string, number>>({});
  const [rebarRequestPending, setRebarRequestPending] = useState(false);
  const [rebarRequestId, setRebarRequestId] = useState<number | null>(null);

  // history state
  const [history, setHistory] = useState<{ type: string; qty: string; date: string }[]>([]);

  // parse rebar JSON
  const parsedRebarRaw =
    typeof reinforcement === "string"
      ? (() => { try { return JSON.parse(reinforcement); } catch { return {}; } })()
      : (reinforcement || {});

  const allRebarKeys = ["y10", "y12", "y16", "y20", "y25", "y32"];

  useEffect(() => {
    const init: Record<string, number> = {};
    allRebarKeys.forEach(k => {
      const v = Number(parsedRebarRaw?.[k] ?? 0);
      init[k] = Number((isNaN(v) ? 0 : v).toFixed(2));
    });
    setLocalRebar(init);

    const inputs: Record<string, string> = {};
    allRebarKeys.forEach(k => inputs[k] = "");
    setRebarRequestValues(inputs);
  }, [reinforcement]);

  // milestone helpers
  const totalTarget = milestones.filter((m) => m.target).length || 0;
  const totalAchieved = milestones.filter((m) => m.achieved).length || 0;

  const mostRecentTarget =
    milestones.filter((m) => m.target).sort((a,b)=> new Date(b.timestamp||0).getTime() - new Date(a.timestamp||0).getTime())[0]?.name || "";

  const mostRecentAchieved =
    milestones.filter((m) => m.achieved).sort((a,b)=> new Date(b.timestamp||0).getTime() - new Date(a.timestamp||0).getTime())[0]?.name || "";

  const percent = (value:number) => {
    const raw = (value / (milestones.length || 1)) * 100;
    return raw > 100 ? 100 : raw % 1 === 0 ? raw.toFixed(0) : raw.toFixed(1);
  };

  const ProgressBar = ({ value, color }: { value: number; color: string }) => {
    const p = percent(value);
    return (
      <div className="relative w-full bg-gray-300 rounded-full h-4 overflow-hidden">
        <div className="h-4 rounded-full transition-all" style={{ width: `${p}%`, backgroundColor: color }} />
        <span className="absolute inset-0 flex items-center justify-center text-[10px] text-black font-semibold">{p}%</span>
      </div>
    );
  };

  // status tag
  let tagText = "";
  let tagColor = "";
  if ((value_of_work_done ?? 0) < (amount_paid ?? 0)) {
    tagText = "Exposed"; tagColor = "bg-red-500";
  } else if ((value_of_work_done ?? 0) > (amount_paid ?? 0)) {
    tagText = "Not Exposed"; tagColor = "bg-green-500";
  } else {
    tagText = "Balanced"; tagColor = "bg-gray-500";
  }

  // fetch cement + last pending request
  useEffect(() => {
    const fetchCement = async () => {
      try {
        const { data } = await supabase
          .from("projects")
          .select("cement")
          .eq("project_name", project_name)
          .single();

        if (data?.cement !== undefined && data?.cement !== null) {
          setLocalCement(Number(data.cement));
        }

        const { data: req } = await supabase
          .from("cement_request")
          .select("id, delivered")
          .eq("project", project_name)
          .order("id", { ascending: false })
          .limit(1)
          .single();

        if (req) {
          setRequestPending(!req.delivered);
          setRequestId(req.id ?? null);
        }
      } catch (err) {
        console.error("fetchCement error", err);
      }
    };
    fetchCement();
  }, [project_name, cement]);

  // fetch reinforcement + last pending request
  useEffect(() => {
    const fetchRebar = async () => {
      try {
        const { data } = await supabase
          .from("reinforcement_request")
          .select("id, delivered")
          .eq("project", project_name)
          .order("id", { ascending: false })
          .limit(1)
          .single();

        if (data) {
          setRebarRequestPending(!data.delivered);
          setRebarRequestId(data.id ?? null);
        }
      } catch (err) {
        console.error("fetchRebar error", err);
      }
    };

    fetchRebar();
  }, [project_name]);

  // fetch history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data: cementData } = await supabase
          .from("cement_request")
          .select("bags, dateRequested, delivered")
          .eq("project", project_name)
          .order("dateRequested", { ascending: false });

        const { data: rebarData } = await supabase
          .from("reinforcement_request")
          .select("y10, y12, y16, y20, y25, y32, dateRequested, delivered")
          .eq("project", project_name)
          .order("dateRequested", { ascending: false });

        const combinedHistory: { type: string; qty: string; date: string }[] = [];

        cementData?.forEach(c => {
          if (c.delivered) combinedHistory.push({ type: "Cement", qty: `${c.bags} bags`, date: c.dateRequested });
        });

        rebarData?.forEach(r => {
          if (r.delivered) {
            Object.entries(r).forEach(([key, value]) => {
              if (allRebarKeys.includes(key) && value > 0) {
                combinedHistory.push({ type: "Rebar " + key.toUpperCase(), qty: `${value} tons`, date: r.dateRequested });
              }
            });
          }
        });

        combinedHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        setHistory(combinedHistory);
      } catch (err) {
        console.error("Error fetching history", err);
      }
    };

    fetchHistory();
  }, [project_name]);

  // cement polling
  useEffect(() => {
    if (!requestId) return;

    const i = setInterval(async () => {
      const { data } = await supabase
        .from("cement_request")
        .select("delivered")
        .eq("id", requestId)
        .single();

      if (data?.delivered) {
        setRequestPending(false);
        clearInterval(i);
      }
    }, 3000);

    return () => clearInterval(i);
  }, [requestId]);

  // reinforcement polling
  useEffect(() => {
    if (!rebarRequestId) return;

    const i = setInterval(async () => {
      const { data } = await supabase
        .from("reinforcement_request")
        .select("delivered")
        .eq("id", rebarRequestId)
        .single();

      if (data?.delivered) {
        setRebarRequestPending(false);
        clearInterval(i);
      }
    }, 3000);

    return () => clearInterval(i);
  }, [rebarRequestId]);

  // cement request handler
  const handleCementRequest = async () => {
    if (!cementRequestValue) return alert("Enter number of bags first!");
    const bags = Number(cementRequestValue);
    if (isNaN(bags) || bags <= 0) return alert("Enter a valid number");
    if (bags > localCement) return alert(`Cannot request more than ${localCement} bags`);

    setLoadingRequest(true);
    try {
      const today = new Date().toISOString().split("T")[0];
      const stateToSend = (state ?? site ?? "N/A").toUpperCase();

      const { data } = await supabase.from("cement_request").insert([{
        project: project_name,
        contractor,
        bags,
        category: category.toUpperCase(),
        dateRequested: today,
        state: stateToSend,
        status: "PENDING",
        delivered: false
      }]).select().single();

      const newLocal = Math.max(0, Number((localCement - bags).toFixed(2)));
      setLocalCement(newLocal);
      await supabase.from("projects").update({ cement: newLocal }).eq("project_name", project_name);

      setRequestPending(true);
      setRequestId(data?.id ?? null);

      alert(`Cement request (${bags} bags) submitted.`);
      setCementRequestValue("");
      setShowCementDropdown(false);
    } catch (err:any) {
      alert("Error submitting cement request: " + (err?.message ?? String(err)));
    } finally {
      setLoadingRequest(false);
    }
  };

  // reinforcement request handler
  const handleRebarRequest = async () => {
    const insertPayload: any = {
      project: project_name,
      contractor,
      category: (category ?? "BUILDING").toUpperCase(),
      state: (state ?? site ?? "N/A").toUpperCase(),
      dateRequested: new Date().toISOString().split("T")[0],
      delivered: false,
      status: "PENDING",
    };

    const requested: Record<string, number> = {};
    for (const k of allRebarKeys) {
      const v = Number(rebarRequestValues[k] || 0);
      if (!isNaN(v) && v > 0) {
        requested[k] = Number(v.toFixed(2));
        insertPayload[k] = Number(v.toFixed(2));
      }
    }

    if (Object.keys(requested).length === 0) {
      return alert("Enter at least one reinforcement quantity to request.");
    }

    for (const [k, qty] of Object.entries(requested)) {
      if (qty > localRebar[k]) {
        return alert(`Cannot request more than ${localRebar[k].toFixed(2)} tons of ${k.toUpperCase()}`);
      }
    }

    setLocalRebar(prev => {
      const next = {...prev};
      for (const [k, qty] of Object.entries(requested)) {
        next[k] = Number(Math.max(0, (next[k] ?? 0) - qty).toFixed(2));
      }
      return next;
    });

    try {
      const { data: inserted, error: insertError } = await supabase
        .from("reinforcement_request")
        .insert([insertPayload])
        .select()
        .single();

      if (insertError) throw insertError;

      setRebarRequestPending(true);
      setRebarRequestId(inserted?.id);

      const { data: projRow } = await supabase
        .from("projects")
        .select("reinforcement_given")
        .eq("project_name", project_name)
        .single();

      const currentJSON = typeof projRow?.reinforcement_given === "string"
        ? JSON.parse(projRow.reinforcement_given)
        : (projRow?.reinforcement_given ?? {});

      const updatedJSON: Record<string, number> = {...currentJSON};
      for (const k of allRebarKeys) {
        const cur = Number(currentJSON?.[k] ?? 0);
        const req = Number(requested[k] ?? 0);
        updatedJSON[k] = Number(Math.max(0, cur - req).toFixed(2));
      }

      await supabase
        .from("projects")
        .update({ reinforcement_given: updatedJSON })
        .eq("project_name", project_name);

      const blankInputs: Record<string,string> = {};
      allRebarKeys.forEach(k => blankInputs[k] = "");
      setRebarRequestValues(blankInputs);
      setShowRebarDropdown(false);

      alert("Reinforcement request submitted and project balance updated.");
    } catch (err:any) {
      alert("Error submitting reinforcement request: " + (err?.message ?? String(err)));
    }
  };

  return (
    <div className="relative w-72 h-[580px] perspective">
      <div
        className={`relative w-full h-full transition-transform duration-500 transform ${flipped ? "rotate-y-180" : ""}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* FRONT */}
        <div
          className="absolute inset-0 p-4 flex flex-col justify-between rounded-xl text-white shadow-lg"
          style={{ backfaceVisibility: "hidden", background: "radial-gradient(circle at top right, #555555 5%, #000000 95%)" }}
        >
          <div>
            <h2 className="text-xl font-extrabold mb-1">{project_name}</h2>
            <p className="text-[12px] font-medium">{contractor}</p>
            <p className="text-[11px] font-semibold">{(site ?? "N/A").toUpperCase()} - {(state ?? site ?? "N/A").toUpperCase()}</p>
            <p className="text-[11px] mb-2">{category}</p>
            <p className="text-[12px] font-bold mb-2">Contract Sum: ₦{(contract_sum ?? 0).toLocaleString()}</p>

            <div className="mb-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold">
                <span>Cement:</span>
                <span className="bg-white/20 px-2 py-1 rounded">{localCement.toLocaleString()} bags</span>
              </div>

              <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold flex-nowrap overflow-x-auto">
                <span>Rebar:</span>
                {Object.entries(localRebar)
                  .filter(([_, qty]) => qty > 0)
                  .map(([type, qty]) => (
                    <span key={type} className="bg-white/20 px-2 py-1 rounded text-[10px]">
                      {type.toUpperCase()}: {qty.toFixed(2)} tons
                    </span>
                  ))}
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <p className="text-[11px] font-semibold">Amount Paid</p>
                <div className="border border-white/70 rounded-md p-2 text-[12px] font-bold bg-white/10">
                  ₦{(amount_paid ?? 0).toLocaleString()}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold">Value of Work Done</p>
                <div className="border border-white/70 rounded-md p-2 text-[12px] font-bold bg-white/10">
                  ₦{(value_of_work_done ?? 0).toLocaleString()}
                </div>
              </div>

              <div>
                <p className="text-[10px] mb-1 font-semibold">Target {mostRecentTarget}</p>
                <ProgressBar value={totalTarget} color="#f97316" />
              </div>

              <div>
                <p className="text-[10px] mb-1 font-semibold">Achieved {mostRecentAchieved}</p>
                <ProgressBar value={totalAchieved} color="#16a34a" />
              </div>

              {/* HISTORY SECTION */}
              <div className="mt-3">
                <p className="text-[11px] font-semibold mb-1">Delivery History</p>
                <div className="max-h-[5.5rem] overflow-y-auto border border-white/30 rounded-md p-2 text-[10px] space-y-1">
                  {history.length === 0 ? (
                    <p className="text-white/50">No history yet</p>
                  ) : (
                    history.map((h, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{h.type}</span>
                        <span>{h.qty}</span>
                        <span className="text-white/50">{new Date(h.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>

          <div className={`absolute top-2 right-2 px-2 py-0.5 text-sm rounded-md font-semibold ${tagColor} bg-opacity-80 backdrop-blur-sm border border-white/30`}>
            {tagText}
          </div>

          <button
            className="absolute bottom-2 right-2 text-[12px] px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
            onClick={() => setFlipped(true)}
          >
            Details
          </button>
        </div>

        {/* BACK */}
        <div
          className="absolute inset-0 p-4 rounded-xl text-white shadow-lg rotate-y-180"
          style={{ backfaceVisibility: "hidden", background: "radial-gradient(circle at top right, #333333 5%, #000000 95%)" }}
        >
          <h2 className="text-lg font-bold mb-2">{project_name} - REQUEST</h2>

          {/* Cement Request */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[12px]">Cement Request</span>
              <button
                className="text-[10px] px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                onClick={() => setShowCementDropdown(!showCementDropdown)}
              >
                {showCementDropdown ? "Hide" : "Request"}
              </button>
            </div>
            {showCementDropdown && (
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  placeholder="Bags"
                  value={cementRequestValue}
                  onChange={(e) => setCementRequestValue(e.target.value)}
                  className="p-1 rounded w-16 text-white text-[11px]"
                />
                <button
                  onClick={handleCementRequest}
                  className="bg-green-500 px-2 rounded text-[11px]"
                  disabled={loadingRequest}
                >
                  {loadingRequest ? "Sending..." : "Submit"}
                </button>
              </div>
            )}
            {requestPending && <p className="text-[10px] text-yellow-400 mt-1">Processing...</p>}
          </div>

          {/* Rebar Request */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-[12px]">Reinforcement Request</span>
              <button
                className="text-[10px] px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
                onClick={() => setShowRebarDropdown(!showRebarDropdown)}
              >
                {showRebarDropdown ? "Hide" : "Request"}
              </button>
            </div>
            {showRebarDropdown && (
              <div className="grid grid-cols-3 gap-2 mt-1 text-[10px]">
                {allRebarKeys.map((k) => (
                  <div key={k} className="flex flex-col">
                    <span>{k.toUpperCase()}</span>
                    <input
                      type="number"
                      value={rebarRequestValues[k] ?? ""}
                      onChange={(e) => setRebarRequestValues(prev => ({ ...prev, [k]: e.target.value }))}
                      placeholder="Tons"
                      className="p-1 rounded text-white text-[10px]"
                    />
                  </div>
                ))}
                <button
                  onClick={handleRebarRequest}
                  className="col-span-3 bg-green-500 px-2 py-1 rounded mt-2 text-[11px]"
                >
                  Submit Request
                </button>
              </div>
            )}
            {rebarRequestPending && <p className="text-[10px] text-yellow-400 mt-1">Processing...</p>}
          </div>

          <button
            className="absolute bottom-2 right-2 text-[12px] px-2 py-1 rounded bg-white/20 hover:bg-white/30 transition"
            onClick={() => setFlipped(false)}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
