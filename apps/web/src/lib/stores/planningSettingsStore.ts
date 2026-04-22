import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { z } from "zod";

// ─── Zod Schema (type inference only) ────────────────────────────────────────

export const PlanningSettingsSchema = z.object({
  // A – Regulatory Time
  minDailyRestHours: z.number().min(0).max(24),
  maxDailyWorkHours: z.number().min(0).max(24),
  maxDailyAmplitudeHours: z.number().min(0).max(24),
  maxWeeklyWorkHours: z.number().min(0).max(168),
  absenceDayCountedHours: z.number().min(0).max(24),

  openDays: z.object({
    monday: z.boolean(),
    tuesday: z.boolean(),
    wednesday: z.boolean(),
    thursday: z.boolean(),
    friday: z.boolean(),
    saturday: z.boolean(),
    sunday: z.boolean(),
  }),

  publicHolidays: z.object({
    newYear: z.boolean(), // 1 Jan
    easterMonday: z.boolean(), // Lundi de Pâques
    laborDay: z.boolean(), // 1 Mai
    victoryDay: z.boolean(), // 8 Mai
    ascension: z.boolean(), // Ascension
    // Lundi de Pentecôte excluded as per spec
    nationalDay: z.boolean(), // 14 Juillet
    assumption: z.boolean(), // 15 Août
    allSaints: z.boolean(), // 1 Nov
    armistice: z.boolean(), // 11 Nov
    christmas: z.boolean(), // 25 Déc
  }),

  // B – Working Hours
  dayHourStart: z.number().min(0).max(23), // 6
  dayHourEnd: z.number().min(0).max(23), // 21
  nightSurchargePercent: z.number().min(0), // 11
  sundayDaySurchargePercent: z.number().min(0), // 10
  sundayNightSurchargePercent: z.number().min(0), // 11
  holidayDaySurchargePercent: z.number().min(0), // 100
  holidayNightSurchargePercent: z.number().min(0), // 111

  // Overtime
  overtimeTier1StartHour: z.number().min(0), // 36
  overtimeTier1EndHour: z.number().min(0), // 43
  overtimeTier1Percent: z.number().min(0), // 25
  overtimeTier2StartHour: z.number().min(0), // 43
  overtimeTier2Percent: z.number().min(0), // 50

  // Supplementary (part-time)
  supplementaryTier1FractionDenominator: z.number().min(1), // 10  → 1/10
  supplementaryTier1Percent: z.number().min(0), // 10
  supplementaryTier2FractionDenominator: z.number().min(1), // 3   → 1/3
  supplementaryTier2Percent: z.number().min(0), // 25

  // Meal allowance
  mealAllowanceMinContinuousHours: z.number().min(0), // 6
});

export type PlanningSettings = z.infer<typeof PlanningSettingsSchema>;

// ─── Defaults ─────────────────────────────────────────────────────────────────

const defaultSettings: PlanningSettings = {
  minDailyRestHours: 11,
  maxDailyWorkHours: 12,
  maxDailyAmplitudeHours: 13,
  maxWeeklyWorkHours: 48,
  absenceDayCountedHours: 6,

  openDays: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: true,
  },

  publicHolidays: {
    newYear: true,
    easterMonday: true,
    laborDay: true,
    victoryDay: true,
    ascension: true,
    nationalDay: true,
    assumption: true,
    allSaints: true,
    armistice: true,
    christmas: true,
  },

  dayHourStart: 6,
  dayHourEnd: 21,
  nightSurchargePercent: 11,
  sundayDaySurchargePercent: 10,
  sundayNightSurchargePercent: 11,
  holidayDaySurchargePercent: 100,
  holidayNightSurchargePercent: 111,

  overtimeTier1StartHour: 36,
  overtimeTier1EndHour: 43,
  overtimeTier1Percent: 25,
  overtimeTier2StartHour: 43,
  overtimeTier2Percent: 50,

  supplementaryTier1FractionDenominator: 10,
  supplementaryTier1Percent: 10,
  supplementaryTier2FractionDenominator: 3,
  supplementaryTier2Percent: 25,

  mealAllowanceMinContinuousHours: 6,
};

// ─── Store ───────────────────────────────────────────────────────────────────

interface PlanningSettingsStore {
  settings: PlanningSettings;
  updateSetting: <K extends keyof PlanningSettings>(
    key: K,
    value: PlanningSettings[K],
  ) => void;
  updateOpenDay: (
    day: keyof PlanningSettings["openDays"],
    value: boolean,
  ) => void;
  updatePublicHoliday: (
    holiday: keyof PlanningSettings["publicHolidays"],
    value: boolean,
  ) => void;
  resetSettings: () => void;
}

export const usePlanningSettingsStore = create<PlanningSettingsStore>()(
  persist(
    (set) => ({
      settings: defaultSettings,

      updateSetting: (key, value) =>
        set((state) => ({
          settings: { ...state.settings, [key]: value },
        })),

      updateOpenDay: (day, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            openDays: { ...state.settings.openDays, [day]: value },
          },
        })),

      updatePublicHoliday: (holiday, value) =>
        set((state) => ({
          settings: {
            ...state.settings,
            publicHolidays: {
              ...state.settings.publicHolidays,
              [holiday]: value,
            },
          },
        })),

      resetSettings: () => set({ settings: defaultSettings }),
    }),
    {
      name: "planning-settings",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
