"use client";

export type Status = "PENDING" | "OVERDUE" | "PAID";

interface PaymentCardProps {
  project: string;
  contractor: string;
  amount: number;
  category: string;
  status: Status;
  dateRequested?: string; // For Cash Mobilization
  signOff?: string;       // For Milestone
  presented?: string;     // For Milestone
}

export default function PaymentCard({
  project,
  contractor,
  amount,
  category,
  status,
  dateRequested,
  signOff,
  presented,
}: PaymentCardProps) {
  const statusStyles =
    status === "PENDING"
      ? "bg-yellow-400 text-black"
      : status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-md p-4 border border-gray-200 flex flex-col gap-2 relative">
      {/* Top Row */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700">Project Info</p>
        <span className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}>
          {status}
        </span>
      </div>

      {/* Details */}
      <p className="text-sm text-gray-600">
        <strong>Project:</strong> {project}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Contractor:</strong> {contractor}
      </p>
      <p className="text-sm text-gray-600">
        <strong>Category:</strong> {category}
      </p>

      {/* Amount */}
      <p className="text-base font-bold text-gray-900 mt-1">
        ₦{amount.toLocaleString()}
      </p>

      {/* Dates at bottom-right */}
      <div className="text-xs text-gray-500 text-right mt-2 flex flex-col gap-0">
        {dateRequested && <span>{dateRequested}</span>}
        {signOff && <span>Sign Off: {signOff}</span>}
        {presented && <span>Date Presented: {presented}</span>}
      </div>
    </div>
  );
}
