"use client";

import React, { useState, useMemo } from "react";
import { usePlanningSettingsStore } from "@/lib/stores/planningSettingsStore";
import type { PlanningSettings } from "@/lib/stores/planningSettingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Calendar,
  Users,
  AlertTriangle,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  MapPin,
  Building2,
  Copy,
  Clipboard,
  MoreVertical,
  X,
  Ban,
  Moon,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Timer,
  Lock,
  CalendarOff,
  Download,
  FileText,
} from "lucide-react";

import type {
  StandardShift,
  AgentShift,
  SiteAgentAssignment,
  TimeOffRequest,
} from "@/lib/types";

import { mockClients, mockSites, mockPostes } from "@/data/sites";
import {
  mockStandardShifts,
  mockSiteAgentAssignments,
  mockAgentShifts,
} from "@/data/site-shifts";
import { mockTimeOffRequests } from "@/data/time-off";
import { mockPlanningAgents } from "@/data/planning-agents";

type ViewType = "daily" | "weekly" | "monthly";
type ConflictType = "time_off" | "double_booking";

interface DateConflict {
  type: ConflictType;
  severity: "high" | "medium";
  message: string;
  details?: TimeOffRequest | AgentShift;
}

interface PendingPasteAction {
  type: "shift" | "week";
  agentId: string;
  dates: string[];
}

interface ShiftContext {
  agentId: string;
  date: string;
}

declare global {
  interface Window {
    __shiftContext?: ShiftContext;
  }
}

export default function SchedulePage() {
  const { settings } = usePlanningSettingsStore();
  const idCounterRef = React.useRef(0);
  const generateShiftId = () => {
    idCounterRef.current += 1;
    return `shift-popover-${idCounterRef.current}`;
  };

  // Auto-select first client and site on mount
  const getInitialClientId = () => {
    if (mockClients.length > 0) {
      return mockClients[0].id;
    }
    return null;
  };

  const getInitialSiteId = () => {
    if (mockClients.length > 0) {
      const firstClient = mockClients[0];
      const clientSites = mockSites.filter(
        (s) => s.clientId === firstClient.id && s.status === "active",
      );
      if (clientSites.length > 0) {
        return clientSites[0].id;
      }
    }
    return null;
  };

  // State
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    getInitialClientId,
  );
  const [selectedSiteId, setSelectedSiteId] = useState<string | null>(
    getInitialSiteId,
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewType, setViewType] = useState<ViewType>("weekly");

  // Data state
  const [standardShifts, setStandardShifts] =
    useState<StandardShift[]>(mockStandardShifts);
  const [siteAgents, setSiteAgents] = useState<SiteAgentAssignment[]>(
    mockSiteAgentAssignments,
  );
  const [agentShifts, setAgentShifts] = useState<AgentShift[]>(mockAgentShifts);

  // Modals
  const [showClientSelector, setShowClientSelector] = useState(false);
  const [showSiteSelector, setShowSiteSelector] = useState(false);
  const [showAgentCommand, setShowAgentCommand] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showConflictModal, setShowConflictModal] = useState(false);
  const [showRemoveAgentModal, setShowRemoveAgentModal] = useState(false);
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [showTemplatePopover, setShowTemplatePopover] = useState(false);
  const [templatePopoverContext, setTemplatePopoverContext] = useState<{
    agentId: string;
    date: string;
  } | null>(null);
  const [selectedPopoverTemplateId, setSelectedPopoverTemplateId] = useState<
    string | null
  >(null);

  // Modal data
  const [editingShift, setEditingShift] = useState<AgentShift | null>(null);
  const [selectedAgentForRemoval, setSelectedAgentForRemoval] = useState<
    string | null
  >(null);
  const [conflictDetails, setConflictDetails] = useState<{
    agentId: string;
    date: string;
    conflict: DateConflict;
  } | null>(null);

  // Copy/paste state
  const [copiedShift, setCopiedShift] = useState<AgentShift | null>(null);
  const [copiedWeekDates, setCopiedWeekDates] = useState<string[] | null>(null);
  const [copiedWeekAgentId, setCopiedWeekAgentId] = useState<string | null>(
    null,
  );
  const [pendingPasteAction, setPendingPasteAction] =
    useState<PendingPasteAction | null>(null);

  // Form state for shift creation/editing
  const [shiftForm, setShiftForm] = useState({
    shiftType: "standard" as "standard" | "on_demand",
    standardShiftId: "",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 30,
    color: "#3b82f6",
    notes: "",
    isOvernight: false,
  });

  // Template form state
  const [templateForm, setTemplateForm] = useState({
    name: "",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 30,
    color: "#3b82f6",
  });

  // Get selected client
  const selectedClient = useMemo(() => {
    return mockClients.find((c) => c.id === selectedClientId);
  }, [selectedClientId]);

  // Get available sites for selected client
  const availableSites = useMemo(() => {
    if (!selectedClientId) return [];
    return mockSites.filter((s) => s.clientId === selectedClientId);
  }, [selectedClientId]);

  // Get selected site
  const selectedSite = useMemo(() => {
    return mockSites.find((s) => s.id === selectedSiteId);
  }, [selectedSiteId]);

  // Get site standard shifts
  const siteStandardShifts = useMemo(() => {
    if (!selectedSiteId) return [];
    return standardShifts.filter((s) => s.siteId === selectedSiteId);
  }, [selectedSiteId, standardShifts]);

  // Get assigned agents for selected site
  const assignedAgents = useMemo(() => {
    if (!selectedSiteId) return [];
    return siteAgents
      .filter((sa) => sa.siteId === selectedSiteId && sa.active)
      .map((sa) => {
        const agent = mockPlanningAgents.find((a) => a.id === sa.agentId);
        return { ...sa, agent };
      });
  }, [selectedSiteId, siteAgents]);

  // Available agents (not yet assigned to this site)
  const availableAgents = useMemo(() => {
    const assignedIds = assignedAgents.map((a) => a.agentId);
    return mockPlanningAgents.filter((a) => !assignedIds.includes(a.id));
  }, [assignedAgents]);

  // Calculate display dates
  const displayDates = useMemo(() => {
    const dates: Date[] = [];
    if (viewType === "daily") {
      dates.push(new Date(currentDate));
    } else if (viewType === "weekly") {
      const start = new Date(currentDate);
      const day = start.getDay();
      const diff = day === 0 ? -6 : 1 - day;
      start.setDate(start.getDate() + diff);
      for (let i = 0; i < 7; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date);
      }
    } else if (viewType === "monthly") {
      const start = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      const end = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
      );
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
    }
    return dates;
  }, [currentDate, viewType]);

  // Helper functions
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  const isDateInPast = (date: Date | string): boolean => {
    const checkDate = typeof date === "string" ? new Date(date) : date;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const isClosedDay = (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const dayIndex = d.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const dayMap: (keyof PlanningSettings["openDays"])[] = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return !settings.openDays[dayMap[dayIndex]];
  };

  const isPublicHoliday = (date: Date | string): boolean => {
    const d = typeof date === "string" ? new Date(date) : date;
    const month = d.getMonth() + 1; // 1-indexed
    const day = d.getDate();
    const ph = settings.publicHolidays;

    if (ph.newYear && month === 1 && day === 1) return true;
    if (ph.laborDay && month === 5 && day === 1) return true;
    if (ph.victoryDay && month === 5 && day === 8) return true;
    if (ph.nationalDay && month === 7 && day === 14) return true;
    if (ph.assumption && month === 8 && day === 15) return true;
    if (ph.allSaints && month === 11 && day === 1) return true;
    if (ph.armistice && month === 11 && day === 11) return true;
    if (ph.christmas && month === 12 && day === 25) return true;

    // Variable dates — approximate via year
    const year = d.getFullYear();
    if (ph.easterMonday) {
      const easter = getEasterDate(year);
      const easterMonday = new Date(easter);
      easterMonday.setDate(easter.getDate() + 1);
      if (
        month === easterMonday.getMonth() + 1 &&
        day === easterMonday.getDate()
      )
        return true;
    }
    if (ph.ascension) {
      const easter = getEasterDate(year);
      const ascension = new Date(easter);
      ascension.setDate(easter.getDate() + 39);
      if (month === ascension.getMonth() + 1 && day === ascension.getDate())
        return true;
    }

    return false;
  };

  // Anonymous Gregorian algorithm for Easter
  const getEasterDate = (year: number): Date => {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(year, month - 1, day);
  };

  const isShiftInPast = (shift: AgentShift): boolean => {
    return isDateInPast(shift.date);
  };

  const isOvernightShift = (startTime: string, endTime: string): boolean => {
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    return endHour < startHour || (endHour === startHour && endHour < 12);
  };

  const calculateShiftLength = (
    startTime: string,
    endTime: string,
    breakDuration: number,
  ): string => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);

    let minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    if (minutes < 0) {
      minutes += 24 * 60; // overnight
    }
    minutes -= breakDuration;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h${mins > 0 ? mins.toString().padStart(2, "0") : ""}`;
  };

  const calculateAgentHours = (agentId: string, dates: Date[]): number => {
    let totalMinutes = 0;
    dates.forEach((date) => {
      const dateStr = formatDate(date);
      const shift = agentShifts.find(
        (s) =>
          s.agentId === agentId &&
          s.date === dateStr &&
          s.siteId === selectedSiteId,
      );
      if (shift) {
        const [startHour, startMin] = shift.startTime.split(":").map(Number);
        const [endHour, endMin] = shift.endTime.split(":").map(Number);
        let minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
        if (minutes < 0) minutes += 24 * 60;
        minutes -= shift.breakDuration;
        totalMinutes += minutes;
      }
    });
    return totalMinutes / 60;
  };

  const hasTimeOff = (agentId: string, date: string): boolean => {
    const dateObj = new Date(date);
    return mockTimeOffRequests.some((req) => {
      if (req.employeeId !== agentId || req.status !== "approved") return false;
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      dateObj.setHours(12, 0, 0, 0);
      return dateObj >= start && dateObj <= end;
    });
  };

  const hasShiftAtOtherSite = (
    agentId: string,
    date: string,
    currentSiteId: string,
  ): boolean => {
    return agentShifts.some(
      (s) =>
        s.agentId === agentId && s.date === date && s.siteId !== currentSiteId,
    );
  };

  const getDateConflict = (
    agentId: string,
    date: string,
  ): DateConflict | null => {
    if (isPublicHoliday(date)) {
      return {
        type: "time_off",
        severity: "medium",
        message: "Jour férié",
        details: undefined,
      };
    }
    if (hasTimeOff(agentId, date)) {
      const timeOff = mockTimeOffRequests.find((req) => {
        if (req.employeeId !== agentId || req.status !== "approved")
          return false;
        const dateObj = new Date(date);
        const start = new Date(req.startDate);
        const end = new Date(req.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        dateObj.setHours(12, 0, 0, 0);
        return dateObj >= start && dateObj <= end;
      });
      return {
        type: "time_off",
        severity: "high",
        message: "Agent en congé",
        details: timeOff,
      };
    }
    if (selectedSiteId && hasShiftAtOtherSite(agentId, date, selectedSiteId)) {
      const otherShift = agentShifts.find(
        (s) =>
          s.agentId === agentId &&
          s.date === date &&
          s.siteId !== selectedSiteId,
      );
      return {
        type: "double_booking",
        severity: "medium",
        message: "Assigné sur un autre site",
        details: otherShift,
      };
    }
    return null;
  };

  const getOvernightShiftForDate = (
    agentId: string,
    date: string,
  ): AgentShift | null => {
    const dateObj = new Date(date);
    const prevDate = new Date(dateObj);
    prevDate.setDate(prevDate.getDate() - 1);
    const prevDateStr = formatDate(prevDate);

    const shift = agentShifts.find(
      (s) =>
        s.agentId === agentId &&
        s.date === prevDateStr &&
        s.siteId === selectedSiteId &&
        isOvernightShift(s.startTime, s.endTime),
    );
    return shift || null;
  };

  // Navigation
  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (viewType === "daily") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
    } else if (viewType === "weekly") {
      newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
    } else if (viewType === "monthly") {
      newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
    }
    setCurrentDate(newDate);
  };

  // Agent management
  const handleAssignAgent = (agentId: string) => {
    if (!selectedSiteId) return;
    const agent = mockPlanningAgents.find((a) => a.id === agentId);
    if (!agent) return;

    const generateId = () => `sa-${Date.now()}-${Math.random()}`;
    const newAssignment: SiteAgentAssignment = {
      id: generateId(),
      siteId: selectedSiteId,
      agentId: agentId,
      agentName: agent.name,
      assignedAt: new Date(),
      active: true,
    };
    setSiteAgents([...siteAgents, newAssignment]);
    setShowAgentCommand(false);
  };

  const handleRemoveAgent = (agentId: string) => {
    setSelectedAgentForRemoval(agentId);
    setShowRemoveAgentModal(true);
  };

  const confirmRemoveAgent = () => {
    if (!selectedAgentForRemoval || !selectedSiteId) return;
    setSiteAgents(
      siteAgents.map((sa) =>
        sa.siteId === selectedSiteId && sa.agentId === selectedAgentForRemoval
          ? { ...sa, active: false }
          : sa,
      ),
    );
    setAgentShifts(
      agentShifts.filter(
        (s) =>
          !(
            s.siteId === selectedSiteId && s.agentId === selectedAgentForRemoval
          ),
      ),
    );
    setShowRemoveAgentModal(false);
    setSelectedAgentForRemoval(null);
  };

  // Shift management
  const handleCreateShift = (agentId: string, date: string) => {
    if (isDateInPast(date)) return;
    const conflict = getDateConflict(agentId, date);
    if (conflict?.type === "time_off") return;

    if (conflict?.type === "double_booking") {
      setPendingPasteAction({ type: "shift", agentId, dates: [date] });
      setShowOverrideModal(true);
      return;
    }

    setEditingShift(null);
    setShiftForm({
      shiftType: "standard",
      standardShiftId: siteStandardShifts[0]?.id || "",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 30,
      color: "#3b82f6",
      notes: "",
      isOvernight: false,
    });

    // Open compact template popover instead of full modal
    setTemplatePopoverContext({ agentId, date });
    setSelectedPopoverTemplateId(siteStandardShifts[0]?.id ?? null);
    setShowTemplatePopover(true);

    // Store context for creation
    window.__shiftContext = { agentId, date };
  };

  const handleEditShift = (shift: AgentShift) => {
    if (isShiftInPast(shift)) return;
    setEditingShift(shift);
    setShiftForm({
      shiftType: shift.shiftType,
      standardShiftId: shift.standardShiftId || "",
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      color: shift.color || "#3b82f6",
      notes: shift.notes || "",
      isOvernight: isOvernightShift(shift.startTime, shift.endTime),
    });
    setShowShiftModal(true);
  };

  const handleDeleteShift = (shiftId: string) => {
    const shift = agentShifts.find((s) => s.id === shiftId);
    if (shift && isShiftInPast(shift)) return;
    setAgentShifts(agentShifts.filter((s) => s.id !== shiftId));
  };

  const handleSelectTemplateFromPopover = (templateId: string) => {
    const template = siteStandardShifts.find((t) => t.id === templateId);
    if (!template || !templatePopoverContext) return;

    const { agentId, date } = templatePopoverContext;
    const newShift: AgentShift = {
      id: generateShiftId(),
      agentId,
      siteId: selectedSiteId!,
      date,
      shiftType: "standard",
      standardShiftId: templateId,
      startTime: template.startTime,
      endTime: template.endTime,
      breakDuration: template.breakDuration,
      color: template.color,
      notes: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setAgentShifts((prev) => [...prev, newShift]);
    setShowTemplatePopover(false);
    setTemplatePopoverContext(null);
    setSelectedPopoverTemplateId(null);
  };

  const handleOpenCustomShiftFromPopover = () => {
    if (!templatePopoverContext) return;
    const { agentId, date } = templatePopoverContext;
    window.__shiftContext = { agentId, date };

    const baseTemplate = selectedPopoverTemplateId
      ? siteStandardShifts.find((t) => t.id === selectedPopoverTemplateId)
      : null;

    setShowTemplatePopover(false);
    setSelectedPopoverTemplateId(null);
    setShiftForm({
      shiftType: "on_demand",
      standardShiftId: "",
      startTime: baseTemplate?.startTime ?? "08:00",
      endTime: baseTemplate?.endTime ?? "16:00",
      breakDuration: baseTemplate?.breakDuration ?? 30,
      color: baseTemplate?.color ?? "#3b82f6",
      notes: "",
      isOvernight: false,
    });
    setShowShiftModal(true);
  };

  const handleSaveShift = () => {
    if (editingShift) {
      // Update existing shift
      const updatedShift: AgentShift = {
        ...editingShift,
        shiftType: shiftForm.shiftType,
        standardShiftId:
          shiftForm.shiftType === "standard"
            ? shiftForm.standardShiftId
            : undefined,
        startTime: shiftForm.startTime,
        endTime: shiftForm.endTime,
        breakDuration: shiftForm.breakDuration,
        color: shiftForm.color,
        notes: shiftForm.notes,
        updatedAt: new Date(),
      };
      setAgentShifts(
        agentShifts.map((s) => (s.id === editingShift.id ? updatedShift : s)),
      );
    } else {
      // Create new shift
      const context = window.__shiftContext;
      if (!context || !selectedSiteId) return;

      let startTime = shiftForm.startTime;
      let endTime = shiftForm.endTime;
      let color = shiftForm.color;

      if (shiftForm.shiftType === "standard") {
        const template = siteStandardShifts.find(
          (t) => t.id === shiftForm.standardShiftId,
        );
        if (template) {
          startTime = template.startTime;
          endTime = template.endTime;
          color = template.color;
        }
      }

      const newShift: AgentShift = {
        id: `shift-${Date.now()}`,
        agentId: context.agentId,
        siteId: selectedSiteId,
        date: context.date,
        shiftType: shiftForm.shiftType,
        standardShiftId:
          shiftForm.shiftType === "standard"
            ? shiftForm.standardShiftId
            : undefined,
        startTime,
        endTime,
        breakDuration: shiftForm.breakDuration,
        color,
        notes: shiftForm.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setAgentShifts([...agentShifts, newShift]);
    }
    setShowShiftModal(false);
    setEditingShift(null);
  };

  const handleSaveAsTemplate = () => {
    if (!selectedSiteId) return;
    const newTemplate: StandardShift = {
      id: `std-${Date.now()}`,
      siteId: selectedSiteId,
      name: templateForm.name,
      startTime: templateForm.startTime,
      endTime: templateForm.endTime,
      breakDuration: templateForm.breakDuration,
      color: templateForm.color,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setStandardShifts([...standardShifts, newTemplate]);
    setShowTemplateModal(false);
    setTemplateForm({
      name: "",
      startTime: "08:00",
      endTime: "16:00",
      breakDuration: 30,
      color: "#3b82f6",
    });
  };

  // Copy/paste
  const handleCopyShift = (shift: AgentShift) => {
    if (isShiftInPast(shift)) return;
    setCopiedShift(shift);
    setCopiedWeekDates(null);
    setCopiedWeekAgentId(null);
  };

  const handlePasteShift = (
    agentId: string,
    date: string,
    forceOverride: boolean = false,
  ) => {
    if (!copiedShift || isDateInPast(date)) return;

    const conflict = getDateConflict(agentId, date);
    if (conflict?.type === "time_off") return;

    if (conflict?.type === "double_booking" && !forceOverride) {
      setPendingPasteAction({ type: "shift", agentId, dates: [date] });
      setShowOverrideModal(true);
      return;
    }

    const existingShift = agentShifts.find(
      (s) =>
        s.agentId === agentId && s.date === date && s.siteId === selectedSiteId,
    );
    if (existingShift) {
      setAgentShifts(agentShifts.filter((s) => s.id !== existingShift.id));
    }

    const newShift: AgentShift = {
      ...copiedShift,
      id: `shift-${Date.now()}-${Math.random()}`,
      agentId,
      date,
      siteId: selectedSiteId!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAgentShifts([...agentShifts, newShift]);
  };

  const handleCopyWeek = (agentId: string, dates: string[]) => {
    setCopiedWeekDates(dates);
    setCopiedWeekAgentId(agentId);
    setCopiedShift(null);
  };

  const handlePasteWeekForAgent = (
    agentId: string,
    targetDates: string[],
    forceOverride: boolean = false,
  ) => {
    if (!copiedWeekDates || !copiedWeekAgentId || !selectedSiteId) return;

    // Check if agent's week is empty
    const hasExistingShifts = targetDates.some((date) => {
      if (isDateInPast(date)) return false;
      return agentShifts.some(
        (s) =>
          s.agentId === agentId &&
          s.date === date &&
          s.siteId === selectedSiteId,
      );
    });

    if (hasExistingShifts) return;

    // Check for time-off conflicts - these cannot be overridden
    const timeOffDates = targetDates.filter((date) => {
      if (isDateInPast(date)) return false;
      return hasTimeOff(agentId, date);
    });

    if (timeOffDates.length > 0) return;

    // Check for double booking conflicts
    const hasDoubleBooking = targetDates.some((date) => {
      if (isDateInPast(date)) return false;
      return hasShiftAtOtherSite(agentId, date, selectedSiteId);
    });

    if (hasDoubleBooking && !forceOverride) {
      setPendingPasteAction({ type: "week", agentId, dates: targetDates });
      setShowOverrideModal(true);
      return;
    }

    // Perform paste
    const sourceShifts = copiedWeekDates.map((date) =>
      agentShifts.find(
        (s) =>
          s.agentId === copiedWeekAgentId &&
          s.date === date &&
          s.siteId === selectedSiteId,
      ),
    );

    const newShifts: AgentShift[] = [];
    targetDates.forEach((targetDate, idx) => {
      if (isDateInPast(targetDate)) return;
      const sourceShift = sourceShifts[idx];
      if (!sourceShift) return;

      newShifts.push({
        ...sourceShift,
        id: `shift-${Date.now()}-${Math.random()}`,
        agentId,
        date: targetDate,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    setAgentShifts([...agentShifts, ...newShifts]);
  };

  const handleDeleteWeekForAgent = (agentId: string, dates: string[]) => {
    setAgentShifts(
      agentShifts.filter(
        (s) =>
          !(
            s.agentId === agentId &&
            dates.includes(s.date) &&
            s.siteId === selectedSiteId &&
            !isShiftInPast(s)
          ),
      ),
    );
  };

  const handleConflictClick = (agentId: string, date: string) => {
    const conflict = getDateConflict(agentId, date);
    if (conflict) {
      setConflictDetails({ agentId, date, conflict });
      setShowConflictModal(true);
    }
  };

  const handleRemoveConflictingShift = () => {
    if (!conflictDetails) return;
    const shift = agentShifts.find(
      (s) =>
        s.agentId === conflictDetails.agentId &&
        s.date === conflictDetails.date &&
        s.siteId === selectedSiteId,
    );
    if (shift) {
      handleDeleteShift(shift.id);
    }
    setShowConflictModal(false);
    setConflictDetails(null);
  };

  const handleOverrideConfirm = () => {
    if (!pendingPasteAction) return;

    if (pendingPasteAction.type === "shift") {
      handlePasteShift(
        pendingPasteAction.agentId,
        pendingPasteAction.dates[0],
        true,
      );
    } else if (pendingPasteAction.type === "week") {
      handlePasteWeekForAgent(
        pendingPasteAction.agentId,
        pendingPasteAction.dates,
        true,
      );
    }

    setPendingPasteAction(null);
    setShowOverrideModal(false);
  };

  // Group dates into weeks for monthly view
  const weekGroups = useMemo(() => {
    if (viewType !== "monthly") return [];
    const weeks: { dates: Date[]; startIdx: number }[] = [];
    let currentWeek: Date[] = [];
    let weekStartIdx = 0;

    displayDates.forEach((date, idx) => {
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 1 && currentWeek.length > 0) {
        weeks.push({ dates: currentWeek, startIdx: weekStartIdx });
        currentWeek = [];
        weekStartIdx = idx;
      }
      currentWeek.push(date);
    });

    if (currentWeek.length > 0) {
      weeks.push({ dates: currentWeek, startIdx: weekStartIdx });
    }

    return weeks;
  }, [displayDates, viewType]);

  // Main schedule view
  if (!selectedSiteId || !selectedClientId) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Planning par site
              </CardTitle>
              <CardDescription>Chargement...</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }

  const totalPlannedHours = assignedAgents.reduce(
    (sum, { agentId }) => sum + calculateAgentHours(agentId, displayDates),
    0,
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <Card className="border-border/40">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-center gap-6">
            {/* Title */}
            <div className="shrink-0">
              <h1 className="text-2xl font-bold">Planning</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {assignedAgents.length} agent(s) •{" "}
                {totalPlannedHours.toFixed(1)}h planifiées
              </p>
            </div>

            <div className="h-10 w-px bg-border shrink-0" />

            {/* Client selector */}
            <button
              onClick={() => setShowClientSelector(true)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left group min-w-0"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Client</div>
                <div className="font-medium text-sm truncate group-hover:text-primary transition-colors">
                  {selectedClient?.name || (
                    <span className="text-muted-foreground">Sélectionner…</span>
                  )}
                </div>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>

            <div className="h-10 w-px bg-border shrink-0" />

            {/* Site selector */}
            <button
              onClick={() => setShowSiteSelector(true)}
              disabled={!selectedClientId}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/60 transition-colors text-left group min-w-0 disabled:opacity-50 disabled:pointer-events-none flex-1"
            >
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs text-muted-foreground">Site</div>
                {selectedSite ? (
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-lg leading-tight truncate">
                      {selectedSite.name}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {selectedSite.address.city}
                    </span>
                  </div>
                ) : (
                  <div className="font-medium text-sm text-muted-foreground">
                    Sélectionner…
                  </div>
                )}
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Client Selector Dialog */}
      <Dialog open={showClientSelector} onOpenChange={setShowClientSelector}>
        <DialogContent className="max-w-lg max-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              Sélectionner un client
            </DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Rechercher un client..." />
            <CommandList>
              <CommandEmpty>Aucun client trouvé.</CommandEmpty>
              <CommandGroup>
                {mockClients.map((client) => {
                  const clientSiteCount = mockSites.filter(
                    (s) => s.clientId === client.id && s.status === "active",
                  ).length;
                  const isSelected = client.id === selectedClientId;
                  return (
                    <CommandItem
                      key={client.id}
                      onSelect={() => {
                        setSelectedClientId(client.id);
                        setShowClientSelector(false);
                        const clientSites = mockSites.filter(
                          (s) =>
                            s.clientId === client.id && s.status === "active",
                        );
                        if (clientSites.length > 0) {
                          setSelectedSiteId(clientSites[0].id);
                        } else {
                          setSelectedSiteId(null);
                        }
                      }}
                      className="flex items-center gap-3 py-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <Building2 className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium">{client.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {client.city && `${client.city} • `}
                          {clientSiteCount} site{clientSiteCount > 1 ? "s" : ""}
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          Actuel
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Site Selector Dialog */}
      <Dialog open={showSiteSelector} onOpenChange={setShowSiteSelector}>
        <DialogContent className="max-w-lg max-h-[70vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              Sélectionner un site
            </DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Rechercher un site..." />
            <CommandList>
              <CommandEmpty>Aucun site trouvé.</CommandEmpty>
              <CommandGroup>
                {availableSites.map((site) => {
                  const siteAgentCount = siteAgents.filter(
                    (sa) => sa.siteId === site.id && sa.active,
                  ).length;
                  const isSelected = site.id === selectedSiteId;
                  return (
                    <CommandItem
                      key={site.id}
                      onSelect={() => {
                        setSelectedSiteId(site.id);
                        setShowSiteSelector(false);
                      }}
                      className="flex items-center gap-3 py-3"
                    >
                      <div
                        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                      >
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{site.name}</span>
                          <Badge
                            variant={
                              site.status === "active"
                                ? "default"
                                : site.status === "inactive"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {site.status === "active"
                              ? "Actif"
                              : site.status === "inactive"
                                ? "Inactif"
                                : "Suspendu"}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {site.address.city} • {site.address.postalCode}
                          {siteAgentCount > 0 &&
                            ` • ${siteAgentCount} agent(s)`}
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="secondary" className="text-xs shrink-0">
                          Actuel
                        </Badge>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Legend & Copied info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Congé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Double affectation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Terminé</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm">En attente</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAgentCommand(true)}
              className="shrink-0 bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Assigner un agent
            </Button>

            {copiedShift && (
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5">
                <Badge
                  variant="secondary"
                  className="gap-2 bg-cyan-500/20 text-cyan-700 border-cyan-500/30"
                >
                  <Clipboard className="h-3 w-3" />
                  Mode copie — {copiedShift.startTime} - {copiedShift.endTime}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setEditingShift(copiedShift);
                    setShiftForm({
                      shiftType: copiedShift.shiftType,
                      standardShiftId: copiedShift.standardShiftId || "",
                      startTime: copiedShift.startTime,
                      endTime: copiedShift.endTime,
                      breakDuration: copiedShift.breakDuration,
                      color: copiedShift.color || "#3b82f6",
                      notes: copiedShift.notes || "",
                      isOvernight: isOvernightShift(
                        copiedShift.startTime,
                        copiedShift.endTime,
                      ),
                    });
                    setShowShiftModal(true);
                  }}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Modifier
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setCopiedShift(null)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}

            {copiedWeekDates && (
              <div className="flex items-center gap-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg px-3 py-1.5">
                <Badge
                  variant="secondary"
                  className="gap-2 bg-cyan-500/20 text-cyan-700 border-cyan-500/30"
                >
                  <Clipboard className="h-3 w-3" />
                  Mode copie — Semaine copiée
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setCopiedWeekDates(null);
                    setCopiedWeekAgentId(null);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* View controls */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="min-w-50 text-center font-medium">
                {viewType === "daily" &&
                  currentDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                {viewType === "weekly" && (
                  <>
                    Semaine du{" "}
                    {displayDates[0]?.toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                    })}
                  </>
                )}
                {viewType === "monthly" &&
                  currentDate.toLocaleDateString("fr-FR", {
                    month: "long",
                    year: "numeric",
                  })}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentDate(new Date())}
              >
                Aujourd&apos;hui
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewType === "daily" ? "default" : "outline"}
                onClick={() => setViewType("daily")}
              >
                Jour
              </Button>
              <Button
                variant={viewType === "weekly" ? "default" : "outline"}
                onClick={() => setViewType("weekly")}
              >
                Semaine
              </Button>
              <Button
                variant={viewType === "monthly" ? "default" : "outline"}
                onClick={() => setViewType("monthly")}
              >
                Mois
              </Button>

              <div className="h-6 w-px bg-border shrink-0" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Download className="h-4 w-4" />
                    Export PDF
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => window.print()}>
                    <FileText className="h-4 w-4 mr-2" />
                    Planning global
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Users className="h-4 w-4 mr-2" />
                    Par agent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Par site
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => window.print()}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Par client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Grid */}
      <Card>
        <CardContent className="pt-6">
          {viewType === "daily" && (
            <DailyView
              date={displayDates[0]}
              agents={assignedAgents}
              shifts={agentShifts.filter((s) => s.siteId === selectedSiteId)}
              copiedShift={copiedShift}
              onCreateShift={handleCreateShift}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onCopyShift={handleCopyShift}
              onPasteShift={handlePasteShift}
              onConflictClick={handleConflictClick}
              getDateConflict={getDateConflict}
              getOvernightShift={getOvernightShiftForDate}
              calculateAgentHours={calculateAgentHours}
              onRemoveAgent={handleRemoveAgent}
              onAssignAgent={() => setShowAgentCommand(true)}
              isClosedDay={isClosedDay}
              maxDailyWorkHours={settings.maxDailyWorkHours}
            />
          )}

          {viewType === "weekly" && (
            <WeeklyView
              dates={displayDates}
              agents={assignedAgents}
              shifts={agentShifts.filter((s) => s.siteId === selectedSiteId)}
              copiedShift={copiedShift}
              copiedWeekDates={copiedWeekDates}
              copiedWeekAgentId={copiedWeekAgentId}
              onCreateShift={handleCreateShift}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onCopyShift={handleCopyShift}
              onPasteShift={handlePasteShift}
              onCopyWeek={handleCopyWeek}
              onPasteWeek={handlePasteWeekForAgent}
              onDeleteWeek={handleDeleteWeekForAgent}
              onConflictClick={handleConflictClick}
              getDateConflict={getDateConflict}
              calculateAgentHours={calculateAgentHours}
              onAssignAgent={() => setShowAgentCommand(true)}
              isClosedDay={isClosedDay}
              maxWeeklyWorkHours={settings.maxWeeklyWorkHours}
              selectedSiteId={selectedSiteId}
            />
          )}

          {viewType === "monthly" && (
            <MonthlyView
              dates={displayDates}
              weekGroups={weekGroups}
              agents={assignedAgents}
              shifts={agentShifts.filter((s) => s.siteId === selectedSiteId)}
              copiedShift={copiedShift}
              copiedWeekDates={copiedWeekDates}
              copiedWeekAgentId={copiedWeekAgentId}
              onCreateShift={handleCreateShift}
              onEditShift={handleEditShift}
              onDeleteShift={handleDeleteShift}
              onCopyShift={handleCopyShift}
              onPasteShift={handlePasteShift}
              onCopyWeek={handleCopyWeek}
              onPasteWeek={handlePasteWeekForAgent}
              onDeleteWeek={handleDeleteWeekForAgent}
              onConflictClick={handleConflictClick}
              getDateConflict={getDateConflict}
              calculateAgentHours={calculateAgentHours}
              isClosedDay={isClosedDay}
              maxWeeklyWorkHours={settings.maxWeeklyWorkHours}
            />
          )}
        </CardContent>
      </Card>

      {/* Compact Shift Template Popover */}
      <Dialog open={showTemplatePopover} onOpenChange={setShowTemplatePopover}>
        <DialogContent className="max-w-xs p-0 overflow-hidden">
          <DialogHeader className="sr-only">
            <DialogTitle>Ajouter un Shift</DialogTitle>
          </DialogHeader>
          <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
            <span className="text-sm font-medium">Ajouter un Shift</span>
          </div>
          <Tabs defaultValue="standard" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-none border-b h-9">
              <TabsTrigger value="standard" className="text-xs rounded-none">
                Modèle
              </TabsTrigger>
              <TabsTrigger value="on_demand" className="text-xs rounded-none">
                Personnalisé
              </TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="m-0">
              {/* Weekday selector */}
              {templatePopoverContext &&
                (() => {
                  const d = new Date(templatePopoverContext.date + "T00:00:00");
                  const dayIdx = d.getDay() === 0 ? 6 : d.getDay() - 1;
                  const dayLabels = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];
                  return (
                    <div className="flex justify-center gap-1 px-3 pt-3 pb-1">
                      {dayLabels.map((label, i) => (
                        <div
                          key={i}
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                            i === dayIdx
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {label}
                        </div>
                      ))}
                    </div>
                  );
                })()}

              <div className="p-3 space-y-2 max-h-72 overflow-y-auto">
                {siteStandardShifts.length === 0 ? (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    Aucun modèle disponible
                  </p>
                ) : (
                  siteStandardShifts.map((template) => (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() =>
                        handleSelectTemplateFromPopover(template.id)
                      }
                      onMouseEnter={() =>
                        setSelectedPopoverTemplateId(template.id)
                      }
                      className={`w-full text-left rounded-lg p-3 text-white font-medium text-sm transition-all ring-2 ${
                        selectedPopoverTemplateId === template.id
                          ? "ring-white/80 scale-[1.02] shadow-lg"
                          : "ring-transparent hover:opacity-90"
                      }`}
                      style={{ backgroundColor: template.color }}
                    >
                      <div className="font-semibold">
                        {template.startTime} - {template.endTime}
                      </div>
                      <div className="text-xs opacity-80 mt-0.5">
                        ▶ {template.name}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="on_demand" className="m-0 p-3 space-y-3">
              {selectedPopoverTemplateId ? (
                (() => {
                  const base = siteStandardShifts.find(
                    (t) => t.id === selectedPopoverTemplateId,
                  );
                  return base ? (
                    <div
                      className="rounded-lg p-3 text-white text-sm"
                      style={{ backgroundColor: base.color }}
                    >
                      <div className="text-xs opacity-70 mb-0.5">
                        Base sélectionnée
                      </div>
                      <div className="font-semibold">
                        {base.startTime} - {base.endTime}
                      </div>
                      <div className="text-xs opacity-80">
                        ▶ {base.name} • {base.breakDuration}min pause
                      </div>
                    </div>
                  ) : null;
                })()
              ) : (
                <p className="text-xs text-muted-foreground">
                  Sélectionnez un modèle dans l&apos;onglet Modèle pour
                  l&apos;utiliser comme base, ou créez depuis zéro.
                </p>
              )}
              <Button
                className="w-full"
                size="sm"
                onClick={handleOpenCustomShiftFromPopover}
              >
                <Plus className="h-4 w-4 mr-2" />
                {selectedPopoverTemplateId
                  ? "Personnaliser ce modèle"
                  : "Créer depuis zéro"}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Agent Command Palette */}
      <Dialog open={showAgentCommand} onOpenChange={setShowAgentCommand}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Assigner un agent</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput placeholder="Rechercher un agent..." />
            <CommandList>
              <CommandEmpty>Aucun agent disponible.</CommandEmpty>
              <CommandGroup>
                {availableAgents.map((agent) => (
                  <CommandItem
                    key={agent.id}
                    onSelect={() => handleAssignAgent(agent.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <Users className="h-5 w-5 mt-1 shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{agent.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {agent.qualifications.slice(0, 3).join(", ")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {agent.weeklyHours}h/semaine • {agent.contractType}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>

      {/* Shift Modal */}
      <Modal
        open={showShiftModal}
        onOpenChange={setShowShiftModal}
        type="form"
        title={editingShift ? "Modifier le service" : "Créer un service"}
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setShowShiftModal(false),
            variant: "outline",
          },
          primary: {
            label: editingShift ? "Enregistrer" : "Créer",
            onClick: handleSaveShift,
          },
          ...(shiftForm.shiftType === "on_demand" && !editingShift
            ? {
                tertiary: {
                  label: "Enregistrer comme modèle",
                  onClick: () => setShowTemplateModal(true),
                  variant: "outline" as const,
                },
              }
            : {}),
        }}
      >
        <div className="space-y-4">
          <Tabs
            value={shiftForm.shiftType}
            onValueChange={(v) =>
              setShiftForm({
                ...shiftForm,
                shiftType: v as "standard" | "on_demand",
              })
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="standard">Modèle</TabsTrigger>
              <TabsTrigger value="on_demand">Personnalisé</TabsTrigger>
            </TabsList>

            <TabsContent value="standard" className="space-y-4">
              <div>
                <Label className="text-base font-semibold">
                  Sélectionner un modèle de service
                </Label>
                <div className="grid gap-3 mt-3">
                  {siteStandardShifts.map((template) => {
                    const length = calculateShiftLength(
                      template.startTime,
                      template.endTime,
                      template.breakDuration,
                    );
                    return (
                      <button
                        key={template.id}
                        type="button"
                        onClick={() =>
                          setShiftForm({
                            ...shiftForm,
                            standardShiftId: template.id,
                            startTime: template.startTime,
                            endTime: template.endTime,
                            breakDuration: template.breakDuration,
                            color: template.color,
                          })
                        }
                        className={`flex items-center gap-4 p-4 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                          shiftForm.standardShiftId === template.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "hover:border-primary/50"
                        }`}
                      >
                        <div
                          className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-white font-bold text-lg shadow-sm"
                          style={{ backgroundColor: template.color }}
                        >
                          {template.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-base mb-1">
                            {template.name}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge
                              variant="secondary"
                              className="gap-1 font-medium"
                            >
                              <Clock className="h-3 w-3" />
                              {template.startTime} - {template.endTime}
                              {isOvernightShift(
                                template.startTime,
                                template.endTime,
                              ) && <Moon className="h-3 w-3 ml-1" />}
                            </Badge>
                            <Badge variant="outline" className="gap-1">
                              Pause: {template.breakDuration}min
                            </Badge>
                            <Badge variant="default" className="gap-1">
                              {length}
                            </Badge>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {editingShift?.shiftType === "on_demand" && (
                <Button
                  variant="outline"
                  onClick={() =>
                    setShiftForm({
                      ...shiftForm,
                      shiftType: "on_demand",
                    })
                  }
                  className="w-full"
                >
                  Convertir en personnalisé
                </Button>
              )}
            </TabsContent>

            <TabsContent value="on_demand" className="space-y-5">
              {/* Shift Preview Card */}
              <div className="relative">
                <Label className="text-base font-semibold mb-3 block">
                  Aperçu du créneau
                </Label>
                <div
                  className="relative h-24 rounded-lg border-l-4 p-4 shadow-sm overflow-hidden"
                  style={{
                    backgroundColor: shiftForm.color,
                    borderLeftColor: shiftForm.color,
                  }}
                >
                  <div className="flex items-start justify-between gap-2 relative z-10">
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                        {isOvernightShift(
                          shiftForm.startTime,
                          shiftForm.endTime,
                        ) && <Moon className="h-4 w-4" />}
                        {shiftForm.startTime || "00:00"} -{" "}
                        {shiftForm.endTime || "00:00"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="secondary"
                          className="text-xs h-5 bg-white/20 text-white border-0"
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          {calculateShiftLength(
                            shiftForm.startTime,
                            shiftForm.endTime,
                            shiftForm.breakDuration,
                          )}
                        </Badge>
                        {shiftForm.breakDuration > 0 && (
                          <span className="text-xs text-white/80">
                            Pause: {shiftForm.breakDuration}min
                          </span>
                        )}
                      </div>
                      {shiftForm.notes && (
                        <div className="text-xs text-white/80 mt-1 truncate">
                          {shiftForm.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  {(() => {
                    const [startH] = shiftForm.startTime.split(":").map(Number);
                    const [endH] = shiftForm.endTime.split(":").map(Number);
                    let mins = endH * 60 - startH * 60;
                    if (mins < 0) mins += 24 * 60;
                    mins -= shiftForm.breakDuration;
                    if (mins > 12 * 60) {
                      return (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge
                            variant="secondary"
                            className="bg-orange-500 text-white border-0 gap-1"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            +12h
                          </Badge>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {/* Time Inputs */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Horaires
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm mb-2 block">Début</Label>
                    <Input
                      type="time"
                      value={shiftForm.startTime}
                      onChange={(e) =>
                        setShiftForm({
                          ...shiftForm,
                          startTime: e.target.value,
                        })
                      }
                      className="text-base"
                    />
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">Fin</Label>
                    <Input
                      type="time"
                      value={shiftForm.endTime}
                      onChange={(e) =>
                        setShiftForm({ ...shiftForm, endTime: e.target.value })
                      }
                      className="text-base"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-3 p-3 bg-muted rounded-lg">
                  <input
                    type="checkbox"
                    id="overnight"
                    checked={shiftForm.isOvernight}
                    onChange={(e) =>
                      setShiftForm({
                        ...shiftForm,
                        isOvernight: e.target.checked,
                      })
                    }
                    className="rounded h-4 w-4"
                  />
                  <Label
                    htmlFor="overnight"
                    className="text-sm cursor-pointer flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Service de nuit (se termine le jour suivant)
                  </Label>
                </div>
              </div>

              {/* Break Duration */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Durée de pause
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {[0, 15, 30, 45, 60].map((min) => (
                    <Button
                      key={min}
                      type="button"
                      variant={
                        shiftForm.breakDuration === min ? "default" : "outline"
                      }
                      onClick={() =>
                        setShiftForm({ ...shiftForm, breakDuration: min })
                      }
                      className="flex-1 min-w-20"
                    >
                      {min === 0 ? "Aucune" : `${min}min`}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Couleur du créneau
                </Label>
                <div className="flex gap-3 flex-wrap">
                  {[
                    "#3b82f6",
                    "#f59e0b",
                    "#8b5cf6",
                    "#10b981",
                    "#ef4444",
                    "#ec4899",
                    "#06b6d4",
                  ].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setShiftForm({ ...shiftForm, color })}
                      className={`w-12 h-12 rounded-lg border-2 transition-all hover:scale-110 ${
                        shiftForm.color === color
                          ? "border-foreground scale-110 shadow-md"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Notes (optionnel)
                </Label>
                <Input
                  value={shiftForm.notes}
                  onChange={(e) =>
                    setShiftForm({ ...shiftForm, notes: e.target.value })
                  }
                  placeholder="Ajouter des notes sur ce créneau..."
                  className="text-base"
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Modal>

      {/* Template Modal */}
      <Modal
        open={showTemplateModal}
        onOpenChange={setShowTemplateModal}
        type="form"
        title="Enregistrer comme modèle"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setShowTemplateModal(false),
            variant: "outline",
          },
          primary: {
            label: "Enregistrer",
            onClick: handleSaveAsTemplate,
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label>Nom du modèle</Label>
            <Input
              value={templateForm.name}
              onChange={(e) =>
                setTemplateForm({ ...templateForm, name: e.target.value })
              }
              placeholder="Ex: Matin, Après-midi, Nuit..."
            />
          </div>
          <div className="p-3 bg-muted rounded-lg text-sm">
            <div>
              Horaires: {shiftForm.startTime} - {shiftForm.endTime}
            </div>
            <div>Pause: {shiftForm.breakDuration} min</div>
            <div>
              Durée:{" "}
              {calculateShiftLength(
                shiftForm.startTime,
                shiftForm.endTime,
                shiftForm.breakDuration,
              )}
            </div>
          </div>
        </div>
      </Modal>

      {/* Conflict Modal */}
      <Modal
        open={showConflictModal}
        onOpenChange={setShowConflictModal}
        type="warning"
        title="Conflit détecté"
        actions={
          conflictDetails?.conflict.type === "time_off"
            ? {
                primary: {
                  label: "Fermer",
                  onClick: () => setShowConflictModal(false),
                },
              }
            : {
                tertiary: {
                  label: "Supprimer de l'autre site",
                  onClick: () => {
                    if (!conflictDetails?.conflict.details) return;
                    const conflictingShift = conflictDetails.conflict
                      .details as AgentShift;
                    if (
                      conflictDetails.conflict.type === "double_booking" &&
                      conflictingShift.id
                    ) {
                      handleDeleteShift(conflictingShift.id);
                    }
                    setShowConflictModal(false);
                    setConflictDetails(null);
                  },
                  variant: "outline",
                },
                secondary: {
                  label: "Garder ici",
                  onClick: () => setShowConflictModal(false),
                  variant: "outline",
                },
                primary: {
                  label: "Supprimer d'ici",
                  onClick: handleRemoveConflictingShift,
                  variant: "destructive",
                },
              }
        }
      >
        {conflictDetails && (
          <div className="space-y-4">
            {/* Agent and Date Info */}
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Users className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">
                  {
                    mockPlanningAgents.find(
                      (a) => a.id === conflictDetails.agentId,
                    )?.name
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(conflictDetails.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
            </div>

            {/* Conflict Details */}
            <div className="space-y-3">
              <div
                className={`flex items-start gap-3 p-4 rounded-lg border-2 ${
                  conflictDetails.conflict.severity === "high"
                    ? "bg-red-50 border-red-400"
                    : "bg-yellow-50 border-yellow-400"
                }`}
              >
                <div
                  className={`p-2 rounded-full shrink-0 ${
                    conflictDetails.conflict.severity === "high"
                      ? "bg-red-600"
                      : "bg-yellow-600"
                  }`}
                >
                  {conflictDetails.conflict.type === "time_off" ? (
                    <Ban className="h-5 w-5 text-white" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-base mb-2 text-gray-900">
                    {conflictDetails.conflict.message}
                  </div>

                  {/* Time Off Details */}
                  {conflictDetails.conflict.type === "time_off" &&
                    conflictDetails.conflict.details && (
                      <div className="space-y-2 text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-white font-semibold text-gray-900 border border-gray-300"
                          >
                            {
                              (
                                conflictDetails.conflict
                                  .details as TimeOffRequest
                              ).type
                            }
                          </Badge>
                          <Badge
                            variant="secondary"
                            className="bg-white font-semibold text-gray-900 border border-gray-300"
                          >
                            {
                              (
                                conflictDetails.conflict
                                  .details as TimeOffRequest
                              ).totalDays
                            }{" "}
                            jour
                            {(
                              conflictDetails.conflict.details as TimeOffRequest
                            ).totalDays > 1
                              ? "s"
                              : ""}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 font-semibold text-gray-900">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Du{" "}
                            {new Date(
                              (
                                conflictDetails.conflict
                                  .details as TimeOffRequest
                              ).startDate,
                            ).toLocaleDateString("fr-FR")}{" "}
                            au{" "}
                            {new Date(
                              (
                                conflictDetails.conflict
                                  .details as TimeOffRequest
                              ).endDate,
                            ).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        {(conflictDetails.conflict.details as TimeOffRequest)
                          .reason && (
                          <div className="mt-2 p-3 bg-white rounded border border-gray-300">
                            <div className="font-bold text-gray-900 mb-1">
                              Raison:
                            </div>
                            <div className="text-gray-900">
                              {
                                (
                                  conflictDetails.conflict
                                    .details as TimeOffRequest
                                ).reason
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  {/* Double Booking Details */}
                  {conflictDetails.conflict.type === "double_booking" &&
                    conflictDetails.conflict.details && (
                      <div className="space-y-2 text-sm text-gray-900">
                        <div className="flex items-center gap-2 font-semibold">
                          <Clock className="h-4 w-4" />
                          <span className="font-bold">
                            {
                              (conflictDetails.conflict.details as AgentShift)
                                .startTime
                            }{" "}
                            -{" "}
                            {
                              (conflictDetails.conflict.details as AgentShift)
                                .endTime
                            }
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-semibold">
                          <MapPin className="h-4 w-4" />
                          <span>
                            {
                              mockSites.find(
                                (s) =>
                                  s.id ===
                                  (
                                    conflictDetails.conflict
                                      .details as AgentShift
                                  ).siteId,
                              )?.name
                            }
                          </span>
                        </div>
                        {(conflictDetails.conflict.details as AgentShift)
                          .notes && (
                          <div className="mt-2 p-3 bg-white rounded border border-gray-300">
                            <div className="font-bold text-gray-900 mb-1">
                              Notes:
                            </div>
                            <div className="text-gray-900">
                              {
                                (conflictDetails.conflict.details as AgentShift)
                                  .notes
                              }
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Override Confirmation Modal */}
      <Modal
        open={showOverrideModal}
        onOpenChange={setShowOverrideModal}
        type="confirmation"
        title="Confirmer l'écrasement"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => {
              setShowOverrideModal(false);
              setPendingPasteAction(null);
            },
            variant: "outline",
          },
          primary: {
            label: "Écraser",
            onClick: handleOverrideConfirm,
          },
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Double affectation détectée</div>
              <div className="text-sm text-muted-foreground mt-1">
                L&apos;agent est déjà affecté à un autre site pour cette
                période. Voulez-vous écraser l&apos;affectation existante ?
              </div>
              <div className="text-sm text-muted-foreground mt-2 p-2 bg-muted rounded">
                <strong>Note:</strong> Les congés approuvés ne peuvent pas être
                écrasés.
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Remove Agent Confirmation */}
      <Modal
        open={showRemoveAgentModal}
        onOpenChange={setShowRemoveAgentModal}
        type="warning"
        title="Retirer l'agent du site"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setShowRemoveAgentModal(false),
            variant: "outline",
          },
          primary: {
            label: "Retirer",
            onClick: confirmRemoveAgent,
            variant: "destructive",
          },
        }}
      >
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <div className="font-medium">Êtes-vous sûr ?</div>
              <div className="text-sm text-muted-foreground mt-1">
                Cette action retirera l&apos;agent du site et supprimera tous
                ses services planifiés pour ce site.
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

// Daily View Component
function DailyView({
  date,
  agents,
  shifts,
  copiedShift,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  onCopyShift,
  onPasteShift,
  onConflictClick,
  getDateConflict,
  getOvernightShift,
  calculateAgentHours,
  onRemoveAgent,
  onAssignAgent,
  isClosedDay,
  maxDailyWorkHours,
}: {
  date: Date;
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  copiedShift: AgentShift | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onDeleteShift: (shiftId: string) => void;
  onCopyShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  onConflictClick: (agentId: string, date: string) => void;
  getDateConflict: (agentId: string, date: string) => DateConflict | null;
  getOvernightShift: (agentId: string, date: string) => AgentShift | null;
  calculateAgentHours: (agentId: string, dates: Date[]) => number;
  onRemoveAgent: (agentId: string) => void;
  onAssignAgent: () => void;
  isClosedDay: (date: Date | string) => boolean;
  maxDailyWorkHours: number;
}) {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const dateStr = formatDate(date);
  const isDateInPast = (d: string) => {
    const check = new Date(d);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  return (
    <div>
      <div className="text-lg font-medium mb-4">
        {date.toLocaleDateString("fr-FR", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </div>

      {/* Timeline header */}
      <div className="flex mb-2">
        <div className="w-56 shrink-0" />
        <div className="flex-1 flex border-b">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex-1 text-center text-xs text-muted-foreground pb-1"
            >
              {i}h
            </div>
          ))}
        </div>
      </div>

      {/* Agent rows */}
      <div className="space-y-3">
        {agents.map(({ agentId, agentName }) => {
          const shift = shifts.find(
            (s) => s.agentId === agentId && s.date === dateStr,
          );
          const overnightShift = getOvernightShift(agentId, dateStr);
          const conflict = getDateConflict(agentId, dateStr);
          const isPast = isDateInPast(dateStr);
          const agentHours = calculateAgentHours(agentId, [date]);

          return (
            <div key={agentId} className="flex items-center gap-3">
              <div className="w-56 shrink-0 p-3 bg-muted rounded-lg group relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => onRemoveAgent(agentId)}
                  title="Retirer l'agent"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
                <div className="font-medium text-sm mb-2">{agentName}</div>
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${agentHours > maxDailyWorkHours ? "bg-destructive/10" : "bg-primary/10"}`}
                >
                  <Clock
                    className={`h-4 w-4 ${agentHours > maxDailyWorkHours ? "text-destructive" : "text-primary"}`}
                  />
                  <span
                    className={`font-bold text-base ${agentHours > maxDailyWorkHours ? "text-destructive" : "text-primary"}`}
                  >
                    {agentHours.toFixed(1)}h
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    aujourd&apos;hui
                  </span>
                </div>
              </div>

              <div className="flex-1 relative h-24 border rounded-lg bg-background">
                {/* 24-hour grid */}
                {Array.from({ length: 24 }, (_, i) => (
                  <div
                    key={i}
                    className="absolute top-0 bottom-0 border-l border-dashed border-muted-foreground/20"
                    style={{ left: `${(i / 24) * 100}%` }}
                  />
                ))}

                {/* Overnight continuation from previous day */}
                {overnightShift && (
                  <div
                    className="absolute top-2 bottom-2 flex flex-col items-start justify-center text-xs font-medium cursor-pointer hover:shadow-md transition-all overflow-hidden"
                    style={{
                      left: "0%",
                      width: `${
                        (parseInt(overnightShift.endTime.split(":")[0]) / 24) *
                        100
                      }%`,
                      backgroundColor: overnightShift.color,
                      color: "#fff",
                      borderRadius: "0 0.5rem 0.5rem 0",
                    }}
                    onClick={() => onEditShift(overnightShift)}
                  >
                    {/* Left edge indicator showing continuation from previous day */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40" />

                    {/* Diagonal stripes pattern for continuation indicator */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-8 opacity-20"
                      style={{
                        background:
                          "repeating-linear-gradient(45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
                      }}
                    />

                    <div className="px-3 flex flex-col gap-1 relative z-10">
                      <div className="font-bold text-sm flex items-center gap-2">
                        <Moon className="h-3.5 w-3.5" />
                        {overnightShift.startTime} - {overnightShift.endTime}
                      </div>
                      <Badge
                        variant="secondary"
                        className="text-xs h-5 bg-white/20 text-white border-0 w-fit"
                      >
                        Nuit précédente
                      </Badge>
                    </div>
                  </div>
                )}

                {/* Current day shift */}
                {shift ? (
                  <ShiftBlock
                    shift={shift}
                    conflict={conflict}
                    isClosed={isClosedDay(dateStr)}
                    onEdit={onEditShift}
                    onDelete={onDeleteShift}
                    onCopy={onCopyShift}
                    onConflictClick={onConflictClick}
                  />
                ) : !isPast ? (
                  conflict?.type === "time_off" ? (
                    <button
                      onClick={() => onConflictClick(agentId, dateStr)}
                      className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors border border-red-200"
                    >
                      <Ban className="h-4 w-4" />
                      <span className="text-sm font-medium">Congé</span>
                    </button>
                  ) : conflict?.type === "double_booking" ? (
                    <button
                      onClick={() => onConflictClick(agentId, dateStr)}
                      disabled
                      className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-300 cursor-not-allowed opacity-75"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Double affectation
                      </span>
                    </button>
                  ) : isClosedDay(dateStr) ? (
                    <button
                      onClick={() =>
                        copiedShift
                          ? onPasteShift(agentId, dateStr)
                          : onCreateShift(agentId, dateStr)
                      }
                      className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors group"
                      title="Jour fermé — cliquer pour forcer l'ajout"
                    >
                      <CalendarOff className="h-4 w-4" />
                      <span className="text-xs">Fermé</span>
                      <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                        Forcer
                      </span>
                    </button>
                  ) : (
                    <button
                      onClick={() =>
                        copiedShift
                          ? onPasteShift(agentId, dateStr)
                          : onCreateShift(agentId, dateStr)
                      }
                      className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg hover:bg-primary/10 transition-colors group border border-dashed border-muted-foreground/30"
                    >
                      {copiedShift ? (
                        <>
                          <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <span className="text-sm text-muted-foreground group-hover:text-primary">
                            Coller
                          </span>
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                          <span className="text-sm text-muted-foreground group-hover:text-primary">
                            Ajouter un Shift
                          </span>
                        </>
                      )}
                    </button>
                  )
                ) : isPast ? (
                  <div className="absolute inset-2 flex items-center justify-center text-sm text-muted-foreground">
                    Date passée
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}

        {/* Add Agent Button */}
        <div className="flex items-center gap-3 mt-2">
          <Button
            variant="outline"
            className="w-56 shrink-0 border-dashed bg-cyan-500 hover:bg-cyan-600 text-white border-cyan-500"
            onClick={onAssignAgent}
          >
            <Plus className="h-4 w-4 mr-2" />
            Assigner un agent
          </Button>
        </div>
      </div>
    </div>
  );
}

// Shift Block Component (for daily timeline)
function ShiftBlock({
  shift,
  conflict,
  isClosed,
  onEdit,
  onDelete,
  onCopy,
  onConflictClick,
}: {
  shift: AgentShift;
  conflict: DateConflict | null;
  isClosed?: boolean;
  onEdit: (shift: AgentShift) => void;
  onDelete: (shiftId: string) => void;
  onCopy: (shift: AgentShift) => void;
  onConflictClick: (agentId: string, date: string) => void;
}) {
  const [startHour, startMin] = shift.startTime.split(":").map(Number);
  const [endHour, endMin] = shift.endTime.split(":").map(Number);

  const startPercent = ((startHour * 60 + startMin) / (24 * 60)) * 100;
  let endPercent = ((endHour * 60 + endMin) / (24 * 60)) * 100;

  if (endPercent <= startPercent) {
    endPercent = 100;
  }

  const widthPercent = endPercent - startPercent;

  // Calculate shift duration
  const calculateDuration = () => {
    let minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    if (minutes < 0) minutes += 24 * 60;
    minutes -= shift.breakDuration;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0
      ? `${hours}h${mins.toString().padStart(2, "0")}`
      : `${hours}h`;
  };

  const isShiftInPast = (s: AgentShift) => {
    const check = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const getShiftCompletionStatus = (s: AgentShift) => {
    if (!isShiftInPast(s)) return null;
    if (s.completed)
      return {
        type: "completed",
        label: "Terminé",
        color: "#10b981",
        icon: CheckCircle,
      };
    if (s.noShow)
      return {
        type: "no_show",
        label: "Absent",
        color: "#ef4444",
        icon: XCircle,
      };
    return {
      type: "pending",
      label: "En attente",
      color: "#f59e0b",
      icon: Timer,
    };
  };

  const isPast = isShiftInPast(shift);
  const completionStatus = getShiftCompletionStatus(shift);
  const duration = calculateDuration();

  // Check if shift is overnight (extends past midnight)
  const isOvernight = endPercent >= 100;
  const continuesNextDay =
    endHour < startHour || (endHour === 0 && endMin === 0 && startHour !== 0);

  return (
    <div
      className={`absolute top-2 bottom-2 border-l-4 flex flex-col p-3 group cursor-pointer shadow-sm hover:shadow-md transition-all overflow-hidden ${
        isPast ? "opacity-80" : ""
      }`}
      style={{
        left: `${startPercent}%`,
        width: `${widthPercent}%`,
        backgroundColor: shift.color,
        borderLeftColor: shift.color,
        borderRadius: isOvernight ? "0.5rem 0 0 0.5rem" : "0.5rem",
      }}
      onClick={() => !isPast && onEdit(shift)}
    >
      {/* Right edge indicator for overnight shifts that continue to next day */}
      {isOvernight && continuesNextDay && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/40" />
          <div
            className="absolute right-0 top-0 bottom-0 w-8 opacity-20"
            style={{
              background:
                "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.3) 4px, rgba(255,255,255,0.3) 8px)",
            }}
          />
        </>
      )}
      {/* Conflict/Warning indicator at top-right corner */}
      {conflict && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onConflictClick(shift.agentId, shift.date);
          }}
          className="absolute -top-1 -right-1 z-10 p-1 bg-white rounded-full shadow-md"
        >
          {conflict.type === "time_off" ? (
            <Ban className="h-4 w-4 text-red-500" />
          ) : (
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          )}
        </button>
      )}
      {/* Closed-day override indicator */}
      {isClosed && !conflict && (
        <div
          className="absolute -top-1 -right-1 z-10 p-1 bg-white rounded-full shadow-md"
          title="Service planifié un jour fermé"
        >
          <Lock className="h-3.5 w-3.5 text-orange-500" />
        </div>
      )}

      {/* Header with time and actions */}
      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate flex items-center gap-2">
            {continuesNextDay && <Moon className="h-3.5 w-3.5 shrink-0" />}
            {shift.startTime} - {shift.endTime}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs h-5 bg-white/20 text-white border-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              {duration}
            </Badge>
            {shift.breakDuration > 0 && (
              <span className="text-xs text-white/80">
                Pause: {shift.breakDuration}min
              </span>
            )}
            {completionStatus && (
              <Badge
                variant="secondary"
                className="text-xs h-5 font-semibold border-0 gap-1"
                style={{
                  backgroundColor: completionStatus.color,
                  color: "#fff",
                }}
              >
                <completionStatus.icon className="h-3 w-3" />
                {completionStatus.label}
              </Badge>
            )}
          </div>
        </div>
        {!isPast && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 hover:bg-white/20 bg-white/10 rounded shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(shift);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onCopy(shift);
                }}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(shift.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Notes */}
      {shift.notes && (
        <div className="text-xs text-white/80 truncate mt-1">{shift.notes}</div>
      )}
    </div>
  );
}

// Weekly View Component
function WeeklyView({
  dates,
  agents,
  shifts,
  copiedShift,
  copiedWeekDates,
  copiedWeekAgentId,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  onCopyShift,
  onPasteShift,
  onCopyWeek,
  onPasteWeek,
  onDeleteWeek,
  onConflictClick,
  getDateConflict,
  calculateAgentHours,
  isClosedDay,
  maxWeeklyWorkHours,
  selectedSiteId,
}: {
  dates: Date[];
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  copiedShift: AgentShift | null;
  copiedWeekDates: string[] | null;
  copiedWeekAgentId: string | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onDeleteShift: (shiftId: string) => void;
  onCopyShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  onCopyWeek: (agentId: string, dates: string[]) => void;
  onPasteWeek: (agentId: string, dates: string[]) => void;
  onDeleteWeek: (agentId: string, dates: string[]) => void;
  onConflictClick: (agentId: string, date: string) => void;
  getDateConflict: (agentId: string, date: string) => DateConflict | null;
  calculateAgentHours: (agentId: string, dates: Date[]) => number;
  onAssignAgent: () => void;
  isClosedDay: (date: Date | string) => boolean;
  maxWeeklyWorkHours: number;
  selectedSiteId: string | null;
}) {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const isDateInPast = (d: string | Date) => {
    const check = typeof d === "string" ? new Date(d) : d;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const weekDates = dates.map(formatDate);
  const showActions = true;
  const sitePostes = useMemo(
    () =>
      selectedSiteId
        ? mockPostes.filter((p) => p.siteId === selectedSiteId)
        : [],
    [selectedSiteId],
  );

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
  };

  const weekNumber = dates.length > 0 ? getWeekNumber(dates[0]) : null;

  const MIN_COL_WIDTH = 100;
  const MIN_TOTAL = 224 + 8 + dates.length * (MIN_COL_WIDTH + 8) + 40;

  return (
    <div className="overflow-x-auto">
      {/* Header with dates as x-axis */}
      <div className="flex mb-4 gap-2" style={{ minWidth: `${MIN_TOTAL}px` }}>
        <div className="w-56 shrink-0 flex items-end pb-1">
          {weekNumber !== null && (
            <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
              S.{weekNumber}
            </span>
          )}
        </div>
        <div className="flex-1 flex gap-2">
          {dates.map((date: Date, idx: number) => {
            return (
              <div
                key={idx}
                className="flex-1 text-center p-3 rounded-lg"
                style={{ minWidth: `${MIN_COL_WIDTH}px` }}
              >
                <div className="text-sm font-medium">
                  {date.toLocaleDateString("fr-FR", { weekday: "short" })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {date.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                  })}
                </div>
              </div>
            );
          })}
          <div className="w-10 shrink-0" />
        </div>
      </div>

      {/* Needs row */}
      {sitePostes.length > 0 && (
        <div
          className="flex items-stretch mb-2 gap-2"
          style={{ minWidth: `${MIN_TOTAL}px` }}
        >
          <div className="w-56 shrink-0 p-2 bg-amber-500/10 rounded-lg flex items-center">
            <span className="text-xs font-semibold text-amber-600">
              📋 Besoins
            </span>
          </div>
          <div className="flex-1 flex gap-2">
            {dates.map((date) => {
              const dateStr = formatDate(date);
              const isClosed = isClosedDay(date);
              const assignedShifts = shifts.filter((s) => s.date === dateStr);
              const totalAssigned = assignedShifts.length;
              const totalNeeded = sitePostes.reduce(
                (sum, p) => sum + (p.capacity?.minAgents ?? 0),
                0,
              );
              const remaining = totalNeeded - totalAssigned;
              return (
                <div
                  key={dateStr}
                  className="flex-1 flex items-center justify-center rounded-lg bg-amber-500/5 border border-amber-200/50"
                  style={{ minWidth: `${MIN_COL_WIDTH}px` }}
                >
                  {isClosed ? (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  ) : totalNeeded > 0 ? (
                    <span
                      className={`text-xs font-medium ${remaining > 0 ? "text-amber-600" : "text-green-600"}`}
                    >
                      {remaining > 0
                        ? `${totalAssigned}/${totalNeeded}`
                        : "✓ Complet"}
                    </span>
                  ) : null}
                </div>
              );
            })}
          </div>
          {dates.length >= 7 && <div className="w-12 shrink-0" />}
        </div>
      )}

      {/* Agent rows */}
      <div className="space-y-3" style={{ minWidth: `${MIN_TOTAL}px` }}>
        {agents.map(({ agentId, agentName }) => {
          const agentHours = calculateAgentHours(agentId, dates);
          const hasAnyShift = weekDates.some((date) =>
            shifts.find((s) => s.agentId === agentId && s.date === date),
          );

          const hasWeekConflicts = weekDates.some((date) => {
            const conflict = getDateConflict(agentId, date);
            return conflict !== null;
          });

          const showWeekPasteBlock =
            copiedWeekDates &&
            copiedWeekAgentId &&
            !hasAnyShift &&
            !hasWeekConflicts &&
            weekDates.every((d) => !isDateInPast(d));

          return (
            <div key={agentId} className="flex items-stretch gap-2">
              <div className="w-56 shrink-0 p-3 bg-muted rounded-lg flex flex-col justify-center">
                <div className="font-medium text-sm mb-2">{agentName}</div>
                <div
                  className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${agentHours > maxWeeklyWorkHours ? "bg-destructive/10" : "bg-primary/10"}`}
                >
                  <Clock
                    className={`h-4 w-4 ${agentHours > maxWeeklyWorkHours ? "text-destructive" : "text-primary"}`}
                  />
                  <span
                    className={`font-bold text-base ${agentHours > maxWeeklyWorkHours ? "text-destructive" : "text-primary"}`}
                  >
                    {agentHours.toFixed(1)}h
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    cette semaine
                  </span>
                </div>
              </div>

              <div className="flex-1 relative flex gap-2">
                {dates.map((date: Date, idx: number) => {
                  const dateStr = formatDate(date);
                  const shift = shifts.find(
                    (s) => s.agentId === agentId && s.date === dateStr,
                  );
                  const conflict = getDateConflict(agentId, dateStr);
                  const isPast = isDateInPast(dateStr);
                  const isClosed = isClosedDay(date);

                  return (
                    <div
                      key={idx}
                      className={`flex-1 border rounded-lg relative overflow-hidden ${
                        isClosed ? "bg-muted/30" : "bg-background"
                      } ${showWeekPasteBlock ? "invisible" : ""}`}
                      style={{
                        minWidth: `${MIN_COL_WIDTH}px`,
                        height: "120px",
                      }}
                    >
                      {shift ? (
                        <ShiftCard
                          shift={shift}
                          isClosed={isClosed}
                          onEdit={onEditShift}
                          onDelete={onDeleteShift}
                          onCopy={onCopyShift}
                        />
                      ) : !isPast ? (
                        conflict?.type === "time_off" ? (
                          <button
                            onClick={() => onConflictClick(agentId, dateStr)}
                            className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors border border-red-200"
                          >
                            <Ban className="h-4 w-4" />
                            <span className="text-sm font-medium">Congé</span>
                          </button>
                        ) : conflict?.type === "double_booking" ? (
                          <button
                            onClick={() => onConflictClick(agentId, dateStr)}
                            disabled
                            className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg bg-yellow-50 text-yellow-700 border border-yellow-300 cursor-not-allowed opacity-75"
                          >
                            <AlertTriangle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Double affectation
                            </span>
                          </button>
                        ) : isClosed ? (
                          <button
                            onClick={() =>
                              copiedShift
                                ? onPasteShift(agentId, dateStr)
                                : onCreateShift(agentId, dateStr)
                            }
                            className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors group"
                            title="Jour fermé — cliquer pour forcer l'ajout"
                          >
                            <CalendarOff className="h-4 w-4" />
                            <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                              Forcer
                            </span>
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              copiedShift
                                ? onPasteShift(agentId, dateStr)
                                : onCreateShift(agentId, dateStr)
                            }
                            className="absolute inset-2 flex items-center justify-center gap-2 rounded-lg hover:bg-primary/10 transition-colors group border border-dashed border-muted-foreground/30"
                          >
                            {copiedShift ? (
                              <>
                                <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                <span className="text-sm text-muted-foreground group-hover:text-primary">
                                  Coller
                                </span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                              </>
                            )}
                          </button>
                        )
                      ) : isPast ? (
                        <div className="absolute inset-2 flex items-center justify-center text-sm text-muted-foreground">
                          Date passée
                        </div>
                      ) : null}
                    </div>
                  );
                })}

                {showWeekPasteBlock && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-primary/10 transition-colors"
                    onClick={() => onPasteWeek(agentId, weekDates)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Clipboard className="h-6 w-6 text-primary" />
                      <span className="text-sm font-medium text-primary">
                        Coller la semaine
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {showActions && (
                <div className="w-12 shrink-0 h-24 flex items-center justify-center bg-muted/50 rounded-lg">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {hasAnyShift && (
                        <>
                          <DropdownMenuItem
                            onClick={() => onCopyWeek(agentId, weekDates)}
                          >
                            <Copy className="h-3 w-3 mr-2" />
                            Copier la semaine
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDeleteWeek(agentId, weekDates)}
                            className="text-destructive"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Vider la semaine
                          </DropdownMenuItem>
                        </>
                      )}
                      {!hasAnyShift && (
                        <DropdownMenuItem
                          onClick={() => onDeleteWeek(agentId, weekDates)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Vider la semaine
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Monthly View Component
function MonthlyView({
  weekGroups,
  agents,
  shifts,
  copiedShift,
  copiedWeekDates,
  copiedWeekAgentId,
  onCreateShift,
  onEditShift,
  onDeleteShift,
  onCopyShift,
  onPasteShift,
  onCopyWeek,
  onPasteWeek,
  onDeleteWeek,
  onConflictClick,
  getDateConflict,
  calculateAgentHours,
  isClosedDay,
  maxWeeklyWorkHours,
}: {
  dates: Date[];
  weekGroups: { dates: Date[]; startIdx: number }[];
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  copiedShift: AgentShift | null;
  copiedWeekDates: string[] | null;
  copiedWeekAgentId: string | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onDeleteShift: (shiftId: string) => void;
  onCopyShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  onCopyWeek: (agentId: string, dates: string[]) => void;
  onPasteWeek: (agentId: string, dates: string[]) => void;
  onDeleteWeek: (agentId: string, dates: string[]) => void;
  onConflictClick: (agentId: string, date: string) => void;
  getDateConflict: (agentId: string, date: string) => DateConflict | null;
  calculateAgentHours: (agentId: string, dates: Date[]) => number;
  isClosedDay: (date: Date | string) => boolean;
  maxWeeklyWorkHours: number;
}) {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const isDateInPast = (d: string | Date) => {
    const check = typeof d === "string" ? new Date(d) : d;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
  };

  return (
    <div className="overflow-x-auto">
      {/* Header row with sticky agent column */}
      <div className="flex mb-4">
        <div className="w-56 shrink-0 sticky left-0 bg-background z-20 pr-2">
          <div className="p-2">
            <div className="font-medium">Agent</div>
            <div className="text-xs text-muted-foreground">Heures</div>
          </div>
        </div>
        <div className="flex gap-2">
          {weekGroups.map(
            (week: { dates: Date[]; startIdx: number }, weekIdx: number) => {
              const isCompleteWeek = week.dates.length === 7;
              const weekNum =
                week.dates.length > 0 ? getWeekNumber(week.dates[0]) : null;
              return (
                <div key={weekIdx} className="flex flex-col gap-0">
                  {weekNum !== null && (
                    <div className="text-center pb-1">
                      <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        S.{weekNum}
                      </span>
                    </div>
                  )}
                  <div className="flex gap-0">
                    {week.dates.map((date: Date, idx: number) => {
                      const isClosed = isClosedDay(date);
                      return (
                        <div
                          key={idx}
                          className="text-center p-2"
                          style={{ width: "120px" }}
                        >
                          <div
                            className={`text-sm ${
                              isClosed ? "text-muted-foreground" : "font-medium"
                            }`}
                          >
                            {date.toLocaleDateString("fr-FR", {
                              weekday: "short",
                            })}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {date.getDate()}
                          </div>
                        </div>
                      );
                    })}
                    {isCompleteWeek && <div className="w-12 shrink-0" />}
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Agent rows */}
      <div className="space-y-3">
        {agents.map(
          ({ agentId, agentName }: { agentId: string; agentName: string }) => {
            return (
              <div key={agentId} className="flex items-stretch">
                <div className="w-56 shrink-0 p-3 bg-muted rounded-lg sticky left-0 z-10 mr-2 flex flex-col justify-center">
                  <div className="font-medium text-sm mb-2">{agentName}</div>
                  {(() => {
                    const monthHours = weekGroups.reduce(
                      (total, week) =>
                        total + calculateAgentHours(agentId, week.dates),
                      0,
                    );
                    const monthMaxHours =
                      maxWeeklyWorkHours * (weekGroups.length || 1);
                    const isOver = monthHours > monthMaxHours;
                    return (
                      <div
                        className={`flex items-center gap-2 px-2 py-1.5 rounded-md ${isOver ? "bg-destructive/10" : "bg-primary/10"}`}
                      >
                        <Clock
                          className={`h-4 w-4 ${isOver ? "text-destructive" : "text-primary"}`}
                        />
                        <span
                          className={`font-bold text-base ${isOver ? "text-destructive" : "text-primary"}`}
                        >
                          {monthHours.toFixed(1)}h
                        </span>
                        <span className="text-xs text-muted-foreground ml-auto">
                          ce mois
                        </span>
                      </div>
                    );
                  })()}
                </div>

                <div className="flex gap-2">
                  {weekGroups.map(
                    (
                      week: { dates: Date[]; startIdx: number },
                      weekIdx: number,
                    ) => {
                      const weekDates = week.dates.map(formatDate);
                      const isCompleteWeek = week.dates.length === 7;
                      const hasAnyShift = weekDates.some((date: string) =>
                        shifts.find(
                          (s) => s.agentId === agentId && s.date === date,
                        ),
                      );

                      const showWeekPasteBlock =
                        copiedWeekDates &&
                        copiedWeekAgentId &&
                        !hasAnyShift &&
                        weekDates.every((d) => !isDateInPast(d));

                      return (
                        <div key={weekIdx} className="flex relative">
                          <div className="flex gap-0">
                            {week.dates.map((date: Date, idx: number) => {
                              const dateStr = formatDate(date);
                              const shift = shifts.find(
                                (s) =>
                                  s.agentId === agentId && s.date === dateStr,
                              );
                              const conflict = getDateConflict(
                                agentId,
                                dateStr,
                              );
                              const isPast = isDateInPast(dateStr);
                              const isClosed = isClosedDay(date);

                              return (
                                <div
                                  key={idx}
                                  className={`border rounded-lg relative overflow-hidden ${
                                    isClosed ? "bg-muted/30" : "bg-background"
                                  } ${showWeekPasteBlock ? "invisible" : ""}`}
                                  style={{ width: "120px", height: "100px" }}
                                >
                                  {shift ? (
                                    <ShiftCard
                                      shift={shift}
                                      isClosed={isClosed}
                                      onEdit={onEditShift}
                                      onDelete={onDeleteShift}
                                      onCopy={onCopyShift}
                                    />
                                  ) : !isPast ? (
                                    conflict?.type === "time_off" ? (
                                      <button
                                        onClick={() =>
                                          onConflictClick(agentId, dateStr)
                                        }
                                        className="absolute inset-1 flex items-center justify-center gap-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                      >
                                        <Ban className="h-3 w-3" />
                                      </button>
                                    ) : conflict?.type === "double_booking" ? (
                                      <button
                                        onClick={() =>
                                          onConflictClick(agentId, dateStr)
                                        }
                                        disabled
                                        className="absolute inset-1 flex items-center justify-center gap-1 rounded bg-yellow-50 text-yellow-700 border border-yellow-300 cursor-not-allowed opacity-75"
                                      >
                                        <AlertTriangle className="h-3 w-3" />
                                      </button>
                                    ) : isClosed ? (
                                      <button
                                        onClick={() =>
                                          copiedShift
                                            ? onPasteShift(agentId, dateStr)
                                            : onCreateShift(agentId, dateStr)
                                        }
                                        className="absolute inset-1 flex flex-col items-center justify-center gap-0.5 rounded border border-dashed border-muted-foreground/20 text-muted-foreground/50 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50 transition-colors group"
                                        title="Jour fermé — cliquer pour forcer l'ajout"
                                      >
                                        <CalendarOff className="h-3 w-3" />
                                        <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                                          Forcer
                                        </span>
                                      </button>
                                    ) : (
                                      <button
                                        onClick={() =>
                                          copiedShift
                                            ? onPasteShift(agentId, dateStr)
                                            : onCreateShift(agentId, dateStr)
                                        }
                                        className="absolute inset-1 flex items-center justify-center rounded hover:bg-primary/10 group border border-dashed border-muted-foreground/30"
                                      >
                                        {copiedShift ? (
                                          <Clipboard className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        ) : (
                                          <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                        )}
                                      </button>
                                    )
                                  ) : isPast ? (
                                    <div className="absolute inset-1 flex items-center justify-center text-xs text-muted-foreground">
                                      Date passée
                                    </div>
                                  ) : null}

                                  {conflict && shift && (
                                    <button
                                      onClick={() =>
                                        onConflictClick(agentId, dateStr)
                                      }
                                      className="absolute top-1 right-1 z-10"
                                    >
                                      <div
                                        className={`w-2 h-2 rounded-full ${
                                          conflict.type === "time_off"
                                            ? "bg-red-500"
                                            : "bg-yellow-500"
                                        }`}
                                      />
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>

                          {isCompleteWeek && (
                            <div className="w-12 shrink-0 flex items-center justify-center ml-0">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {hasAnyShift && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onCopyWeek(agentId, weekDates)
                                        }
                                      >
                                        <Copy className="h-3 w-3 mr-2" />
                                        Copier la semaine
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onDeleteWeek(agentId, weekDates)
                                        }
                                        className="text-destructive"
                                      >
                                        <Trash2 className="h-3 w-3 mr-2" />
                                        Vider la semaine
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  {showWeekPasteBlock && (
                                    <>
                                      <DropdownMenuItem
                                        onClick={() =>
                                          onPasteWeek(agentId, weekDates)
                                        }
                                      >
                                        <Clipboard className="h-3 w-3 mr-2" />
                                        Coller la semaine
                                      </DropdownMenuItem>
                                      <DropdownMenuSeparator />
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          )}

                          {showWeekPasteBlock && (
                            <div
                              className="absolute inset-0 flex items-center justify-center bg-primary/5 border-2 border-dashed border-primary rounded cursor-pointer hover:bg-primary/10 transition-colors z-5"
                              onClick={() => onPasteWeek(agentId, weekDates)}
                              style={{
                                right: isCompleteWeek ? "48px" : "0",
                              }}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <Clipboard className="h-5 w-5 text-primary" />
                                <span className="text-xs font-medium text-primary">
                                  Coller
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}

// Shift Card Component (for weekly/monthly)
function ShiftCard({
  shift,
  isClosed,
  onEdit,
  onDelete,
  onCopy,
}: {
  shift: AgentShift;
  isClosed?: boolean;
  onEdit: (shift: AgentShift) => void;
  onDelete: (shiftId: string) => void;
  onCopy: (shift: AgentShift) => void;
}) {
  const isShiftInPast = (s: AgentShift) => {
    const check = new Date(s.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const getShiftCompletionStatus = (s: AgentShift) => {
    if (!isShiftInPast(s)) return null;
    if (s.completed)
      return {
        type: "completed",
        label: "Terminé",
        color: "#10b981",
        icon: CheckCircle,
      };
    if (s.noShow)
      return {
        type: "no_show",
        label: "Absent",
        color: "#ef4444",
        icon: XCircle,
      };
    return {
      type: "pending",
      label: "En attente",
      color: "#f59e0b",
      icon: Timer,
    };
  };

  const isOvernightShift = (startTime: string, endTime: string) => {
    const [startHour] = startTime.split(":").map(Number);
    const [endHour] = endTime.split(":").map(Number);
    return endHour < startHour;
  };

  const calculateShiftLength = (
    startTime: string,
    endTime: string,
    breakDuration: number,
  ) => {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    let minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
    if (minutes < 0) minutes += 24 * 60;
    minutes -= breakDuration;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0
      ? `${hours}h${mins.toString().padStart(2, "0")}`
      : `${hours}h`;
  };

  const isPast = isShiftInPast(shift);
  const completionStatus = getShiftCompletionStatus(shift);

  return (
    <div
      className={`absolute inset-0 rounded p-2 border-l-4 flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-all overflow-hidden ${
        isPast ? "opacity-80" : ""
      }`}
      style={{
        borderLeftColor: shift.color,
        backgroundColor: shift.color,
      }}
      onClick={() => !isPast && onEdit(shift)}
    >
      {isClosed && (
        <div
          className="absolute top-1 right-1 z-10"
          title="Service planifié un jour fermé"
        >
          <Lock className="h-3 w-3 text-white/80" />
        </div>
      )}
      {completionStatus && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1"
          style={{ backgroundColor: completionStatus.color }}
        />
      )}

      <div className="flex items-start justify-between gap-2 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold text-white truncate flex items-center gap-2">
            {isOvernightShift(shift.startTime, shift.endTime) && (
              <Moon className="h-3.5 w-3.5 shrink-0" />
            )}
            {shift.startTime} - {shift.endTime}
          </div>
          <div className="flex items-center gap-1 mt-1 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs h-5 bg-white/20 text-white border-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              {calculateShiftLength(
                shift.startTime,
                shift.endTime,
                shift.breakDuration,
              )}
            </Badge>
            {shift.breakDuration > 0 && (
              <span className="text-xs text-white/80">
                {shift.breakDuration}min
              </span>
            )}
            {completionStatus && (
              <Badge
                variant="secondary"
                className="text-xs h-5 font-semibold border-0 gap-1"
                style={{
                  backgroundColor: completionStatus.color,
                  color: "#fff",
                }}
              >
                <completionStatus.icon className="h-3 w-3" />
                {completionStatus.label}
              </Badge>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-white/20 bg-white/10 rounded shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-3.5 w-3.5 text-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {!isPast && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(shift);
                  }}
                >
                  <Pencil className="h-3 w-3 mr-2" />
                  Modifier
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onCopy(shift);
              }}
            >
              <Copy className="h-3 w-3 mr-2" />
              Copier
            </DropdownMenuItem>
            {!isPast && (
              <>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(shift.id);
                  }}
                  className="text-destructive"
                >
                  <Trash2 className="h-3 w-3 mr-2" />
                  Supprimer
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {shift.notes && (
        <div className="text-xs text-white/80 truncate mt-1">{shift.notes}</div>
      )}
    </div>
  );
}
