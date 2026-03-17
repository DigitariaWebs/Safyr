import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Appointment, CalendarScope, CalendarSettings } from "@/lib/types";

const defaultSettings: CalendarSettings = {
  defaultView: "month",
  defaultScope: "personal",
  showWeekends: true,
  startHour: 8,
  endHour: 18,
};

interface AgendaStore {
  // Persisted
  appointments: Appointment[];
  calendarSettings: CalendarSettings;

  // Transient (not persisted)
  isOpen: boolean;
  calendarScope: CalendarScope;
  selectedDate: Date;
  currentUserId: string;

  // Actions
  openAgenda: (date?: Date) => void;
  closeAgenda: () => void;
  addAppointment: (
    appointment: Omit<Appointment, "id" | "createdAt" | "createdBy">,
  ) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setCalendarScope: (scope: CalendarScope) => void;
  updateCalendarSettings: (updates: Partial<CalendarSettings>) => void;
  setSelectedDate: (date: Date) => void;
  getFilteredAppointments: () => Appointment[];
}

export const useAgendaStore = create<AgendaStore>()(
  persist(
    (set, get) => ({
      appointments: [],
      calendarSettings: defaultSettings,

      isOpen: false,
      calendarScope: "personal",
      selectedDate: new Date(),
      currentUserId: "user-1",

      openAgenda: (date) =>
        set({
          isOpen: true,
          ...(date ? { selectedDate: date } : {}),
        }),

      closeAgenda: () => set({ isOpen: false }),

      addAppointment: (appointmentData) => {
        const state = get();
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          createdBy: state.currentUserId,
          createdAt: new Date().toISOString(),
          userId:
            appointmentData.scope === "personal"
              ? state.currentUserId
              : undefined,
        };
        set({ appointments: [...state.appointments, newAppointment] });
      },

      updateAppointment: (id, updates) =>
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
              : apt,
          ),
        })),

      deleteAppointment: (id) =>
        set((state) => ({
          appointments: state.appointments.filter((apt) => apt.id !== id),
        })),

      setCalendarScope: (scope) => set({ calendarScope: scope }),

      updateCalendarSettings: (updates) =>
        set((state) => {
          const newSettings = { ...state.calendarSettings, ...updates };
          return {
            calendarSettings: newSettings,
            ...(updates.defaultScope
              ? { calendarScope: updates.defaultScope }
              : {}),
          };
        }),

      setSelectedDate: (date) => set({ selectedDate: date }),

      getFilteredAppointments: () => {
        const state = get();
        if (state.calendarScope === "global") {
          return state.appointments.filter((apt) => apt.scope === "global");
        }
        return state.appointments.filter(
          (apt) =>
            apt.scope === "global" ||
            (apt.scope === "personal" && apt.userId === state.currentUserId),
        );
      },
    }),
    {
      name: "agenda-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        appointments: state.appointments,
        calendarSettings: state.calendarSettings,
      }),
    },
  ),
);
