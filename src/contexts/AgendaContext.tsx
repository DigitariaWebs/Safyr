"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Appointment, CalendarScope, CalendarSettings } from "@/lib/types";

interface AgendaContextType {
  isOpen: boolean;
  appointments: Appointment[];
  calendarScope: CalendarScope;
  calendarSettings: CalendarSettings;
  selectedDate: Date;
  currentUserId: string;
  openAgenda: (date?: Date) => void;
  closeAgenda: () => void;
  addAppointment: (appointment: Omit<Appointment, "id" | "createdAt" | "createdBy">) => void;
  updateAppointment: (id: string, appointment: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  setCalendarScope: (scope: CalendarScope) => void;
  updateCalendarSettings: (settings: Partial<CalendarSettings>) => void;
  setSelectedDate: (date: Date) => void;
  getFilteredAppointments: () => Appointment[];
}

const AgendaContext = createContext<AgendaContextType | undefined>(undefined);

const defaultSettings: CalendarSettings = {
  defaultView: "month",
  defaultScope: "personal",
  showWeekends: true,
  startHour: 8,
  endHour: 18,
};

export function AgendaProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [calendarScope, setCalendarScope] = useState<CalendarScope>("personal");
  const [calendarSettings, setCalendarSettings] = useState<CalendarSettings>(defaultSettings);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Mock user ID - in a real app, this would come from auth context
  const currentUserId = "user-1";

  // Load appointments and settings from localStorage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const savedAppointments = localStorage.getItem("appointments");
      if (savedAppointments) {
        try {
          setAppointments(JSON.parse(savedAppointments));
        } catch (e) {
          console.error("Failed to load appointments", e);
        }
      }

      const savedSettings = localStorage.getItem("calendarSettings");
      if (savedSettings) {
        try {
          const parsed = JSON.parse(savedSettings);
          setCalendarSettings({ ...defaultSettings, ...parsed });
          setCalendarScope(parsed.defaultScope || "personal");
        } catch (e) {
          console.error("Failed to load calendar settings", e);
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Save appointments to localStorage whenever they change
  const saveAppointments = (newAppointments: Appointment[]) => {
    localStorage.setItem("appointments", JSON.stringify(newAppointments));
    setAppointments(newAppointments);
  };

  // Save settings to localStorage whenever they change
  const saveSettings = (newSettings: CalendarSettings) => {
    localStorage.setItem("calendarSettings", JSON.stringify(newSettings));
    setCalendarSettings(newSettings);
  };

  const openAgenda = (date?: Date) => {
    if (date) {
      setSelectedDate(date);
    }
    setIsOpen(true);
  };

  const closeAgenda = () => {
    setIsOpen(false);
  };

  const addAppointment = (appointmentData: Omit<Appointment, "id" | "createdAt" | "createdBy">) => {
    const generateId = () => `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newAppointment: Appointment = {
      ...appointmentData,
      id: generateId(),
      createdBy: currentUserId,
      createdAt: new Date().toISOString(),
      userId: appointmentData.scope === "personal" ? currentUserId : undefined,
    };

    saveAppointments([...appointments, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map((apt) =>
      apt.id === id
        ? {
            ...apt,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : apt
    );
    saveAppointments(updatedAppointments);
  };

  const deleteAppointment = (id: string) => {
    const filteredAppointments = appointments.filter((apt) => apt.id !== id);
    saveAppointments(filteredAppointments);
  };

  const handleSetCalendarScope = (scope: CalendarScope) => {
    setCalendarScope(scope);
  };

  const updateCalendarSettings = (updates: Partial<CalendarSettings>) => {
    const newSettings = { ...calendarSettings, ...updates };
    saveSettings(newSettings);

    // Update scope if defaultScope changed
    if (updates.defaultScope) {
      setCalendarScope(updates.defaultScope);
    }
  };

  const getFilteredAppointments = (): Appointment[] => {
    if (calendarScope === "global") {
      // Show all appointments with global scope
      return appointments.filter((apt) => apt.scope === "global");
    } else {
      // Show personal appointments for current user + global appointments
      return appointments.filter(
        (apt) =>
          apt.scope === "global" ||
          (apt.scope === "personal" && apt.userId === currentUserId)
      );
    }
  };

  return (
    <AgendaContext.Provider
      value={{
        isOpen,
        appointments,
        calendarScope,
        calendarSettings,
        selectedDate,
        currentUserId,
        openAgenda,
        closeAgenda,
        addAppointment,
        updateAppointment,
        deleteAppointment,
        setCalendarScope: handleSetCalendarScope,
        updateCalendarSettings,
        setSelectedDate,
        getFilteredAppointments,
      }}
    >
      {children}
    </AgendaContext.Provider>
  );
}

export function useAgenda() {
  const context = useContext(AgendaContext);
  if (context === undefined) {
    throw new Error("useAgenda must be used within an AgendaProvider");
  }
  return context;
}
