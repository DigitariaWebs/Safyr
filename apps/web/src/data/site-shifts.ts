import type {
  SiteAgentAssignment,
  AgentShift,
  StandardShift,
} from "@/lib/types";

export const mockStandardShifts: StandardShift[] = [
  {
    id: "std-1",
    siteId: "site-1",
    name: "Matin",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-2",
    siteId: "site-1",
    name: "Après-midi",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-3",
    siteId: "site-1",
    name: "Nuit",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#8b5cf6",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-4",
    siteId: "site-2",
    name: "Journée",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 60,
    color: "#10b981",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-5",
    siteId: "site-2",
    name: "Soirée",
    startTime: "16:00",
    endTime: "00:00",
    breakDuration: 45,
    color: "#ef4444",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-6",
    siteId: "site-3",
    name: "Jour",
    startTime: "07:00",
    endTime: "19:00",
    breakDuration: 60,
    color: "#8b5cf6",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-7",
    siteId: "site-3",
    name: "Nuit",
    startTime: "19:00",
    endTime: "07:00",
    breakDuration: 60,
    color: "#6366f1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-8",
    siteId: "site-4",
    name: "Matin",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#f97316",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-9",
    siteId: "site-4",
    name: "Après-midi",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#d97706",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "std-10",
    siteId: "site-5",
    name: "Rondier",
    startTime: "20:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#ec4899",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
];

export const mockSiteAgentAssignments: SiteAgentAssignment[] = [
  {
    id: "sa-1",
    siteId: "site-1",
    agentId: "1",
    agentName: "Jean Dupont",
    assignedAt: new Date("2024-01-01"),
    active: true,
  },
  {
    id: "sa-2",
    siteId: "site-1",
    agentId: "2",
    agentName: "Marie Martin",
    assignedAt: new Date("2024-01-01"),
    active: true,
  },
  {
    id: "sa-3",
    siteId: "site-1",
    agentId: "3",
    agentName: "Pierre Bernard",
    assignedAt: new Date("2024-01-05"),
    active: true,
  },
  {
    id: "sa-4",
    siteId: "site-2",
    agentId: "2",
    agentName: "Marie Martin",
    assignedAt: new Date("2024-01-02"),
    active: true,
  },
  {
    id: "sa-5",
    siteId: "site-2",
    agentId: "4",
    agentName: "Sophie Dubois",
    assignedAt: new Date("2024-01-03"),
    active: true,
  },
  // Site 3 — hospital / 24-7 site
  {
    id: "sa-6",
    siteId: "site-3",
    agentId: "5",
    agentName: "Antoine Leroy",
    assignedAt: new Date("2026-02-01"),
    active: true,
  },
  {
    id: "sa-7",
    siteId: "site-3",
    agentId: "6",
    agentName: "Camille Petit",
    assignedAt: new Date("2026-02-01"),
    active: true,
  },
  {
    id: "sa-8",
    siteId: "site-3",
    agentId: "7",
    agentName: "Laurent Roux",
    assignedAt: new Date("2026-03-01"),
    active: true,
  },
  // Site 4 — industrial site
  {
    id: "sa-9",
    siteId: "site-4",
    agentId: "8",
    agentName: "Aurélie Moreau",
    assignedAt: new Date("2026-02-15"),
    active: true,
  },
  {
    id: "sa-10",
    siteId: "site-4",
    agentId: "9",
    agentName: "Thomas Simon",
    assignedAt: new Date("2026-02-15"),
    active: true,
  },
  {
    id: "sa-11",
    siteId: "site-4",
    agentId: "10",
    agentName: "Nadia Chen",
    assignedAt: new Date("2026-03-10"),
    active: true,
  },
  // Site 5 — retail / patrol
  {
    id: "sa-12",
    siteId: "site-5",
    agentId: "11",
    agentName: "Victor Girard",
    assignedAt: new Date("2026-03-01"),
    active: true,
  },
  {
    id: "sa-13",
    siteId: "site-5",
    agentId: "12",
    agentName: "Emma Blanc",
    assignedAt: new Date("2026-03-15"),
    active: true,
  },
  {
    id: "sa-14",
    siteId: "site-5",
    agentId: "5",
    agentName: "Antoine Leroy",
    assignedAt: new Date("2026-04-01"),
    active: true,
  },
];

// Helper function to generate dates
const getDateString = (daysOffset: number = 0): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
};

export const mockAgentShifts: AgentShift[] = [
  // Past shifts - Jean Dupont (Agent 1) at Site 1 - Last week
  {
    id: "shift-past-1",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(-7),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    completed: true,
    completedAt: new Date(getDateString(-7) + "T14:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-past-2",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(-6),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    completed: true,
    completedAt: new Date(getDateString(-6) + "T14:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-past-3",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(-5),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    completed: false,
    noShow: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-past-4",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(-4),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    completed: true,
    completedAt: new Date(getDateString(-4) + "T14:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Past shifts - Marie Martin (Agent 2) at Site 1
  {
    id: "shift-past-5",
    agentId: "2",
    siteId: "site-1",
    date: getDateString(-7),
    shiftType: "standard",
    standardShiftId: "std-2",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    completed: true,
    completedAt: new Date(getDateString(-7) + "T22:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-past-6",
    agentId: "2",
    siteId: "site-1",
    date: getDateString(-6),
    shiftType: "standard",
    standardShiftId: "std-2",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    completed: true,
    completedAt: new Date(getDateString(-6) + "T22:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Past shifts - Pierre Bernard (Agent 3) at Site 1
  {
    id: "shift-past-7",
    agentId: "3",
    siteId: "site-1",
    date: getDateString(-7),
    shiftType: "standard",
    standardShiftId: "std-3",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#8b5cf6",
    completed: false,
    noShow: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-past-8",
    agentId: "3",
    siteId: "site-1",
    date: getDateString(-6),
    shiftType: "standard",
    standardShiftId: "std-3",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#8b5cf6",
    completed: true,
    completedAt: new Date(getDateString(-5) + "T06:00:00"),
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Current week - Jean Dupont (Agent 1) at Site 1
  {
    id: "shift-1",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(0),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-2",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(1),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-3",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(2),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-4",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(3),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-5",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(4),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Current week - Marie Martin (Agent 2) at Site 1
  {
    id: "shift-6",
    agentId: "2",
    siteId: "site-1",
    date: getDateString(0),
    shiftType: "standard",
    standardShiftId: "std-2",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-7",
    agentId: "2",
    siteId: "site-1",
    date: getDateString(1),
    shiftType: "standard",
    standardShiftId: "std-2",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-8",
    agentId: "2",
    siteId: "site-1",
    date: getDateString(2),
    shiftType: "standard",
    standardShiftId: "std-2",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#f59e0b",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Current week - Pierre Bernard (Agent 3) at Site 1
  {
    id: "shift-9",
    agentId: "3",
    siteId: "site-1",
    date: getDateString(0),
    shiftType: "standard",
    standardShiftId: "std-3",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#8b5cf6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-10",
    agentId: "3",
    siteId: "site-1",
    date: getDateString(1),
    shiftType: "standard",
    standardShiftId: "std-3",
    startTime: "22:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#8b5cf6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-11",
    agentId: "3",
    siteId: "site-1",
    date: getDateString(2),
    shiftType: "on_demand",
    startTime: "20:00",
    endTime: "04:00",
    breakDuration: 60,
    color: "#ec4899",
    notes: "Horaire ajusté pour événement spécial",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Next week - Jean Dupont
  {
    id: "shift-12",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(7),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-13",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(8),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-14",
    agentId: "1",
    siteId: "site-1",
    date: getDateString(9),
    shiftType: "standard",
    standardShiftId: "std-1",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#3b82f6",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Site 2 - Marie Martin
  {
    id: "shift-15",
    agentId: "2",
    siteId: "site-2",
    date: getDateString(0),
    shiftType: "standard",
    standardShiftId: "std-4",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 60,
    color: "#10b981",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-16",
    agentId: "2",
    siteId: "site-2",
    date: getDateString(3),
    shiftType: "standard",
    standardShiftId: "std-4",
    startTime: "08:00",
    endTime: "16:00",
    breakDuration: 60,
    color: "#10b981",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // Site 2 - Sophie Dubois
  {
    id: "shift-17",
    agentId: "4",
    siteId: "site-2",
    date: getDateString(1),
    shiftType: "standard",
    standardShiftId: "std-5",
    startTime: "16:00",
    endTime: "00:00",
    breakDuration: 45,
    color: "#ef4444",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "shift-18",
    agentId: "4",
    siteId: "site-2",
    date: getDateString(2),
    shiftType: "standard",
    standardShiftId: "std-5",
    startTime: "16:00",
    endTime: "00:00",
    breakDuration: 45,
    color: "#ef4444",
    createdAt: new Date(),
    updatedAt: new Date(),
  },

  // === Generated multi-site shifts for sites 3, 4, 5 ===
  ...generateRotatingShifts(),
];

type TemplateRef = Pick<
  AgentShift,
  | "siteId"
  | "standardShiftId"
  | "startTime"
  | "endTime"
  | "breakDuration"
  | "color"
>;

function generateRotatingShifts(): AgentShift[] {
  const out: AgentShift[] = [];
  let seq = 1000;

  const push = (
    agentId: string,
    daysOffset: number,
    tmpl: TemplateRef,
    past: boolean,
  ) => {
    seq += 1;
    out.push({
      id: `shift-gen-${seq}`,
      agentId,
      siteId: tmpl.siteId,
      date: getDateString(daysOffset),
      shiftType: "standard",
      standardShiftId: tmpl.standardShiftId,
      startTime: tmpl.startTime,
      endTime: tmpl.endTime,
      breakDuration: tmpl.breakDuration,
      color: tmpl.color,
      completed: past,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  // Site 3 templates
  const s3Jour: TemplateRef = {
    siteId: "site-3",
    standardShiftId: "std-6",
    startTime: "07:00",
    endTime: "19:00",
    breakDuration: 60,
    color: "#8b5cf6",
  };
  const s3Nuit: TemplateRef = {
    siteId: "site-3",
    standardShiftId: "std-7",
    startTime: "19:00",
    endTime: "07:00",
    breakDuration: 60,
    color: "#6366f1",
  };

  // Site 4 templates
  const s4Mat: TemplateRef = {
    siteId: "site-4",
    standardShiftId: "std-8",
    startTime: "06:00",
    endTime: "14:00",
    breakDuration: 30,
    color: "#f97316",
  };
  const s4Apm: TemplateRef = {
    siteId: "site-4",
    standardShiftId: "std-9",
    startTime: "14:00",
    endTime: "22:00",
    breakDuration: 30,
    color: "#d97706",
  };

  // Site 5 template
  const s5Ron: TemplateRef = {
    siteId: "site-5",
    standardShiftId: "std-10",
    startTime: "20:00",
    endTime: "06:00",
    breakDuration: 45,
    color: "#ec4899",
  };

  // Cover -15 to +15 days from today
  for (let d = -15; d <= 15; d++) {
    const past = d < 0;
    const dayOfWeek = (d + 100) % 7; // rotating

    // Site 3 — 2-agent jour + 1-agent nuit (skip Sundays for variety)
    if (dayOfWeek !== 0) {
      push(d % 2 === 0 ? "5" : "6", d, s3Jour, past);
      if (d % 3 !== 0) push(d % 2 === 0 ? "6" : "5", d, s3Jour, past);
      push("7", d, s3Nuit, past);
    }

    // Site 4 — matin + apm pair
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      push(d % 2 === 0 ? "8" : "9", d, s4Mat, past);
      push(d % 2 === 0 ? "9" : "10", d, s4Apm, past);
    }

    // Site 5 — rondier, alternating
    if (d % 2 === 0) {
      push(d % 4 === 0 ? "11" : "12", d, s5Ron, past);
    }
  }

  return out;
}
