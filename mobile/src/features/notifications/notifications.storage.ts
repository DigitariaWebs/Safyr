import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AgentNotification, NotificationLevel } from "./types";

const KEY = "safyr.notifications.v1";

function nowIso() {
  return new Date().toISOString();
}

function makeId() {
  return `n_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function getNotifications(): Promise<AgentNotification[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AgentNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function saveNotifications(items: AgentNotification[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function pushNotification(input: {
  title: string;
  message: string;
  level?: NotificationLevel;
  source?: AgentNotification["source"];
}): Promise<AgentNotification> {
  const current = await getNotifications();
  const created: AgentNotification = {
    id: makeId(),
    title: input.title,
    message: input.message,
    level: input.level ?? "info",
    source: input.source,
    createdAtIso: nowIso(),
    read: false,
  };
  const next = [created, ...current].slice(0, 200);
  await saveNotifications(next);
  return created;
}

export async function markAllNotificationsRead(): Promise<void> {
  const current = await getNotifications();
  await saveNotifications(current.map((n) => ({ ...n, read: true })));
}

export async function clearNotifications(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

