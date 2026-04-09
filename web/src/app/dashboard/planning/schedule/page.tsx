"use client";

import React, { useState, useMemo } from "react";
import { usePlanningSettingsStore } from "@/lib/stores/planningSettingsStore";
import type { PlanningSettings } from "@/lib/stores/planningSettingsStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Scissors,
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

  // Past date warning state
  const [showPastDateWarning, setShowPastDateWarning] = useState(false);
  const [pastDateWarningCtx, setPastDateWarningCtx] = useState<{
    agentId: string;
    date: string;
  } | null>(null);
  const [pastDateAction, setPastDateAction] = useState<"create" | "paste">(
    "create",
  );

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
    // Split shift support
    isSplit: false,
    splitStartTime2: "14:00",
    splitEndTime2: "18:00",
    splitBreakDuration: 60,
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

  // Audio alert helper
  const playAlertBeep = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch {
      // AudioContext unavailable — silent fallback
    }
  };

  // Shift management
  const handleCreateShift = (agentId: string, date: string) => {
    if (isDateInPast(date)) {
      playAlertBeep();
      setPastDateAction("create");
      setPastDateWarningCtx({ agentId, date });
      setShowPastDateWarning(true);
      return;
    }
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
      isSplit: false,
      splitStartTime2: "14:00",
      splitEndTime2: "18:00",
      splitBreakDuration: 60,
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

    // Calculate split start time based on first shift end + break
    const calcSplitStart = (endTime: string, breakDuration: number) => {
      const [endH, endM] = endTime.split(":").map(Number);
      let start2Mins = endH * 60 + endM + breakDuration;
      if (start2Mins >= 24 * 60) start2Mins -= 24 * 60;
      const start2H = Math.floor(start2Mins / 60);
      const start2M = start2Mins % 60;
      return `${start2H.toString().padStart(2, "0")}:${start2M.toString().padStart(2, "0")}`;
    };

    const isSplit = shift.isSplit || false;
    const splitBreakDuration = shift.splitBreakDuration || 60;

    setShiftForm({
      shiftType: shift.shiftType,
      standardShiftId: shift.standardShiftId || "",
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      color: shift.color || "#3b82f6",
      notes: shift.notes || "",
      isOvernight: isOvernightShift(shift.startTime, shift.endTime),
      isSplit,
      splitStartTime2: isSplit
        ? shift.splitStartTime2 ||
          calcSplitStart(shift.endTime, splitBreakDuration)
        : "14:00",
      splitEndTime2: shift.splitEndTime2 || "18:00",
      splitBreakDuration,
    });
    setShowShiftModal(true);
  };

  // Opens edit modal forced to Personnalisé tab for inline hour customization (PG5)
  const handleCustomizeShiftHours = (shift: AgentShift) => {
    if (isShiftInPast(shift)) return;
    setEditingShift(shift);
    setShiftForm({
      shiftType: "on_demand",
      standardShiftId: shift.standardShiftId || "",
      startTime: shift.startTime,
      endTime: shift.endTime,
      breakDuration: shift.breakDuration,
      color: shift.color || "#3b82f6",
      notes: shift.notes || "",
      isOvernight: isOvernightShift(shift.startTime, shift.endTime),
      isSplit: shift.isSplit || false,
      splitStartTime2: shift.splitStartTime2 || "14:00",
      splitEndTime2: shift.splitEndTime2 || "18:00",
      splitBreakDuration: shift.splitBreakDuration || 60,
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
      isSplit: false,
      splitStartTime2: "14:00",
      splitEndTime2: "18:00",
      splitBreakDuration: 60,
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
        isSplit: shiftForm.isSplit,
        splitStartTime2: shiftForm.isSplit
          ? shiftForm.splitStartTime2
          : undefined,
        splitEndTime2: shiftForm.isSplit ? shiftForm.splitEndTime2 : undefined,
        splitBreakDuration: shiftForm.isSplit
          ? shiftForm.splitBreakDuration
          : undefined,
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
        isSplit: shiftForm.isSplit,
        splitStartTime2: shiftForm.isSplit
          ? shiftForm.splitStartTime2
          : undefined,
        splitEndTime2: shiftForm.isSplit ? shiftForm.splitEndTime2 : undefined,
        splitBreakDuration: shiftForm.isSplit
          ? shiftForm.splitBreakDuration
          : undefined,
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
    if (!copiedShift) return;
    if (isDateInPast(date)) {
      playAlertBeep();
      setPastDateAction("paste");
      setPastDateWarningCtx({ agentId, date });
      setShowPastDateWarning(true);
      return;
    }

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

  // PDF Export
  const handleExportPDF = async (
    mode: "global" | "agent" | "site" | "client",
  ) => {
    const { jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const siteName = selectedSite?.name || "Site";
    const clientName = selectedClient?.name || "Client";
    const periodLabel =
      viewType === "monthly"
        ? currentDate.toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
          })
        : `${displayDates[0]?.toLocaleDateString("fr-FR")} – ${displayDates[displayDates.length - 1]?.toLocaleDateString("fr-FR")}`;

    doc.setFontSize(16);
    doc.text(`Planning — ${siteName}`, 14, 16);
    doc.setFontSize(10);
    doc.text(`${clientName} · ${periodLabel}`, 14, 23);

    const filteredShifts = agentShifts.filter(
      (s) => s.siteId === selectedSiteId,
    );
    const dateLabels = displayDates.map((d) =>
      d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
    );

    const buildShiftRows = (
      agents: { agentId: string; agentName?: string; name?: string }[],
      shifts: AgentShift[],
    ) =>
      agents.map((a) => {
        const name = a.agentName ?? a.name ?? "Inconnu";
        const row: (string | number)[] = [name];
        displayDates.forEach((date) => {
          const ds = date.toISOString().split("T")[0];
          const s = shifts.find(
            (sh) => sh.agentId === a.agentId && sh.date === ds,
          );
          row.push(s ? `${s.startTime}–${s.endTime}` : "");
        });
        return row;
      });

    const tableStyles = { fontSize: 7, cellPadding: 2 };
    const headStyles = { fillColor: [15, 23, 42] as [number, number, number] };

    if (mode === "agent" || mode === "global") {
      autoTable(doc, {
        startY: 30,
        head: [["Agent", ...dateLabels]],
        body: buildShiftRows(assignedAgents, filteredShifts),
        styles: tableStyles,
        headStyles,
      });
    }

    if (mode === "site") {
      doc.setFontSize(11);
      doc.text(`Site : ${siteName}`, 14, 28);
      autoTable(doc, {
        startY: 33,
        head: [["Agent", ...dateLabels]],
        body: buildShiftRows(assignedAgents, filteredShifts),
        styles: tableStyles,
        headStyles,
      });
    }

    if (mode === "client") {
      const clientSites = mockSites.filter(
        (s) => s.clientId === selectedClientId,
      );
      let currentY = 30;

      clientSites.forEach((site, siteIdx) => {
        if (siteIdx > 0) {
          doc.addPage();
          doc.setFontSize(16);
          doc.text(`Planning — ${clientName}`, 14, 16);
          doc.setFontSize(10);
          doc.text(periodLabel, 14, 23);
          currentY = 30;
        }
        doc.setFontSize(11);
        doc.text(`Site : ${site.name}`, 14, currentY);
        currentY += 5;

        const siteShifts = agentShifts.filter((s) => s.siteId === site.id);
        const siteAgentIds = [...new Set(siteShifts.map((s) => s.agentId))];
        const siteAgents = siteAgentIds.map((id) => ({
          agentId: id,
          name: mockPlanningAgents.find((a) => a.id === id)?.name,
        }));
        const rows = buildShiftRows(siteAgents, siteShifts);

        if (rows.length > 0) {
          autoTable(doc, {
            startY: currentY,
            head: [["Agent", ...dateLabels]],
            body: rows,
            styles: tableStyles,
            headStyles,
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          currentY = ((doc as any).lastAutoTable?.finalY ?? currentY + 20) + 10;
        } else {
          currentY += 15;
        }
      });
    }

    doc.save(
      `planning-${siteName.replace(/\s+/g, "-").toLowerCase()}-${mode}.pdf`,
    );
  };

  // Site coverage requirements (shared across all views)
  const sitePostes = useMemo(
    () =>
      selectedSiteId
        ? mockPostes.filter((p) => p.siteId === selectedSiteId)
        : [],
    [selectedSiteId],
  );
  const totalNeededPerDay = useMemo(
    () => sitePostes.reduce((sum, p) => sum + (p.capacity?.minAgents ?? 0), 0),
    [sitePostes],
  );

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
              <div
                className="flex items-center gap-2"
                title="Agent a complété son service"
              >
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-sm">Terminé</span>
              </div>
              <div
                className="flex items-center gap-2"
                title="Agent n'a pas assuré son service"
              >
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm">Absent</span>
              </div>
              <div
                className="flex items-center gap-2"
                title="Statut de présence non encore confirmé"
              >
                <div className="w-3 h-3 rounded-full bg-gray-500" />
                <span className="text-sm">En attente</span>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="bg-cyan-500 text-white hover:bg-cyan-600 border-cyan-500"
              onClick={() => setShowAgentCommand(true)}
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
                  Mode copie activé — {copiedShift.startTime} –{" "}
                  {copiedShift.endTime}
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
                      isSplit: copiedShift.isSplit || false,
                      splitStartTime2: copiedShift.splitStartTime2 || "14:00",
                      splitEndTime2: copiedShift.splitEndTime2 || "18:00",
                      splitBreakDuration: copiedShift.splitBreakDuration || 60,
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
                  <DropdownMenuItem onClick={() => handleExportPDF("global")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Planning global
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportPDF("agent")}>
                    <Users className="h-4 w-4 mr-2" />
                    Par agent
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportPDF("site")}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Par site
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExportPDF("client")}>
                    <Building2 className="h-4 w-4 mr-2" />
                    Par client
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Copy mode banner */}
      {(copiedShift || copiedWeekDates) && (
        <div className="flex items-center gap-3 px-4 py-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-700 dark:text-cyan-400">
          <Clipboard className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium flex-1">
            {copiedShift
              ? `Mode copie activé — ${copiedShift.startTime}–${copiedShift.endTime} · cliquez sur une cellule vide pour coller`
              : "Mode copie activé — Semaine copiée · cliquez sur une ligne vide pour coller"}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-500/20"
            onClick={() => {
              setCopiedShift(null);
              setCopiedWeekDates(null);
              setCopiedWeekAgentId(null);
            }}
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Désactiver
          </Button>
        </div>
      )}

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
              onCustomizeShiftHours={handleCustomizeShiftHours}
              isClosedDay={isClosedDay}
              maxDailyWorkHours={settings.maxDailyWorkHours}
              totalNeededPerDay={totalNeededPerDay}
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
              onCustomizeShiftHours={handleCustomizeShiftHours}
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
              onCreateShift={handleCreateShift}
              onEditShift={handleEditShift}
              onPasteShift={handlePasteShift}
              isClosedDay={isClosedDay}
              totalNeededPerDay={totalNeededPerDay}
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
        title={editingShift ? "Modifier le Shift" : "Ajouter un Shift"}
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
                  Sélectionner un modèle de poste
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
                  className="relative rounded-lg border-l-4 p-4 shadow-sm overflow-hidden"
                  style={{
                    backgroundColor: shiftForm.color,
                    borderLeftColor: shiftForm.color,
                  }}
                >
                  {shiftForm.isSplit ? (
                    // Split shift preview - show both slots
                    <div className="space-y-3">
                      {/* First slot */}
                      <div className="flex items-start justify-between gap-2 relative z-10">
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white/90 flex items-center gap-2 mb-1">
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                              1
                            </span>
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
                          </div>
                        </div>
                      </div>
                      {/* Break indicator */}
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-white/30"></div>
                        <span className="text-xs text-white/70 px-2">
                          Pause: {shiftForm.splitBreakDuration}min
                        </span>
                        <div className="h-px flex-1 bg-white/30"></div>
                      </div>
                      {/* Second slot */}
                      <div className="flex items-start justify-between gap-2 relative z-10">
                        <div className="flex-1">
                          <div className="text-xs font-bold text-white/90 flex items-center gap-2 mb-1">
                            <span className="bg-white/20 px-1.5 py-0.5 rounded text-[10px]">
                              2
                            </span>
                            {shiftForm.splitStartTime2 || "00:00"} -{" "}
                            {shiftForm.splitEndTime2 || "00:00"}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className="text-xs h-5 bg-white/20 text-white border-0"
                            >
                              <Clock className="h-3 w-3 mr-1" />
                              {calculateShiftLength(
                                shiftForm.splitStartTime2,
                                shiftForm.splitEndTime2,
                                0,
                              )}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* Total duration */}
                      <div className="pt-2 border-t border-white/20">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-white/80">Total:</span>
                          <Badge
                            variant="secondary"
                            className="text-xs h-5 bg-white/30 text-white border-0 font-bold"
                          >
                            {(() => {
                              const calc = (
                                s: string,
                                e: string,
                                b: number,
                              ) => {
                                const [sh] = s.split(":").map(Number);
                                const [eh] = e.split(":").map(Number);
                                let m = eh * 60 - sh * 60;
                                if (m < 0) m += 24 * 60;
                                return m - b;
                              };
                              const total =
                                calc(
                                  shiftForm.startTime,
                                  shiftForm.endTime,
                                  shiftForm.breakDuration,
                                ) +
                                calc(
                                  shiftForm.splitStartTime2,
                                  shiftForm.splitEndTime2,
                                  0,
                                );
                              const h = Math.floor(total / 60);
                              const min = total % 60;
                              return `${h}h${min > 0 ? min : ""}`;
                            })()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Regular shift preview
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
                  )}
                  {/* Over 12h warning for non-split shifts */}
                  {!shiftForm.isSplit &&
                    (() => {
                      const [startH] = shiftForm.startTime
                        .split(":")
                        .map(Number);
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
                    Poste de nuit (se termine le jour suivant)
                  </Label>
                </div>
              </div>

              {/* Split Shift Toggle */}
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <input
                  type="checkbox"
                  id="splitShift"
                  checked={shiftForm.isSplit}
                  onChange={(e) => {
                    // Auto-calculate split start time when enabling split
                    const calcSplitStart = (
                      endTime: string,
                      breakDuration: number,
                    ) => {
                      const [endH, endM] = endTime.split(":").map(Number);
                      let start2Mins = endH * 60 + endM + breakDuration;
                      if (start2Mins >= 24 * 60) start2Mins -= 24 * 60;
                      const start2H = Math.floor(start2Mins / 60);
                      const start2M = start2Mins % 60;
                      return `${start2H.toString().padStart(2, "0")}:${start2M.toString().padStart(2, "0")}`;
                    };
                    const newIsSplit = e.target.checked;
                    setShiftForm({
                      ...shiftForm,
                      isSplit: newIsSplit,
                      ...(newIsSplit
                        ? {
                            splitStartTime2: calcSplitStart(
                              shiftForm.endTime,
                              shiftForm.splitBreakDuration,
                            ),
                          }
                        : {}),
                    });
                  }}
                  className="rounded h-4 w-4"
                />
                <Label
                  htmlFor="splitShift"
                  className="text-sm cursor-pointer flex items-center gap-2"
                >
                  <Scissors className="h-4 w-4" />
                  Poste coupé (deux créneaux)
                </Label>
              </div>

              {/* Split Shift Times */}
              {shiftForm.isSplit && (
                <div className="p-4 border-2 border-dashed border-primary/30 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Clock className="h-4 w-4" />
                    Deuxième créneau (pause: {shiftForm.splitBreakDuration}min)
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm mb-2 block">Début 2</Label>
                      <Input
                        type="time"
                        value={shiftForm.splitStartTime2}
                        onChange={(e) =>
                          setShiftForm({
                            ...shiftForm,
                            splitStartTime2: e.target.value,
                          })
                        }
                        className="text-base"
                      />
                    </div>
                    <div>
                      <Label className="text-sm mb-2 block">Fin 2</Label>
                      <Input
                        type="time"
                        value={shiftForm.splitEndTime2}
                        onChange={(e) =>
                          setShiftForm({
                            ...shiftForm,
                            splitEndTime2: e.target.value,
                          })
                        }
                        className="text-base"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm mb-2 block">
                      Pause entre les postes
                    </Label>
                    <Select
                      value={shiftForm.splitBreakDuration.toString()}
                      onValueChange={(v: string) => {
                        const newBreakDuration = parseInt(v);
                        // Auto-calculate split start time based on first shift end + break
                        const [endH, endM] = shiftForm.endTime
                          .split(":")
                          .map(Number);
                        let start2Mins = endH * 60 + endM + newBreakDuration;
                        if (start2Mins >= 24 * 60) start2Mins -= 24 * 60;
                        const start2H = Math.floor(start2Mins / 60);
                        const start2M = start2Mins % 60;
                        const newSplitStartTime2 = `${start2H.toString().padStart(2, "0")}:${start2M.toString().padStart(2, "0")}`;
                        setShiftForm({
                          ...shiftForm,
                          splitBreakDuration: newBreakDuration,
                          splitStartTime2: newSplitStartTime2,
                        });
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 heure</SelectItem>
                        <SelectItem value="90">1h30</SelectItem>
                        <SelectItem value="120">2 heures</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

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
                ses postes planifiés pour ce site.
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Past Date Warning Modal */}
      <Modal
        open={showPastDateWarning}
        onOpenChange={setShowPastDateWarning}
        type="warning"
        title="Date passée"
        description={
          pastDateWarningCtx
            ? `Date passée — ${new Date(pastDateWarningCtx.date + "T00:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}`
            : "Date passée"
        }
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => {
              setShowPastDateWarning(false);
              setPastDateWarningCtx(null);
            },
            variant: "outline",
          },
          primary: {
            label: "Continuer quand même",
            onClick: () => {
              if (!pastDateWarningCtx) return;
              setShowPastDateWarning(false);
              const { agentId, date } = pastDateWarningCtx;
              setPastDateWarningCtx(null);

              if (pastDateAction === "paste") {
                // Re-run paste logic skipping past date check
                if (!copiedShift) return;
                const existingShift = agentShifts.find(
                  (s) =>
                    s.agentId === agentId &&
                    s.date === date &&
                    s.siteId === selectedSiteId,
                );
                if (existingShift) {
                  setAgentShifts(
                    agentShifts.filter((s) => s.id !== existingShift.id),
                  );
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
                setAgentShifts((prev) => [...prev, newShift]);
                return;
              }

              // Re-run create logic skipping the past date check
              const conflict = getDateConflict(agentId, date);
              if (conflict?.type === "time_off") return;
              if (conflict?.type === "double_booking") {
                setPendingPasteAction({
                  type: "shift",
                  agentId,
                  dates: [date],
                });
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
                isSplit: false,
                splitStartTime2: "14:00",
                splitEndTime2: "18:00",
                splitBreakDuration: 60,
              });
              setTemplatePopoverContext({ agentId, date });
              setSelectedPopoverTemplateId(siteStandardShifts[0]?.id ?? null);
              setShowTemplatePopover(true);
              window.__shiftContext = { agentId, date };
            },
          },
        }}
      >
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground">
            Vous essayez d&apos;assigner un shift sur une date déjà passée.
            Cette action peut affecter les rapports et calculs de paie.
          </p>
        </div>
      </Modal>

      {/* Planning Summary Widget */}
      <Card className="border-border/40 mt-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-light text-muted-foreground flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Résumé du Planning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {/* Total Hours */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Clock className="h-4 w-4" />
                Heures totales
              </div>
              <div className="text-2xl font-bold">
                {totalPlannedHours.toFixed(1)}h
              </div>
            </div>

            {/* Overtime Hours (estimated) */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <AlertCircle className="h-4 w-4" />
                Heures sup.
              </div>
              <div className="text-2xl font-bold">
                {Math.max(
                  0,
                  totalPlannedHours - assignedAgents.length * 35,
                ).toFixed(1)}
                h
              </div>
            </div>

            {/* Meal Vouchers */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <FileText className="h-4 w-4" />
                Repas
              </div>
              <div className="text-2xl font-bold">
                {
                  agentShifts.filter((s) => {
                    if (s.siteId !== selectedSiteId) return false;
                    const hoursStr = calculateShiftLength(
                      s.startTime,
                      s.endTime,
                      s.breakDuration,
                    );
                    const hours = parseFloat(hoursStr.replace("h", ".")) || 0;
                    const hours2Str = s.isSplit
                      ? calculateShiftLength(
                          s.splitStartTime2 || "00:00",
                          s.splitEndTime2 || "00:00",
                          0,
                        )
                      : "0";
                    const hours2 = parseFloat(hours2Str.replace("h", ".")) || 0;
                    return hours + hours2 > 6;
                  }).length
                }
              </div>
            </div>

            {/* Absences/Leave */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Ban className="h-4 w-4" />
                Absences
              </div>
              <div className="text-2xl font-bold">
                {
                  assignedAgents.filter(({ agentId }) =>
                    displayDates.some((date) =>
                      hasTimeOff(agentId, formatDate(date)),
                    ),
                  ).length
                }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hour Details Section */}
      <HourDetailsSection
        agents={assignedAgents}
        agentShifts={agentShifts.filter((s) => s.siteId === selectedSiteId)}
        displayDates={displayDates}
        isPublicHoliday={isPublicHoliday}
        timeOffRequests={mockTimeOffRequests}
        settings={settings}
      />
    </div>
  );
}

function HourDetailsSection({
  agents,
  agentShifts,
  displayDates,
  isPublicHoliday,
  timeOffRequests,
  settings,
}: {
  agents: { agentId: string; agentName: string }[];
  agentShifts: AgentShift[];
  displayDates: Date[];
  isPublicHoliday: (date: Date | string) => boolean;
  timeOffRequests: TimeOffRequest[];
  settings: PlanningSettings;
}) {
  const [isOpen, setIsOpen] = React.useState(false);

  const rows = React.useMemo(() => {
    const displayDateSet = new Set(
      displayDates.map((d) => d.toISOString().split("T")[0]),
    );

    const getWeekNum = (d: Date) => {
      const date = new Date(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()),
      );
      date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
      const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
      return Math.ceil(
        ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
      );
    };

    const computeNightHours = (
      startTime: string,
      endTime: string,
      breakMins: number,
    ) => {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const startMins = sh * 60 + sm;
      let endMins = eh * 60 + em;
      if (endMins <= startMins) endMins += 24 * 60;
      const dayStart = settings.dayHourStart * 60;
      const dayEnd = settings.dayHourEnd * 60;
      let nightMins = 0;
      if (startMins < dayStart)
        nightMins += Math.min(endMins, dayStart) - startMins;
      if (endMins > dayEnd) nightMins += endMins - Math.max(startMins, dayEnd);
      const totalMins = endMins - startMins;
      if (totalMins > 0 && breakMins > 0) {
        nightMins = Math.max(
          0,
          nightMins - breakMins * (nightMins / totalMins),
        );
      }
      return nightMins / 60;
    };

    // Pre-build time-off counts: agentId → { vacation, sick_leave, training }
    const timeOffCounts = new Map<string, Record<string, number>>();
    for (const r of timeOffRequests) {
      if (r.status !== "approved") continue;
      const rStart = r.startDate.toString().split("T")[0];
      const rEnd = r.endDate.toString().split("T")[0];
      const overlaps = [...displayDateSet].some(
        (ds) => ds >= rStart && ds <= rEnd,
      );
      if (!overlaps) continue;
      let counts = timeOffCounts.get(r.employeeId);
      if (!counts) {
        counts = {};
        timeOffCounts.set(r.employeeId, counts);
      }
      counts[r.type] = (counts[r.type] || 0) + 1;
    }

    return agents.map(({ agentId, agentName }) => {
      let normales = 0;
      let nuit = 0;
      let dimanche = 0;
      let feries = 0;
      let dimancheNuit = 0;
      let ferieNuit = 0;
      let paniers = 0;
      const weeklyHours: Record<number, number> = {};

      agentShifts
        .filter((s) => s.agentId === agentId && displayDateSet.has(s.date))
        .forEach((s) => {
          const [sh, sm] = s.startTime.split(":").map(Number);
          const [eh, em] = s.endTime.split(":").map(Number);
          let mins = eh * 60 + em - (sh * 60 + sm);
          if (mins < 0) mins += 24 * 60;
          mins -= s.breakDuration;
          const hrs = Math.max(0, mins / 60);

          const date = new Date(s.date + "T00:00:00");
          const isSunday = date.getDay() === 0;
          const isHoliday = isPublicHoliday(date);
          const nightHrs = computeNightHours(
            s.startTime,
            s.endTime,
            s.breakDuration,
          );

          normales += hrs;
          nuit += nightHrs;
          if (isSunday) {
            dimanche += hrs;
            dimancheNuit += nightHrs;
          }
          if (isHoliday) {
            feries += hrs;
            ferieNuit += nightHrs;
          }
          if (hrs > settings.mealAllowanceMinContinuousHours) paniers += 1;

          if (s.isSplit && s.splitStartTime2 && s.splitEndTime2) {
            const [s2h, s2m] = s.splitStartTime2.split(":").map(Number);
            const [e2h, e2m] = s.splitEndTime2.split(":").map(Number);
            let mins2 = e2h * 60 + e2m - (s2h * 60 + s2m);
            if (mins2 < 0) mins2 += 24 * 60;
            const hrs2 = Math.max(0, mins2 / 60);
            const nightHrs2 = computeNightHours(
              s.splitStartTime2,
              s.splitEndTime2,
              0,
            );
            normales += hrs2;
            nuit += nightHrs2;
            if (isSunday) {
              dimanche += hrs2;
              dimancheNuit += nightHrs2;
            }
            if (isHoliday) {
              feries += hrs2;
              ferieNuit += nightHrs2;
            }
          }

          const wk = getWeekNum(date);
          weeklyHours[wk] = (weeklyHours[wk] || 0) + hrs;
        });

      let overtimeT1 = 0;
      let overtimeT2 = 0;
      Object.values(weeklyHours).forEach((weekTotal) => {
        overtimeT1 += Math.max(
          0,
          Math.min(weekTotal, settings.overtimeTier1EndHour) -
            settings.overtimeTier1StartHour,
        );
        overtimeT2 += Math.max(0, weekTotal - settings.overtimeTier2StartHour);
      });

      const agentTimeOff = timeOffCounts.get(agentId) ?? {};

      return {
        agentId,
        agentName,
        normales,
        nuit,
        dimanche,
        feries,
        dimancheNuit,
        ferieNuit,
        overtimeT1,
        overtimeT2,
        paniers,
        conges: agentTimeOff["vacation"] ?? 0,
        arretMaladie: agentTimeOff["sick_leave"] ?? 0,
        formation: agentTimeOff["training"] ?? 0,
      };
    });
  }, [
    agents,
    agentShifts,
    displayDates,
    isPublicHoliday,
    timeOffRequests,
    settings,
  ]);

  return (
    <Card className="border-border/40">
      <CardHeader
        className="pb-2 cursor-pointer select-none"
        onClick={() => setIsOpen((o) => !o)}
      >
        <CardTitle className="text-base font-light text-muted-foreground flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Détail des majorations &amp; éléments variables
          </div>
          <span className="text-xs">
            {isOpen ? "▲ Réduire" : "▼ Développer"}
          </span>
        </CardTitle>
      </CardHeader>
      {isOpen && (
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b text-muted-foreground text-xs">
                  <th className="text-left py-2 pr-4 font-medium">Agent</th>
                  <th className="text-right py-2 px-2 font-medium">
                    H. normales
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-orange-600">
                    H. sup T1 ({settings.overtimeTier1Percent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-orange-700">
                    H. sup T2 ({settings.overtimeTier2Percent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-indigo-600">
                    H. nuit ({settings.nightSurchargePercent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-blue-600">
                    H. dim. ({settings.sundayDaySurchargePercent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-red-600">
                    H. fériés ({settings.holidayDaySurchargePercent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-violet-600">
                    Dim. nuit ({settings.sundayNightSurchargePercent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-rose-700">
                    Fér. nuit ({settings.holidayNightSurchargePercent}%)
                  </th>
                  <th className="text-right py-2 px-2 font-medium">Paniers</th>
                  <th className="text-right py-2 px-2 font-medium">Congés</th>
                  <th className="text-right py-2 px-2 font-medium text-rose-600">
                    Maladie
                  </th>
                  <th className="text-right py-2 px-2 font-medium text-purple-600">
                    Formation
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.agentId} className="border-b hover:bg-muted/30">
                    <td className="py-2 pr-4 font-medium">{row.agentName}</td>
                    <td className="text-right py-2 px-2">
                      {row.normales.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-orange-600">
                      {row.overtimeT1.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-orange-700">
                      {row.overtimeT2.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-indigo-600">
                      {row.nuit.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-blue-600">
                      {row.dimanche.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-red-600">
                      {row.feries.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-violet-600">
                      {row.dimancheNuit.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2 text-rose-700">
                      {row.ferieNuit.toFixed(2)}h
                    </td>
                    <td className="text-right py-2 px-2">{row.paniers}</td>
                    <td className="text-right py-2 px-2">{row.conges}</td>
                    <td className="text-right py-2 px-2 text-rose-600">
                      {row.arretMaladie}
                    </td>
                    <td className="text-right py-2 px-2 text-purple-600">
                      {row.formation}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={13}
                      className="text-center py-4 text-muted-foreground"
                    >
                      Aucun agent assigné à ce site
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      )}
    </Card>
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
  onCustomizeShiftHours,
  isClosedDay,
  maxDailyWorkHours,
  totalNeededPerDay,
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
  onCustomizeShiftHours: (shift: AgentShift) => void;
  isClosedDay: (date: Date | string) => boolean;
  maxDailyWorkHours: number;
  totalNeededPerDay: number;
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

  const isClosed = isClosedDay(date);
  const totalAssigned = shifts.filter((s) => s.date === dateStr).length;

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

      {/* Besoin / coverage row */}
      {totalNeededPerDay > 0 && !isClosed && (
        <div className="flex items-center gap-3 mb-3">
          <div className="w-56 shrink-0 p-2 bg-amber-500/10 rounded-lg flex items-center">
            <span className="text-xs font-semibold text-amber-600">
              Besoins
            </span>
          </div>
          <div
            className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border ${
              totalAssigned >= totalNeededPerDay
                ? "bg-green-500/5 border-green-200/50"
                : "bg-amber-500/5 border-amber-200/50"
            }`}
          >
            <span
              className={`text-sm font-medium ${totalAssigned >= totalNeededPerDay ? "text-green-600" : "text-amber-600"}`}
            >
              {totalAssigned >= totalNeededPerDay
                ? `✓ Complet (${totalAssigned}/${totalNeededPerDay} agents affectés)`
                : `${totalAssigned}/${totalNeededPerDay} agents affectés`}
            </span>
          </div>
        </div>
      )}

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
                    onCustomizeHours={onCustomizeShiftHours}
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
  onCustomizeHours,
}: {
  shift: AgentShift;
  conflict: DateConflict | null;
  isClosed?: boolean;
  onEdit: (shift: AgentShift) => void;
  onDelete: (shiftId: string) => void;
  onCopy: (shift: AgentShift) => void;
  onConflictClick: (agentId: string, date: string) => void;
  onCustomizeHours: (shift: AgentShift) => void;
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

  // Calculate total duration including split shift
  const calculateTotalDuration = () => {
    // First part
    let minutes1 = endHour * 60 + endMin - (startHour * 60 + startMin);
    if (minutes1 < 0) minutes1 += 24 * 60;
    minutes1 -= shift.breakDuration;

    // Second part (if split)
    let minutes2 = 0;
    if (shift.isSplit && shift.splitStartTime2 && shift.splitEndTime2) {
      const [s2h, s2m] = shift.splitStartTime2.split(":").map(Number);
      const [e2h, e2m] = shift.splitEndTime2.split(":").map(Number);
      minutes2 = e2h * 60 + e2m - (s2h * 60 + s2m);
      if (minutes2 < 0) minutes2 += 24 * 60;
      minutes2 -= shift.splitBreakDuration || 0;
    }

    const totalMinutes = minutes1 + minutes2;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
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
          title="Poste planifié un jour fermé"
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
            {shift.isSplit && (
              <span className="text-xs font-normal text-white/80">
                | {shift.splitStartTime2} - {shift.splitEndTime2}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <Badge
              variant="secondary"
              className="text-xs h-5 bg-white/20 text-white border-0"
            >
              <Clock className="h-3 w-3 mr-1" />
              {shift.isSplit ? calculateTotalDuration() : duration}
            </Badge>
            {shift.isSplit && shift.splitBreakDuration && (
              <span className="text-xs text-white/80">
                Pause: {shift.splitBreakDuration}min
              </span>
            )}
            {shift.breakDuration > 0 && !shift.isSplit && (
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
                title={
                  completionStatus.label === "Terminé"
                    ? "Agent a complété son service"
                    : completionStatus.label === "Absent"
                      ? "Agent n'a pas assuré son service"
                      : "Statut de présence non encore confirmé"
                }
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
                  onCustomizeHours(shift);
                }}
              >
                <Clock className="h-4 w-4 mr-2" />
                Personnaliser horaires
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
  onCustomizeShiftHours,
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
  onCustomizeShiftHours: (shift: AgentShift) => void;
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
              Besoins
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

          // Contract hours tracking
          const agentData = mockPlanningAgents.find((a) => a.id === agentId);
          const contractHours = agentData?.contractHours ?? 151.67;
          const refMonth =
            dates.length > 0 ? dates[0].getMonth() : new Date().getMonth();
          const refYear =
            dates.length > 0
              ? dates[0].getFullYear()
              : new Date().getFullYear();
          const monthlyAssignedMinutes = shifts
            .filter((s) => {
              if (s.agentId !== agentId) return false;
              const d = new Date(s.date + "T00:00:00");
              return d.getMonth() === refMonth && d.getFullYear() === refYear;
            })
            .reduce((acc, s) => {
              const [sh, sm] = s.startTime.split(":").map(Number);
              const [eh, em] = s.endTime.split(":").map(Number);
              let mins = eh * 60 + em - (sh * 60 + sm);
              if (mins < 0) mins += 24 * 60;
              mins -= s.breakDuration;
              return acc + Math.max(0, mins);
            }, 0);
          const monthlyAssignedHours = monthlyAssignedMinutes / 60;
          const remainingHours = contractHours - monthlyAssignedHours;

          return (
            <div key={agentId} className="flex items-stretch gap-2">
              <div className="w-56 shrink-0 p-3 bg-muted rounded-lg flex flex-col justify-center gap-1.5">
                <div className="font-medium text-sm">{agentName}</div>
                <div
                  className={`flex items-center gap-2 px-2 py-1 rounded-md ${agentHours > maxWeeklyWorkHours ? "bg-destructive/10" : "bg-primary/10"}`}
                >
                  <Clock
                    className={`h-3.5 w-3.5 ${agentHours > maxWeeklyWorkHours ? "text-destructive" : "text-primary"}`}
                  />
                  <span
                    className={`font-bold text-sm ${agentHours > maxWeeklyWorkHours ? "text-destructive" : "text-primary"}`}
                  >
                    {agentHours.toFixed(1)}h
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    sem.
                  </span>
                </div>
                <div className="text-[10px] space-y-0.5 text-muted-foreground">
                  <div className="flex justify-between">
                    <span>{contractHours.toFixed(2)}h contrat</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{monthlyAssignedHours.toFixed(2)}h affectées</span>
                  </div>
                  <div
                    className={`flex justify-between font-medium ${remainingHours < 0 ? "text-destructive" : "text-foreground"}`}
                  >
                    <span>{remainingHours.toFixed(2)}h restantes</span>
                  </div>
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
                          onCustomizeHours={onCustomizeShiftHours}
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
  onCreateShift,
  onEditShift,
  onPasteShift,
  isClosedDay,
  totalNeededPerDay,
}: {
  dates: Date[];
  weekGroups: { dates: Date[]; startIdx: number }[];
  agents: { agentId: string; agentName: string }[];
  shifts: AgentShift[];
  copiedShift: AgentShift | null;
  onCreateShift: (agentId: string, date: string) => void;
  onEditShift: (shift: AgentShift) => void;
  onPasteShift: (agentId: string, date: string) => void;
  isClosedDay: (date: Date | string) => boolean;
  totalNeededPerDay: number;
}) {
  const formatDate = (d: Date) => d.toISOString().split("T")[0];
  const isDateInPast = (d: string | Date) => {
    const check = typeof d === "string" ? new Date(d) : d;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    check.setHours(0, 0, 0, 0);
    return check < today;
  };

  const getShiftsForDate = (dateStr: string) => {
    return shifts.filter((s) => s.date === dateStr);
  };

  const getAgentName = (agentId: string) => {
    const agent = agents.find((a) => a.agentId === agentId);
    return agent?.agentName || "Inconnu";
  };

  const calculateTotalHours = (dateStr: string) => {
    const dayShifts = getShiftsForDate(dateStr);
    return dayShifts.reduce((total, shift) => {
      const [startHour, startMin] = shift.startTime.split(":").map(Number);
      const [endHour, endMin] = shift.endTime.split(":").map(Number);
      let minutes = endHour * 60 + endMin - (startHour * 60 + startMin);
      if (minutes < 0) minutes += 24 * 60;
      minutes -= shift.breakDuration;
      return total + minutes / 60;
    }, 0);
  };

  const DAYS_OF_WEEK = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const getWeekNumber = (d: Date) => {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7,
    );
  };

  return (
    <div className="w-full flex flex-col">
      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-px mb-1">
        {DAYS_OF_WEEK.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-semibold text-muted-foreground py-0.5"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px">
        {weekGroups.flatMap(
          (week: { dates: Date[]; startIdx: number }, weekIdx: number) =>
            week.dates.map((date: Date, idx: number) => {
              const dateStr = formatDate(date);
              const dayShifts = getShiftsForDate(dateStr);
              const isClosed = isClosedDay(date);
              const isPast = isDateInPast(dateStr);
              const totalHours = calculateTotalHours(dateStr);
              const isThursday = date.getDay() === 4;
              const weekNum = isThursday ? getWeekNumber(date) : null;

              return (
                <div
                  key={`${weekIdx}-${idx}`}
                  className={`border rounded p-0.5 flex flex-col min-h-0 ${isClosed ? "bg-muted/30" : "bg-background"} ${isPast ? "opacity-60" : ""}`}
                >
                  {/* Week number above Thursday */}
                  {weekNum !== null && (
                    <div className="text-[8px] text-primary font-semibold text-center leading-none mb-px">
                      S.{weekNum}
                    </div>
                  )}
                  {/* Date header */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold leading-none ${isClosed ? "text-muted-foreground" : ""} ${!isPast && !isClosed ? "text-primary" : ""}`}
                    >
                      {date.getDate()}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {totalNeededPerDay > 0 && !isClosed && (
                        <span
                          className={`text-[8px] font-medium leading-none ${dayShifts.length >= totalNeededPerDay ? "text-green-600" : "text-amber-600"}`}
                        >
                          {dayShifts.length >= totalNeededPerDay
                            ? "✓"
                            : `${dayShifts.length}/${totalNeededPerDay}`}
                        </span>
                      )}
                      {totalHours > 0 && (
                        <span className="text-[8px] text-muted-foreground leading-none">
                          {totalHours.toFixed(1)}h
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Shifts list */}
                  <div className="flex-1 space-y-px mt-px">
                    {dayShifts.map((shift) => (
                      <button
                        key={shift.id}
                        onClick={() => !isPast && onEditShift(shift)}
                        className="w-full text-left px-1 py-px rounded text-[9px] font-medium text-white truncate leading-tight"
                        style={{ backgroundColor: shift.color }}
                        title={`${getAgentName(shift.agentId)}: ${shift.startTime}-${shift.endTime}${shift.isSplit ? ` | ${shift.splitStartTime2}-${shift.splitEndTime2}` : ""}`}
                      >
                        {getAgentName(shift.agentId).split(" ")[0]}{" "}
                        {shift.startTime}-{shift.endTime}
                      </button>
                    ))}
                  </div>

                  {/* Add button */}
                  {!isPast && (
                    <button
                      onClick={() => {
                        if (copiedShift) {
                          if (agents.length > 0) {
                            onPasteShift(agents[0].agentId, dateStr);
                          }
                        } else {
                          onCreateShift(agents[0]?.agentId || "", dateStr);
                        }
                      }}
                      className="w-full py-px text-[8px] text-muted-foreground hover:text-primary rounded border border-dashed border-muted-foreground/20 leading-none mt-px"
                    >
                      +
                    </button>
                  )}
                </div>
              );
            }),
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
  onCustomizeHours,
}: {
  shift: AgentShift;
  isClosed?: boolean;
  onEdit: (shift: AgentShift) => void;
  onDelete: (shiftId: string) => void;
  onCopy: (shift: AgentShift) => void;
  onCustomizeHours: (shift: AgentShift) => void;
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

  // Calculate total duration including split shift
  const calculateTotalDuration = () => {
    // First part
    const [startHour, startMin] = shift.startTime.split(":").map(Number);
    const [endHour, endMin] = shift.endTime.split(":").map(Number);
    let minutes1 = endHour * 60 + endMin - (startHour * 60 + startMin);
    if (minutes1 < 0) minutes1 += 24 * 60;
    minutes1 -= shift.breakDuration;

    // Second part (if split)
    let minutes2 = 0;
    if (shift.isSplit && shift.splitStartTime2 && shift.splitEndTime2) {
      const [s2h, s2m] = shift.splitStartTime2.split(":").map(Number);
      const [e2h, e2m] = shift.splitEndTime2.split(":").map(Number);
      minutes2 = e2h * 60 + e2m - (s2h * 60 + s2m);
      if (minutes2 < 0) minutes2 += 24 * 60;
      minutes2 -= shift.splitBreakDuration || 0;
    }

    const totalMinutes = minutes1 + minutes2;
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return mins > 0
      ? `${hours}h${mins.toString().padStart(2, "0")}`
      : `${hours}h`;
  };

  const isPast = isShiftInPast(shift);
  const completionStatus = getShiftCompletionStatus(shift);

  return (
    <div
      className={`absolute inset-0 rounded p-1 border-l-3 flex flex-col group cursor-pointer shadow-sm hover:shadow-md transition-all overflow-hidden ${
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
          className="absolute top-0.5 right-0.5 z-10"
          title="Poste planifié un jour fermé"
        >
          <Lock className="h-2.5 w-2.5 text-white/80" />
        </div>
      )}
      {completionStatus && (
        <div
          className="absolute left-0 top-0 bottom-0 w-0.5"
          style={{ backgroundColor: completionStatus.color }}
        />
      )}

      <div className="flex items-start justify-between gap-1 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-white truncate flex flex-col gap-0.5">
            <div className="flex items-center gap-1">
              {isOvernightShift(shift.startTime, shift.endTime) && (
                <Moon className="h-2.5 w-2.5 shrink-0" />
              )}
              {shift.startTime}-{shift.endTime}
            </div>
            {shift.isSplit && (
              <div className="text-[9px] font-normal text-white/80">
                {shift.splitStartTime2}-{shift.splitEndTime2}
              </div>
            )}
          </div>
          <div className="flex items-center gap-0.5 mt-0.5 flex-wrap">
            <Badge
              variant="secondary"
              className="text-[9px] h-4 px-1 bg-white/20 text-white border-0"
            >
              {shift.isSplit
                ? calculateTotalDuration()
                : calculateShiftLength(
                    shift.startTime,
                    shift.endTime,
                    shift.breakDuration,
                  )}
            </Badge>
            {completionStatus && (
              <span
                title={
                  completionStatus.label === "Terminé"
                    ? "Agent a complété son service"
                    : completionStatus.label === "Absent"
                      ? "Agent n'a pas assuré son service"
                      : "Statut de présence non encore confirmé"
                }
              >
                <completionStatus.icon className="h-2.5 w-2.5 text-white" />
              </span>
            )}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-5 w-5 p-0 hover:bg-white/20 bg-white/10 rounded shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="h-2.5 w-2.5 text-white" />
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
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCustomizeHours(shift);
                  }}
                >
                  <Clock className="h-3 w-3 mr-2" />
                  Personnaliser horaires
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
