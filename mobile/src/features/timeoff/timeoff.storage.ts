import AsyncStorage from "@react-native-async-storage/async-storage";
import type { TimeOffRequest } from "./types";

const KEY = "safyr.timeoff.v1";

function makeId() {
  return `to_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export async function getTimeOffRequests(): Promise<TimeOffRequest[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as TimeOffRequest[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function save(items: TimeOffRequest[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

export async function seedTimeOffIfEmpty(seed: TimeOffRequest[]) {
  const current = await getTimeOffRequests();
  if (current.length > 0) return;
  await save(seed);
}

export async function createTimeOffRequest(input: Omit<TimeOffRequest, "id" | "status" | "createdAtIso">) {
  const current = await getTimeOffRequests();
  const created: TimeOffRequest = {
    id: makeId(),
    status: "pending",
    createdAtIso: new Date().toISOString(),
    ...input,
  };
  await save([created, ...current]);
  return created;
}

