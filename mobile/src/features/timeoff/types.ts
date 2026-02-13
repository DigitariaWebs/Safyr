export type TimeOffStatus = "pending" | "approved" | "rejected";

export type TimeOffRequest = {
  id: string;
  type: "paid" | "unpaid" | "sick" | "other";
  startIso: string;
  endIso: string;
  reason?: string;
  status: TimeOffStatus;
  createdAtIso: string;
};

