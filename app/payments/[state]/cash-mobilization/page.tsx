"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import PaymentCard, { Status } from "@/app/components/PaymentCard";

interface CashMobilizationItem {
  id: number | string;
  project: string;
  contractor: string;
  amount: number;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  state: string;
  dateRequested: string;
  sent_to_award?: boolean;
  sent_to_award_date?: string | null;
  sent_for_approval?: boolean;
  sent_for_approval_date?: string | null;
  approved?: boolean;
  approved_date?: string | null;
  sent_to_finance?: boolean;
  sent_to_finance_date?: string | null;
  sent_to_audit?: boolean;
  sent_to_audit_date?: string | null;
  cleared?: boolean;
  cleared_date?: string | null;
  paid?: boolean;
  paid_date?: string | null;
}

export default function CashMobilizationPage() {
  const params = useParams();
  const rawState = params?.state;
  const state = Array.isArray(rawState) ? rawState[0].toUpperCase() : (rawState || "").toUpperCase();

  const [data, setData] = useState<CashMobilizationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!state) return;

      const { data, error } = await supabase
        .from("cash_mobilization")
        .select("*")
        .eq("state", state);

      if (!error && data) setData(data as CashMobilizationItem[]);
      setLoading(false);
    };

    fetchData();
  }, [state]);

  const filteredData = data.filter((item) => {
    const term = searchTerm.toLowerCase();
    return (
      item.project?.toLowerCase().includes(term) ||
      item.contractor?.toLowerCase().includes(term) ||
      (item.status ?? "").toLowerCase().includes(term) ||
      item.amount?.toString().includes(term) ||
      item.dateRequested?.toLowerCase().includes(term)
    );
  });

  const pendingCount = data.filter(x => x.status === "PENDING").length;
  const overdueCount = data.filter(x => x.status === "OVERDUE").length;
  const paidCount = data.filter(x => x.paid === true).length;  // Counting "paid" status

  // Callback to update local data when PaymentCard saves
  const handleUpdate = (id: number | string, updated: Record<string, any>) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  return (
    <div className="relative min-h-screen bg-[#FFFDF7] p-4 pb-16">
      <h1 className="text-xl font-semibold text-center mb-4 text-black">
        Cash Mobilization – {state}
      </h1>

      <div className="mb-4 text-gray-700 flex justify-center">
        <input
          type="text"
          placeholder="Search by project, contractor, status, amount, or date..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md p-2 text-sm border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
        />
      </div>

      <main>
        {loading ? (
          <p className="text-center text-gray-500 mt-6 text-sm">Loading...</p>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredData.map((item) => (
              <PaymentCard
                key={item.id}
                id={item.id}
                table="cash_mobilization"
                workflow="payment"
                project={item.project}
                contractor={item.contractor}
                amount={item.amount}
                category={item.category}
                status={item.status}
                dateRequested={item.dateRequested}
                sent_to_award={item.sent_to_award}
                sent_to_award_date={item.sent_to_award_date}
                sent_for_approval={item.sent_for_approval}
                sent_for_approval_date={item.sent_for_approval_date}
                approved={item.approved}
                approved_date={item.approved_date}
                sent_to_finance={item.sent_to_finance}
                sent_to_finance_date={item.sent_to_finance_date}
                sent_to_audit={item.sent_to_audit}
                sent_to_audit_date={item.sent_to_audit_date}
                cleared={item.cleared}
                cleared_date={item.cleared_date}
                paid={item.paid}
                paid_date={item.paid_date}
                onUpdate={handleUpdate} // saves local state when card changes
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-6 text-sm">No results found.</p>
        )}
      </main>

      {/* Overview Box at the Bottom Right */}
      <div className="fixed bottom-6 right-6 bg-gray-200 text-gray-800 p-4 rounded-lg shadow-lg text-sm w-48">
        <div className="mb-2 flex justify-between">
          <strong>Pending</strong>
          <span>{pendingCount}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <strong>Overdue</strong>
          <span>{overdueCount}</span>
        </div>
        <div className="flex justify-between">
          <strong>Paid</strong> {/* Replaced Delivered with Paid */}
          <span>{paidCount}</span>
        </div>
      </div>
    </div>
  );
}
