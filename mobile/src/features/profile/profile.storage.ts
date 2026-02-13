import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@/features/auth/auth.storage";

const KEY = "safyr.profile.v1";

export type AgentProfile = {
  fullName: string;
  email?: string;
  phone?: string;
  siteName?: string;
  badgeId?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  updatedAtIso: string;
};

export async function getProfile(): Promise<AgentProfile | null> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AgentProfile;
  } catch {
    return null;
  }
}

export async function upsertProfile(next: Omit<AgentProfile, "updatedAtIso">): Promise<void> {
  const profile: AgentProfile = { ...next, updatedAtIso: new Date().toISOString() };
  await AsyncStorage.setItem(KEY, JSON.stringify(profile));
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(KEY);
}

export function defaultProfileFromSession(session: Session): Omit<AgentProfile, "updatedAtIso"> {
  return {
    fullName: session.fullName,
    email: undefined,
    phone: undefined,
    siteName: "Siège • Paris",
    badgeId: session.userId,
    emergencyContactName: undefined,
    emergencyContactPhone: undefined,
  };
}

