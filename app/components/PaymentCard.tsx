"use client";

export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

interface PaymentCardProps {
  project: string;
  contractor: string;
  category: "BUILDING" | "INFRASTRUCTURE" | "PILING";
  status: Status;
  dateRequested?: string;

  // Cement fields
  amount?: number;
  unit?: string;

  // Milestone fields
  signOff?: string;
  presented?: string;

  // Reinforcement sizes
  y10?: number;
  y12?: number;
  y16?: number;
  y20?: number;
  y25?: number;
  y32?: number;
}

export default function PaymentCard({
  project,
  contractor,
  category,
  status,
  dateRequested,

  // Cement
  amount,
  unit,

  // Milestone
  signOff,
  presented,

  // Reinforcement
  y10 = 0,
  y12 = 0,
  y16 = 0,
  y20 = 0,
  y25 = 0,
  y32 = 0
}: PaymentCardProps) {
  const statusStyles =
    status === "PENDING"
      ? "bg-yellow-400 text-black"
      : status === "OVERDUE"
      ? "bg-red-500 text-white"
      : "bg-green-500 text-white";

  return (
    <div className="bg-white w-full max-w-md rounded-xl shadow-md p-4 border border-gray-200 flex flex-col gap-3 relative">

      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-700">Project Info</p>
        <span className={`px-3 py-1 rounded-md text-xs font-semibold shadow ${statusStyles}`}>
          {status}
        </span>
      </div>

      {/* Basic info */}
      <div className="text-sm text-gray-700 flex flex-col gap-1">
        <p><strong>Project:</strong> {project}</p>
        <p><strong>Contractor:</strong> {contractor}</p>
        <p><strong>Category:</strong> {category}</p>
      </div>

      {/* Cement section */}
      {(amount !== undefined || unit) && (
        <div className="mt-2 text-sm text-gray-800 flex flex-col gap-1 border-t pt-2">
          <p><strong>Amount:</strong> {amount}</p>
          <p><strong>Unit:</strong> {unit}</p>
        </div>
      )}

      {/* Milestone section */}
      {(signOff || presented) && (
        <div className="mt-2 text-sm text-gray-800 flex flex-col gap-1 border-t pt-2">
          {presented && <p><strong>Presented:</strong> {presented}</p>}
          {signOff && <p><strong>Sign Off:</strong> {signOff}</p>}
        </div>
      )}

      {/* Reinforcement section */}
      {(y10 || y12 || y16 || y20 || y25 || y32) && (
        <div className="mt-2 text-sm text-gray-800 flex flex-col gap-1 border-t pt-2">
          <p><strong>Y10:</strong> {y10}</p>
          <p><strong>Y12:</strong> {y12}</p>
          <p><strong>Y16:</strong> {y16}</p>
          <p><strong>Y20:</strong> {y20}</p>
          <p><strong>Y25:</strong> {y25}</p>
          <p><strong>Y32:</strong> {y32}</p>
        </div>
      )}

      {/* Date */}
      <div className="text-xs text-gray-500 text-right mt-2">
        {dateRequested && <span>Date Requested: {dateRequested}</span>}
      </div>
    </div>
  );
}
