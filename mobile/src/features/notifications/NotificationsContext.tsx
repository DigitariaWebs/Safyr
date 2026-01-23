import * as React from "react";
import type { AgentNotification, NotificationLevel } from "./types";
import {
  clearNotifications,
  getNotifications,
  markAllNotificationsRead,
  pushNotification,
} from "./notifications.storage";

type NotificationsContextValue = {
  items: AgentNotification[];
  unreadCount: number;
  refresh: () => Promise<void>;
  push: (input: {
    title: string;
    message: string;
    level?: NotificationLevel;
    source?: AgentNotification["source"];
  }) => Promise<void>;
  markAllRead: () => Promise<void>;
  clearAll: () => Promise<void>;
};

const NotificationsContext = React.createContext<NotificationsContextValue | undefined>(
  undefined,
);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<AgentNotification[]>([]);

  const refresh = React.useCallback(async () => {
    const next = await getNotifications();
    setItems(next);
  }, []);

  React.useEffect(() => {
    void refresh();
  }, [refresh]);

  const push = React.useCallback(
    async (input: {
      title: string;
      message: string;
      level?: NotificationLevel;
      source?: AgentNotification["source"];
    }) => {
      await pushNotification(input);
      await refresh();
    },
    [refresh],
  );

  const markAllRead = React.useCallback(async () => {
    await markAllNotificationsRead();
    await refresh();
  }, [refresh]);

  const clearAll = React.useCallback(async () => {
    await clearNotifications();
    await refresh();
  }, [refresh]);

  const unreadCount = React.useMemo(() => items.filter((n) => !n.read).length, [items]);

  return (
    <NotificationsContext.Provider
      value={{ items, unreadCount, refresh, push, markAllRead, clearAll }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = React.useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications must be used within NotificationsProvider");
  return ctx;
}

