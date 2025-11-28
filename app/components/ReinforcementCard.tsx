"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

interface Props {
  id: number | string;
  project: string;
  contractor: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested?: string;
  y10?: number;
  y12?: number;
  y16?: number;
  y20?: number;
  y25?: number;
  y32?: number;

  sent_to_award?: boolean;
  sent_to_award_date?: string | null;
  sent_for_approval?: boolean;
  sent_for_approval_date?: string | null;
  approved?: boolean;
  approved_date?: string | null;
  sent_to_procurement?: boolean;
  sent_to_procurement_date?: string | null;
  delivered?: boolean;
  delivered_date?: string | null;

  onUpdate?: (updated: Partial<Props>) => void; // callback to update parent
}

export default function ReinforcementCard(props: Props) {
  const {
    id,
    project,
    contractor,
    category,
    status: initialStatus,
    dateRequested,
    y10 = 0,
    y12 = 0,
    y16 = 0,
    y20 = 0,
    y25 = 0,
    y32 = 0,
    sent_to_award = false,
    sent_to_award_date = null,
    sent_for_approval = false,
    sent_for_approval_date = null,
    approved = false,
    approved_date = null,
    sent_to_procurement = false,
    sent_to_procurement_date = null,
    delivered = false,
    delivered_date = null,
    onUpdate,
  } = props;

  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [localState, setLocalState] = useState({
    status: initialStatus,
    sent_to_award,
    sent_to_award_date,
    sent_for_approval,
    sent_for_approval_date,
    approved,
    approved_date,
    sent_to_procurement,
    sent_to_procurement_date,
    delivered,
    delivered_date,
  });

  const statusStyles =
    localState.status === "PENDING"
      ? "bg-yellow-400 text-black"
      : localState.status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  const toggle = async (
    field: keyof Omit<
      typeof localState,
      | "status"
      | "sent_to_award_date"
      | "sent_for_approval_date"
      | "approved_date"
      | "sent_to_procurement_date"
      | "delivered_date"
    >
  ) => {
    const newVal = !localState[field];
    const dateField = `${field}_date` as keyof typeof localState;
    const newDate = newVal ? new Date().toISOString() : null;

    // Optimistic update
    const updatedState = { ...localState, [field]: newVal, [dateField]: newDate };
    setLocalState(updatedState);

    // Update parent state immediately
    onUpdate?.({ [field]: newVal, [dateField]: newDate });

    setLoading(true);
    try {
      const { error } = await supabase
        .from("reinforcement_request")
        .update({ [field]: newVal, [dateField]: newDate })
        .eq("id", id);

      if (error) {
        // Rollback if error
        setLocalState(localState);
        onUpdate?.({ [field]: localState[field], [dateField]: localState[dateField] });
        alert("Update failed: " + error.message);
      }
    } catch (err: any) {
      setLocalState(localState);
      onUpdate?.({ [field]: localState[field], [dateField]: localState[dateField] });
      alert("Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const wrapper = "relative w-full perspective";
  const inner = `relative w-full min-h-[260px] duration-500 transform preserve-3d ${
    flipped ? "rotate-y-180" : ""
  }`;

  const faceCommon =
    "absolute inset-0 rounded-xl shadow-md p-4 border border-gray-200 overflow-hidden";
  const frontFace = faceCommon + " bg-white";
  const backFace =
    faceCommon +
    " bg-gradient-to-b from-gray-100 to-gray-300 text-black transform rotate-y-180";

  return (
    <div className={wrapper} style={{ perspective: 1000 }}>
      {/* Flip Button at Bottom-Right */}
      <div className="absolute bottom-2 right-2 z-10">
        <button
          onClick={() => setFlipped((s) => !s)}
          className="text-xs bg-gray-900 px-2 py-1 rounded text-white"
        >
          {flipped ? "Front" : "Flip"}
        </button>
      </div>

      <div className={inner} style={{ transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        <div
          className={frontFace}
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Project Info</p>
            <span
              className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}
            >
              {localState.status}
            </span>
          </div>

          <div className="text-sm text-gray-700 flex flex-col gap-1 mt-2">
            <p>
              <strong>Project:</strong> {project}
            </p>
            <p>
              <strong>Contractor:</strong> {contractor}
            </p>
            <p>
              <strong>Category:</strong> {category}
            </p>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-700">
            <p>
              <strong>Y10:</strong> {y10}
            </p>
            <p>
              <strong>Y12:</strong> {y12}
            </p>
            <p>
              <strong>Y16:</strong> {y16}
            </p>
            <p>
              <strong>Y20:</strong> {y20}
            </p>
            <p>
              <strong>Y25:</strong> {y25}
            </p>
            <p>
              <strong>Y32:</strong> {y32}
            </p>
          </div>

          <div className="text-xs text-gray-500 mt-2 text-right">
            {dateRequested && <span>Date Requested: {dateRequested}</span>}
          </div>
        </div>

        {/* BACK */}
        <div
          className={backFace}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <h4 className="text-sm font-semibold mb-2">Workflow</h4>

          {[ 
            { label: "Sent to Award", field: "sent_to_award" },
            { label: "Sent for Approval", field: "sent_for_approval" },
            { label: "Approved", field: "approved" },
            { label: "Sent to Procurement", field: "sent_to_procurement" },
            { label: "Delivered", field: "delivered" },
          ].map(({ label, field }) => (
            <Stage
              key={field}
              label={label}
              checked={localState[field as keyof typeof localState] as boolean}
              date={localState[`${field}_date` as keyof typeof localState] as string | null}
              onToggle={() => toggle(field as any)}
              disabled={loading}
            />
          ))}

          <div className="mt-3 text-xs text-gray-700 italic">
            Click Flip to return to front
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage({
  label,
  checked,
  date,
  onToggle,
  disabled,
}: {
  label: string;
  checked?: boolean;
  date?: string | null;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 p-2 rounded hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={onToggle}
          disabled={!!disabled}
          className="w-4 h-4"
        />
        <span className="text-sm font-medium">{label}</span>
      </div>

      <div className="text-xs text-gray-700">
        {date ? <span>{new Date(date).toLocaleString()}</span> : <span className="text-gray-500">—</span>}
      </div>
    </div>
  );
}
