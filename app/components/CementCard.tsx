"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

interface Props {
  id: number; // Expecting a numeric id
  project: string;
  contractor: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested?: string;
  quantity: number; // Cement quantity
  unit: string; // Unit for cement (e.g., bags)
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

export default function CementCard(props: Props) {
  const {
    id,
    project,
    contractor,
    category,
    status: initialStatus,
    dateRequested,
    quantity,
    unit,
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

  useEffect(() => {
    // Fetch the state from Supabase to ensure it's up-to-date when the component mounts
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("cement_request")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching cement request:", error);
        return;
      }

      if (data) {
        setLocalState({
          status: data.status,
          sent_to_award: data.sent_to_award,
          sent_to_award_date: data.sent_to_award_date,
          sent_for_approval: data.sent_for_approval,
          sent_for_approval_date: data.sent_for_approval_date,
          approved: data.approved,
          approved_date: data.approved_date,
          sent_to_procurement: data.sent_to_procurement,
          sent_to_procurement_date: data.sent_to_procurement_date,
          delivered: data.delivered,
          delivered_date: data.delivered_date,
        });
      }
    };

    fetchData();
  }, [id]);

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
        .from("cement_request")
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

  const handleDeliveredToggle = async () => {
    const newStatus = "DELIVERED"; // When delivered is clicked, change the status to "DELIVERED"
    const newDeliveredDate = new Date().toISOString();

    const updatedState = {
      ...localState,
      status: newStatus,
      delivered: true,
      delivered_date: newDeliveredDate,
    };
    setLocalState(updatedState);
    onUpdate?.({ status: newStatus, delivered: true, delivered_date: newDeliveredDate });

    setLoading(true);
    try {
      const { error } = await supabase
        .from("cement_request")
        .update({ status: newStatus, delivered: true, delivered_date: newDeliveredDate })
        .eq("id", id);

      if (error) {
        setLocalState(localState);
        onUpdate?.({ status: localState.status, delivered: localState.delivered, delivered_date: localState.delivered_date });
        alert("Update failed: " + error.message);
      }
    } catch (err: any) {
      setLocalState(localState);
      onUpdate?.({ status: localState.status, delivered: localState.delivered, delivered_date: localState.delivered_date });
      alert("Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const wrapper = "relative w-full perspective";
  const inner = `relative w-full min-h-[260px] duration-500 transform preserve-3d ${flipped ? "rotate-y-180" : ""}`;

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
            <p className="text-xs font-semibold text-gray-700 truncate">Project Info</p>
            <span
              className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}
            >
              {localState.status}
            </span>
          </div>

          <div className="text-xs text-gray-700 flex flex-col gap-1 mt-2">
            <p className="truncate">
              <strong>Project:</strong> {project}
            </p>
            <p className="truncate">
              <strong>Contractor:</strong> {contractor}
            </p>
            <p className="truncate">
              <strong>Category:</strong> {category}
            </p>
            <p className="truncate">
              <strong>Quantity:</strong> {quantity} {unit}
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
          <h4 className="text-xs font-semibold mb-2">Workflow</h4>

          {[ 
            { label: "Sent to Award", field: "sent_to_award" },
            { label: "Sent for Approval", field: "sent_for_approval" },
            { label: "Approved", field: "approved" },
            { label: "Sent to procurement", field: "sent_to_procurement" },
            { label: "Delivered", field: "delivered" },
          ].map(({ label, field }) => (
            <Stage
              key={field}
              label={label}
              checked={localState[field as keyof typeof localState] as boolean}
              date={localState[`${field}_date` as keyof typeof localState] as string | null}
              onToggle={() => field === "delivered" ? handleDeliveredToggle() : toggle(field)}
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
    <div className="flex items-center justify-between gap-4 p-1 rounded hover:bg-gray-100">
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!checked}
          onChange={onToggle}
          disabled={!!disabled}
          className="w-4 h-4"
        />
        <span className="text-xs font-medium">{label}</span>
      </div>

      <div className="text-xs text-gray-700">
        {date ? <span>{new Date(date).toLocaleString()}</span> : <span className="text-gray-500">—</span>}
      </div>
    </div>
  );
}
