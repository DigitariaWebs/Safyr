export type MainCourantePriority = "low" | "medium" | "high";

export type MainCouranteEvent = {
  id: string;
  title: string;
  description: string;
  siteName: string;
  createdAtIso: string;
  priority: MainCourantePriority;
  status: "open" | "closed";
};

