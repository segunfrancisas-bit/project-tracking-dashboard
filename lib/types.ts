export type Status = "PENDING" | "OVERDUE" | "PAID" | "DELIVERED";

export interface FormData {
  project: string;
  contractor: string;
  category: string;
  amount?: number;
  bags?: number;
  tons?: number;
  dateRequested?: string;
  signOff?: string;
  presented?: string;
  status: Status;
  type: "cash-mobilization" | "milestone-request" | "material-request";
  state: "Lagos" | "Abuja";
}
