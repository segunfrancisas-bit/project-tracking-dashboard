"use client";

export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

interface PaymentCardProps {
  project: string;
  contractor: string;
  amount?: number; // currency or numeric
  unit?: string;   // "Bags" or "Tons"
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested?: string;
  signOff?: string;
  presented?: string;
}

export default function PaymentCard({
  project,
  contractor,
  amount,
  unit,
  category,
  status,
  dateRequested,
  signOff,
  presented,
}: PaymentCardProps) {
  const displayAmount = unit
    ? `${amount ?? ""} ${unit}`
    : amount
    ? `₦${Number(amount).toLocaleString()}`
    : "";

  const statusStyles =
    status === "PENDING"
      ? "bg-yellow-400 text-black"
      : status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-md p-4 border border-gray-200 flex flex-col gap-3 relative">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700">Project Info</p>
        <span className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}>
          {status}
        </span>
      </div>

      <div className="text-sm text-gray-600 flex flex-col gap-1">
        <p><strong>Project:</strong> {project}</p>
        <p><strong>Contractor:</strong> {contractor}</p>
        <p><strong>Category:</strong> {category}</p>
      </div>

      <p className="text-base font-bold text-gray-900 mt-1">{displayAmount}</p>

      <div className="text-xs text-gray-500 text-right mt-2 flex flex-col gap-0">
        {dateRequested && <span>Date Requested: {dateRequested}</span>}
        {signOff && <span>Sign Off: {signOff}</span>}
        {presented && <span>Date Presented: {presented}</span>}
      </div>
    </div>
  );
}
