export type NotificationLevel = "info" | "warning" | "success" | "destructive";

export type AgentNotification = {
  id: string;
  title: string;
  message: string;
  level: NotificationLevel;
  createdAtIso: string;
  read: boolean;
  source?: "system" | "geolocation" | "sos" | "schedule" | "timeoff" | "payroll";
};

