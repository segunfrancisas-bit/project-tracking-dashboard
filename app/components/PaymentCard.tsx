"use client";

import { Status } from "@/lib/types";

interface PaymentCardProps {
  project: string;
  contractor: string;
  amount?: number;
  bags?: number;
  tons?: number;
  category: string;
  status: Status;
  dateRequested?: string;
  signOff?: string;
  presented?: string;
  unit?: string;
}

export default function PaymentCard({
  project,
  contractor,
  amount,
  bags,
  tons,
  category,
  status,
  dateRequested,
  signOff,
  presented,
  unit,
}: PaymentCardProps) {
  const displayAmount = amount
    ? `₦${amount.toLocaleString()}`
    : bags
    ? `${bags} Bags`
    : tons
    ? `${tons} Tons`
    : "";

  const statusStyles =
    status === "PENDING"
      ? "bg-yellow-400 text-black"
      : status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-md p-6 border border-gray-200 flex flex-col gap-2 relative">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-black">Project Info</p>
        <span className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}>
          {status}
        </span>
      </div>

      <p className="text-black"><strong>Project:</strong> {project}</p>
      <p className="text-black"><strong>Contractor:</strong> {contractor}</p>
      <p className="text-black"><strong>Category:</strong> {category}</p>
      <p className="text-black font-bold mt-1">{displayAmount}</p>

      <div className="text-xs text-gray-500 text-right mt-2 flex flex-col gap-0">
        {dateRequested && <span>{dateRequested}</span>}
        {signOff && <span>Sign Off: {signOff}</span>}
        {presented && <span>Date Presented: {presented}</span>}
      </div>
    </div>
  );
}
