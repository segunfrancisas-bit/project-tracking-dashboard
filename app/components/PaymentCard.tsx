"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

interface PaymentCardProps {
  id: number | string;
  table: "cement_request" | "cash_mobilization" | "milestone_request";
  workflow?: "reinforcement" | "payment";
  project: string;
  contractor: string;
  amount?: number;
  unit?: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested?: string;
  signOff?: string;
  presented?: string;
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
  sent_to_finance?: boolean;
  sent_to_finance_date?: string | null;
  sent_to_audit?: boolean;
  sent_to_audit_date?: string | null;
  cleared?: boolean;
  cleared_date?: string | null;
  paid?: boolean;
  paid_date?: string | null;
  onUpdate?: (id: number | string, updated: Partial<PaymentCardState>) => void;
}

interface PaymentCardState {
  status: Status;
  sent_to_award: boolean;
  sent_to_award_date: string | null;
  sent_for_approval: boolean;
  sent_for_approval_date: string | null;
  approved: boolean;
  approved_date: string | null;
  sent_to_procurement: boolean;
  sent_to_procurement_date: string | null;
  delivered: boolean;
  delivered_date: string | null;
  sent_to_finance: boolean;
  sent_to_finance_date: string | null;
  sent_to_audit: boolean;
  sent_to_audit_date: string | null;
  cleared: boolean;
  cleared_date: string | null;
  paid: boolean;
  paid_date: string | null;
}

export default function PaymentCard(props: PaymentCardProps) {
  const {
    id,
    table,
    workflow = "payment",
    project,
    contractor,
    amount,
    unit,
    category,
    status: initialStatus,
    dateRequested,
    signOff,
    presented,
    y10 = 0,
    y12 = 0,
    y16 = 0,
    y20 = 0,
    y25 = 0,
    y32 = 0,
    onUpdate,
    ...rest
  } = props;

  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const [local, setLocal] = useState<PaymentCardState>({
    status: initialStatus,
    sent_to_award: rest.sent_to_award ?? false,
    sent_to_award_date: rest.sent_to_award_date ?? null,
    sent_for_approval: rest.sent_for_approval ?? false,
    sent_for_approval_date: rest.sent_for_approval_date ?? null,
    approved: rest.approved ?? false,
    approved_date: rest.approved_date ?? null,
    sent_to_procurement: rest.sent_to_procurement ?? false,
    sent_to_procurement_date: rest.sent_to_procurement_date ?? null,
    delivered: rest.delivered ?? false,
    delivered_date: rest.delivered_date ?? null,
    sent_to_finance: rest.sent_to_finance ?? false,
    sent_to_finance_date: rest.sent_to_finance_date ?? null,
    sent_to_audit: rest.sent_to_audit ?? false,
    sent_to_audit_date: rest.sent_to_audit_date ?? null,
    cleared: rest.cleared ?? false,
    cleared_date: rest.cleared_date ?? null,
    paid: rest.paid ?? false,
    paid_date: rest.paid_date ?? null,
  });

  const statusStyles =
    local.status === "PENDING"
      ? "bg-yellow-400 text-black"
      : local.status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  const toggleField = async (field: keyof PaymentCardState) => {
    const newVal = !local[field] as boolean;
    const dateField = `${field}_date` as keyof PaymentCardState;
    const newDate = newVal ? new Date().toISOString() : null;

    const prev = { ...local };
    const updated = { ...local, [field]: newVal, [dateField]: newDate } as PaymentCardState;
    if (field === "paid" && newVal) updated.status = "PAID";

    setLocal(updated);
    onUpdate?.(id, { [field]: newVal, [dateField]: newDate, ...(field === "paid" && newVal ? { status: "PAID" } : {}) });

    setLoading(true);
    try {
      const payload: Record<string, any> = { [field]: newVal, [dateField]: newDate };
      if (field === "paid" && newVal) payload.status = "PAID";

      const { error } = await supabase.from(table).update(payload).eq("id", id);
      if (error) {
        setLocal(prev);
        onUpdate?.(id, { [field]: prev[field], [dateField]: prev[dateField] });
        alert("Update failed: " + error.message);
      }
    } catch (err: any) {
      setLocal(prev);
      onUpdate?.(id, { [field]: prev[field], [dateField]: prev[dateField] });
      alert("Unexpected error: " + (err?.message ?? String(err)));
    } finally {
      setLoading(false);
    }
  };

  const reinforcementSteps = [
    { label: "Sent to Award", field: "sent_to_award" },
    { label: "Sent for Approval", field: "sent_for_approval" },
    { label: "Approved", field: "approved" },
    { label: "Sent to Procurement", field: "sent_to_procurement" },
    { label: "Delivered", field: "delivered" },
  ];

  const paymentSteps = [
    { label: "Sent to Award", field: "sent_to_award" },
    { label: "Sent for Approval", field: "sent_for_approval" },
    { label: "Approved", field: "approved" },
    { label: "Sent to Finance", field: "sent_to_finance" },
    { label: "Sent to Audit", field: "sent_to_audit" },
    { label: "Cleared", field: "cleared" },
    { label: "Paid", field: "paid" },
  ];

  const steps = workflow === "reinforcement" ? reinforcementSteps : paymentSteps;
  const displayAmount = unit ? `${amount ?? ""} ${unit}` : amount ? `₦${Number(amount).toLocaleString()}` : "";

  const wrapper = "relative w-full";
  const inner = `relative w-full min-h-[280px] duration-500 transform preserve-3d ${flipped ? "rotate-y-180" : ""}`;
  const faceCommon = "absolute inset-0 rounded-xl shadow-md p-4 border border-gray-200 overflow-hidden";
  const frontFace = faceCommon + " bg-white";
  const backFace = faceCommon + " bg-gradient-to-b from-gray-100 to-gray-300 text-black transform rotate-y-180";

  return (
    <div className={wrapper} style={{ perspective: 1000 }}>
      <div className={inner} style={{ transformStyle: "preserve-3d" }}>
        {/* FRONT */}
        <div className={frontFace} style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <div className="flex justify-between items-center">
            <p className="text-sm font-semibold text-gray-700">Project Info</p>
            <span className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}>{local.status}</span>
          </div>

          <div className="text-sm text-gray-700 flex flex-col gap-1 mt-2">
            <p><strong>Project:</strong> {project}</p>
            <p><strong>Contractor:</strong> {contractor}</p>
            <p><strong>Category:</strong> {category}</p>
          </div>

          {workflow === "reinforcement" && (
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-700">
              <p><strong>Y10:</strong> {y10}</p>
              <p><strong>Y12:</strong> {y12}</p>
              <p><strong>Y16:</strong> {y16}</p>
              <p><strong>Y20:</strong> {y20}</p>
              <p><strong>Y25:</strong> {y25}</p>
              <p><strong>Y32:</strong> {y32}</p>
            </div>
          )}

          <p className="text-base font-bold text-gray-900 mt-3">{displayAmount}</p>

          <div className="text-xs text-gray-500 mt-2 text-right">
            {dateRequested && <span>Date Requested: {dateRequested}</span>}
            {signOff && <div>Sign Off: {signOff}</div>}
            {presented && <div>Presented: {presented}</div>}
          </div>

          {/* Flip button bottom-right */}
          <button
            onClick={() => setFlipped((s) => !s)}
            className="absolute bottom-2 right-2 text-xs bg-gray-900 px-2 py-1 rounded text-white"
          >
            {flipped ? "Front" : "Flip"}
          </button>
        </div>

        {/* BACK */}
        <div className={backFace} style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}>
          <h4 className="text-[12px] font-semibold mb-2">Workflow</h4>

          <div className="space-y-1 text-[11px]">
            {steps.map(({ label, field }) => {
              const checked = !!local[field as keyof PaymentCardState];
              const date = local[`${field}_date` as keyof PaymentCardState] || null;
              return (
                <div key={field} className="flex items-center justify-between gap-2 p-1 rounded bg-white/60">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleField(field as keyof PaymentCardState)}
                      disabled={loading}
                      className="w-4 h-4"
                    />
                    <span>{label}</span>
                  </div>
                  <div className="text-[10px] text-gray-700">
                    {date ? <span>{new Date(date).toLocaleString()}</span> : <span className="text-gray-500">—</span>}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-1 text-[10px] text-gray-700 italic">Click Flip to return to front</div>

          {/* Flip button bottom-right */}
          <button
            onClick={() => setFlipped((s) => !s)}
            className="absolute bottom-2 right-2 text-[10px] bg-gray-900 px-2 py-1 rounded text-white"
          >
            {flipped ? "Front" : "Flip"}
          </button>
        </div>
      </div>
    </div>
  );
}
