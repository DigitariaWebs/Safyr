import { create } from "zustand";

import type { SOSEvent, ImmobilityAlert } from "@/data/geolocation-sos";
import {
  mockActiveSOSEvents,
  mockSOSHistory,
  mockImmobilityAlerts,
} from "@/data/geolocation-sos";

interface SOSStore {
  activeAlerts: SOSEvent[];
  sosHistory: SOSEvent[];
  immobilityAlerts: ImmobilityAlert[];
  immobilityThresholdMinutes: number;
  discreteAgentIds: string[];
  hasNewSOS: boolean;

  acknowledgeAlert: (sosId: string) => void;
  dispatchHelp: (sosId: string) => void;
  escalateHR: (sosId: string) => void;
  dismissAlert: (sosId: string, reason: string, note?: string) => void;
  clearNewSOSFlag: () => void;
  setImmobilityThreshold: (minutes: number) => void;
  toggleDiscreteMode: (agentId: string) => void;
}

export const useSOSStore = create<SOSStore>()((set) => ({
  activeAlerts: mockActiveSOSEvents,
  sosHistory: mockSOSHistory,
  immobilityAlerts: mockImmobilityAlerts,
  immobilityThresholdMinutes: 15,
  discreteAgentIds: [],
  hasNewSOS: mockActiveSOSEvents.length > 0,

  acknowledgeAlert: (sosId) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((alert) =>
        alert.id === sosId
          ? {
              ...alert,
              status: "acknowledged" as const,
              acknowledgedAt: new Date().toISOString(),
            }
          : alert,
      ),
    })),

  dispatchHelp: (sosId) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((alert) =>
        alert.id === sosId
          ? { ...alert, status: "dispatched" as const }
          : alert,
      ),
    })),

  escalateHR: (sosId) =>
    set((state) => ({
      activeAlerts: state.activeAlerts.map((alert) =>
        alert.id === sosId ? { ...alert, status: "escalated" as const } : alert,
      ),
    })),

  dismissAlert: (sosId, reason, note?) =>
    set((state) => {
      const alert = state.activeAlerts.find((a) => a.id === sosId);
      if (!alert) return state;

      const dismissedAlert: SOSEvent = {
        ...alert,
        status: "dismissed",
        dismissedAt: new Date().toISOString(),
        dismissReason: reason,
        dismissNote: note,
      };

      const remaining = state.activeAlerts.filter((a) => a.id !== sosId);
      return {
        activeAlerts: remaining,
        sosHistory: [dismissedAlert, ...state.sosHistory],
        hasNewSOS: remaining.length > 0 ? state.hasNewSOS : false,
      };
    }),

  clearNewSOSFlag: () => set({ hasNewSOS: false }),

  setImmobilityThreshold: (minutes) =>
    set({ immobilityThresholdMinutes: minutes }),

  toggleDiscreteMode: (agentId) =>
    set((state) => ({
      discreteAgentIds: state.discreteAgentIds.includes(agentId)
        ? state.discreteAgentIds.filter((id) => id !== agentId)
        : [...state.discreteAgentIds, agentId],
    })),
}));
