"use client";

import * as React from "react";
import { usePlanningSettingsStore } from "@/lib/stores/planningSettingsStore";
import type { PlanningSettings } from "@/lib/stores/planningSettingsStore";
import { HoursInput } from "@/components/ui/hours-input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Clock,
  CalendarDays,
  Sun,
  TrendingUp,
  ShoppingBag,
  RotateCcw,
  Check,
  Moon,
  AlertCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type OpenDayKey = keyof PlanningSettings["openDays"];
type PublicHolidayKey = keyof PlanningSettings["publicHolidays"];
type TabId = "regulatory" | "opendays" | "hours" | "overtime" | "meal";

// ─── Constants ────────────────────────────────────────────────────────────────

const OPEN_DAYS: { key: OpenDayKey; short: string; full: string }[] = [
  { key: "monday", short: "Lun", full: "Lundi" },
  { key: "tuesday", short: "Mar", full: "Mardi" },
  { key: "wednesday", short: "Mer", full: "Mercredi" },
  { key: "thursday", short: "Jeu", full: "Jeudi" },
  { key: "friday", short: "Ven", full: "Vendredi" },
  { key: "saturday", short: "Sam", full: "Samedi" },
  { key: "sunday", short: "Dim", full: "Dimanche" },
];

const PUBLIC_HOLIDAYS: {
  key: PublicHolidayKey;
  label: string;
  date: string;
}[] = [
  { key: "newYear", label: "Jour de l'An", date: "1 jan." },
  { key: "easterMonday", label: "Lundi de Pâques", date: "Variable" },
  { key: "laborDay", label: "Fête du Travail", date: "1 mai" },
  { key: "victoryDay", label: "Victoire 1945", date: "8 mai" },
  { key: "ascension", label: "Ascension", date: "Variable" },
  { key: "nationalDay", label: "Fête Nationale", date: "14 juil." },
  { key: "assumption", label: "Assomption", date: "15 août" },
  { key: "allSaints", label: "Toussaint", date: "1 nov." },
  { key: "armistice", label: "Armistice", date: "11 nov." },
  { key: "christmas", label: "Noël", date: "25 déc." },
];

const TABS: { id: TabId; label: string; icon: React.ElementType }[] = [
  { id: "regulatory", label: "Temps réglementaire", icon: Clock },
  { id: "opendays", label: "Jours d'ouverture", icon: CalendarDays },
  { id: "hours", label: "Heures de travail", icon: Sun },
  { id: "overtime", label: "Supplémentaires", icon: TrendingUp },
  { id: "meal", label: "Paniers", icon: ShoppingBag },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-primary/70">
      {children}
    </p>
  );
}

function Row({
  label,
  hint,
  children,
  last,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-6 py-3.5",
        !last && "border-b border-border/50",
      )}
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-none">{label}</p>
        {hint && (
          <p className="mt-1 text-xs leading-snug text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function HNum({
  value,
  onChange,
  min = 0,
  max = 24,
  unit = "h",
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <HoursInput value={value} onChange={onChange} min={min} max={max} />
      <span className="w-4 text-sm text-muted-foreground">{unit}</span>
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-1 backdrop-blur-sm">
      {children}
    </div>
  );
}

// ─── Surcharge row ────────────────────────────────────────────────────────────

type SurchargeAccent = "night" | "sunday" | "holiday";

const ACCENT_STYLES: Record<SurchargeAccent, { chip: string; dot: string }> = {
  night: {
    chip: "bg-indigo-500/15 text-indigo-300 border-indigo-500/20",
    dot: "bg-indigo-400",
  },
  sunday: {
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    dot: "bg-amber-400",
  },
  holiday: {
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/20",
    dot: "bg-rose-400",
  },
};

function SurchargeRow({
  label,
  range,
  value,
  onChange,
  accent,
  last,
}: {
  label: string;
  range: string;
  value: number;
  onChange: (v: number) => void;
  accent: SurchargeAccent;
  last?: boolean;
}) {
  const s = ACCENT_STYLES[accent];
  return (
    <div
      className={cn(
        "flex items-center gap-4 py-3",
        !last && "border-b border-border/50",
      )}
    >
      <div className={cn("mt-0.5 h-2 w-2 shrink-0 rounded-full", s.dot)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <span
          className={cn(
            "mt-1 inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
            s.chip,
          )}
        >
          {range}
        </span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <HoursInput value={value} onChange={onChange} min={0} max={999} />
        <span className="text-sm font-semibold text-primary">%</span>
      </div>
    </div>
  );
}

// ─── Tier block ───────────────────────────────────────────────────────────────

function TierBlock({
  n,
  badge,
  children,
}: {
  n: number;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 overflow-hidden">
      <div className="flex items-center gap-3 border-b border-border/60 bg-muted/20 px-4 py-2.5">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
          {n}
        </span>
        <span className="text-sm font-semibold">Tranche {n}</span>
        <span className="ml-auto rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[11px] font-medium text-primary">
          {badge}
        </span>
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 px-4 py-4">
        {children}
      </div>
    </div>
  );
}

function InputPair({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-muted-foreground whitespace-nowrap">
        {label}
      </span>
      {children}
    </div>
  );
}

// ─── Autosave pill ────────────────────────────────────────────────────────────

function SavedPill({ savedAt }: { savedAt: Date | null }) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!savedAt) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 2500);
    return () => clearTimeout(t);
  }, [savedAt]);

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 transition-all duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-1 pointer-events-none",
      )}
    >
      <Check className="h-3 w-3" />
      Sauvegardé
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlanningSettingsPage() {
  const {
    settings,
    updateSetting,
    updateOpenDay,
    updatePublicHoliday,
    resetSettings,
  } = usePlanningSettingsStore();

  const [activeTab, setActiveTab] = React.useState<TabId>("regulatory");
  const [savedAt, setSavedAt] = React.useState<Date | null>(null);
  const firstRender = React.useRef(true);

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSavedAt(new Date());
  }, [settings]);

  const openDayCount = Object.values(settings.openDays).filter(Boolean).length;
  const holidayCount = Object.values(settings.publicHolidays).filter(
    Boolean,
  ).length;
  const dayStart = settings.dayHourStart;
  const dayEnd = settings.dayHourEnd;

  return (
    <div className="flex flex-col gap-5">
      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">
            Paramètres Planning
          </h1>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Modifications enregistrées automatiquement dans le navigateur.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0 mt-0.5">
          <SavedPill savedAt={savedAt} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              resetSettings();
              setSavedAt(null);
            }}
            className="h-8 border-border/60 text-xs"
          >
            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
            Réinitialiser
          </Button>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          const count =
            id === "opendays" ? openDayCount + holidayCount : undefined;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                active
                  ? "border-primary/40 bg-primary/15 text-primary shadow-sm shadow-primary/10"
                  : "border-border/50 bg-card/40 text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
              {count !== undefined && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-[10px] font-semibold leading-none",
                    active
                      ? "bg-primary/25 text-primary"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Tab: Temps réglementaire ──────────────────────────────────────── */}
      {activeTab === "regulatory" && (
        <Panel>
          <Row
            label="Repos quotidien minimum"
            hint="Temps entre la fin d'une journée et le début de la suivante."
          >
            <HNum
              value={settings.minDailyRestHours}
              onChange={(v) => updateSetting("minDailyRestHours", v)}
            />
          </Row>
          <Row
            label="Travail quotidien maximum"
            hint="Temps de travail effectif, pauses exclues."
          >
            <HNum
              value={settings.maxDailyWorkHours}
              onChange={(v) => updateSetting("maxDailyWorkHours", v)}
            />
          </Row>
          <Row
            label="Amplitude quotidienne maximum"
            hint="Temps entre la prise et la fin de service."
          >
            <HNum
              value={settings.maxDailyAmplitudeHours}
              onChange={(v) => updateSetting("maxDailyAmplitudeHours", v)}
            />
          </Row>
          <Row
            label="Travail hebdomadaire maximum"
            hint="Calculé sur une même semaine civile."
          >
            <HNum
              value={settings.maxWeeklyWorkHours}
              onChange={(v) => updateSetting("maxWeeklyWorkHours", v)}
              max={168}
            />
          </Row>
          <Row
            label="Durée comptée pour une journée d'absence"
            hint="Heures déduites lors d'une absence journée entière."
            last
          >
            <HNum
              value={settings.absenceDayCountedHours}
              onChange={(v) => updateSetting("absenceDayCountedHours", v)}
            />
          </Row>
        </Panel>
      )}

      {/* ── Tab: Jours d'ouverture ────────────────────────────────────────── */}
      {activeTab === "opendays" && (
        <div className="space-y-4">
          {/* Days of week */}
          <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm">
            <SectionLabel>Jours de la semaine</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {OPEN_DAYS.map(({ key, short, full }) => {
                const on = settings.openDays[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => updateOpenDay(key, !on)}
                    className={cn(
                      "relative flex flex-col items-center gap-0.5 rounded-xl border-2 px-3.5 py-2.5 transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                      on
                        ? "border-primary bg-primary/15 text-primary shadow-sm shadow-primary/10"
                        : "border-border/50 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {short}
                    </span>
                    <span className="text-[10px] font-normal opacity-70">
                      {full}
                    </span>
                    {on && (
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              {openDayCount} jour{openDayCount !== 1 ? "s" : ""} sélectionné
              {openDayCount !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Public holidays */}
          <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <SectionLabel>Jours fériés</SectionLabel>
              <span className="flex items-center gap-1 text-[11px] text-amber-400/80">
                <AlertCircle className="h-3 w-3" />
                Lundi de Pentecôte exclu
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0.5">
              {PUBLIC_HOLIDAYS.map(({ key, label, date }, i) => {
                const on = settings.publicHolidays[key];
                const isLast = i === PUBLIC_HOLIDAYS.length - 1;
                const isSecondToLast = i === PUBLIC_HOLIDAYS.length - 2;
                return (
                  <label
                    key={key}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors select-none",
                      on
                        ? "bg-primary/8 text-foreground"
                        : "text-muted-foreground hover:bg-muted/30 hover:text-foreground",
                      // remove bottom spacing on last row
                      (isLast || isSecondToLast) && "mb-0",
                    )}
                  >
                    <Checkbox
                      checked={on}
                      onCheckedChange={(c) =>
                        updatePublicHoliday(key, c === true)
                      }
                    />
                    <span className="flex-1 text-sm">{label}</span>
                    <span className="tabular-nums text-xs text-muted-foreground">
                      {date}
                    </span>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {holidayCount} jour{holidayCount !== 1 ? "s" : ""} férié
              {holidayCount !== 1 ? "s" : ""} sélectionné
              {holidayCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* ── Tab: Heures de travail ────────────────────────────────────────── */}
      {activeTab === "hours" && (
        <div className="space-y-4">
          {/* Day / night boundary */}
          <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm">
            <SectionLabel>Plage horaire journalière</SectionLabel>
            <div className="flex flex-wrap items-center gap-5 rounded-lg bg-muted/20 border border-border/40 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 border border-amber-500/20">
                  <Sun className="h-3.5 w-3.5 text-amber-400" />
                </div>
                <span className="text-xs text-muted-foreground">Début</span>
                <HNum
                  value={dayStart}
                  onChange={(v) => updateSetting("dayHourStart", v)}
                  min={0}
                  max={23}
                />
              </div>
              <div className="hidden sm:block h-px w-5 bg-border/60" />
              <div className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500/15 border border-indigo-500/20">
                  <Moon className="h-3.5 w-3.5 text-indigo-400" />
                </div>
                <span className="text-xs text-muted-foreground">Fin</span>
                <HNum
                  value={dayEnd}
                  onChange={(v) => updateSetting("dayHourEnd", v)}
                  min={0}
                  max={23}
                />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span>
                Jour&nbsp;
                <span className="font-semibold text-foreground">
                  {dayStart}h → {dayEnd}h
                </span>
              </span>
              <span className="text-border">·</span>
              <span>
                Nuit&nbsp;
                <span className="font-semibold text-foreground">
                  {dayEnd}h → {dayStart}h
                </span>
              </span>
            </div>
          </div>

          {/* Surcharge table */}
          <Panel>
            <div className="flex items-center justify-between py-2.5 border-b border-border/50">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Type d&apos;heure
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                Majoration
              </span>
            </div>
            <SurchargeRow
              label="Heures de nuit"
              range={`${dayEnd}h – ${dayStart}h`}
              value={settings.nightSurchargePercent}
              onChange={(v) => updateSetting("nightSurchargePercent", v)}
              accent="night"
            />
            <SurchargeRow
              label="Dimanche — jour"
              range={`${dayStart}h – ${dayEnd}h`}
              value={settings.sundayDaySurchargePercent}
              onChange={(v) => updateSetting("sundayDaySurchargePercent", v)}
              accent="sunday"
            />
            <SurchargeRow
              label="Dimanche — nuit"
              range={`${dayEnd}h – ${dayStart}h`}
              value={settings.sundayNightSurchargePercent}
              onChange={(v) => updateSetting("sundayNightSurchargePercent", v)}
              accent="sunday"
            />
            <SurchargeRow
              label="Férié — jour"
              range={`${dayStart}h – ${dayEnd}h`}
              value={settings.holidayDaySurchargePercent}
              onChange={(v) => updateSetting("holidayDaySurchargePercent", v)}
              accent="holiday"
            />
            <SurchargeRow
              label="Férié — nuit"
              range={`${dayEnd}h – ${dayStart}h`}
              value={settings.holidayNightSurchargePercent}
              onChange={(v) => updateSetting("holidayNightSurchargePercent", v)}
              accent="holiday"
              last
            />
          </Panel>
        </div>
      )}

      {/* ── Tab: Supplémentaires ──────────────────────────────────────────── */}
      {activeTab === "overtime" && (
        <div className="space-y-4">
          {/* Overtime */}
          <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm">
            <SectionLabel>Heures supplémentaires</SectionLabel>
            <div className="space-y-3">
              <TierBlock
                n={1}
                badge={`${settings.overtimeTier1StartHour}e → ${settings.overtimeTier1EndHour}e heure`}
              >
                <InputPair label="De la">
                  <HoursInput
                    value={settings.overtimeTier1StartHour}
                    onChange={(v) => updateSetting("overtimeTier1StartHour", v)}
                    min={1}
                    max={settings.overtimeTier1EndHour - 1}
                  />
                  <span className="text-xs text-muted-foreground">e h.</span>
                </InputPair>
                <InputPair label="à la">
                  <HoursInput
                    value={settings.overtimeTier1EndHour}
                    onChange={(v) => updateSetting("overtimeTier1EndHour", v)}
                    min={settings.overtimeTier1StartHour + 1}
                    max={999}
                  />
                  <span className="text-xs text-muted-foreground">e h.</span>
                </InputPair>
                <InputPair label="Majoration">
                  <HoursInput
                    value={settings.overtimeTier1Percent}
                    onChange={(v) => updateSetting("overtimeTier1Percent", v)}
                    min={0}
                    max={999}
                  />
                  <span className="text-xs font-semibold text-primary">%</span>
                </InputPair>
              </TierBlock>

              <TierBlock
                n={2}
                badge={`Au-delà de la ${settings.overtimeTier2StartHour}e heure`}
              >
                <InputPair label="À partir de la">
                  <HoursInput
                    value={settings.overtimeTier2StartHour}
                    onChange={(v) => updateSetting("overtimeTier2StartHour", v)}
                    min={settings.overtimeTier1EndHour}
                    max={999}
                  />
                  <span className="text-xs text-muted-foreground">e h.</span>
                </InputPair>
                <InputPair label="Majoration">
                  <HoursInput
                    value={settings.overtimeTier2Percent}
                    onChange={(v) => updateSetting("overtimeTier2Percent", v)}
                    min={0}
                    max={999}
                  />
                  <span className="text-xs font-semibold text-primary">%</span>
                </InputPair>
              </TierBlock>
            </div>
          </div>

          {/* Supplementary */}
          <div className="rounded-xl border border-border/60 bg-card/60 px-5 py-4 backdrop-blur-sm">
            <SectionLabel>Heures complémentaires (temps partiel)</SectionLabel>
            <div className="space-y-3">
              <TierBlock
                n={1}
                badge={`Jusqu'à 1/${settings.supplementaryTier1FractionDenominator} de la durée contractuelle`}
              >
                <InputPair label="Jusqu'à 1 /">
                  <HoursInput
                    value={settings.supplementaryTier1FractionDenominator}
                    onChange={(v) =>
                      updateSetting("supplementaryTier1FractionDenominator", v)
                    }
                    min={1}
                    max={99}
                  />
                </InputPair>
                <InputPair label="Majoration">
                  <HoursInput
                    value={settings.supplementaryTier1Percent}
                    onChange={(v) =>
                      updateSetting("supplementaryTier1Percent", v)
                    }
                    min={0}
                    max={999}
                  />
                  <span className="text-xs font-semibold text-primary">%</span>
                </InputPair>
              </TierBlock>

              <TierBlock
                n={2}
                badge={`Jusqu'à 1/${settings.supplementaryTier2FractionDenominator} de la durée contractuelle`}
              >
                <InputPair label="Jusqu'à 1 /">
                  <HoursInput
                    value={settings.supplementaryTier2FractionDenominator}
                    onChange={(v) =>
                      updateSetting("supplementaryTier2FractionDenominator", v)
                    }
                    min={1}
                    max={99}
                  />
                </InputPair>
                <InputPair label="Majoration">
                  <HoursInput
                    value={settings.supplementaryTier2Percent}
                    onChange={(v) =>
                      updateSetting("supplementaryTier2Percent", v)
                    }
                    min={0}
                    max={999}
                  />
                  <span className="text-xs font-semibold text-primary">%</span>
                </InputPair>
              </TierBlock>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Paniers ─────────────────────────────────────────────────── */}
      {activeTab === "meal" && (
        <Panel>
          <Row
            label="Durée minimale de travail continu"
            hint="Au-delà de ce seuil, 1 panier repas est attribué par journée de travail."
            last
          >
            <HNum
              value={settings.mealAllowanceMinContinuousHours}
              onChange={(v) =>
                updateSetting("mealAllowanceMinContinuousHours", v)
              }
            />
          </Row>
          <div className="mb-4 mt-1 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">
                Règle active :{" "}
              </span>
              Tout agent travaillant plus de{" "}
              <span className="font-semibold text-primary">
                {settings.mealAllowanceMinContinuousHours}h
              </span>{" "}
              en continu bénéficie d&apos;un panier repas.
            </p>
          </div>
        </Panel>
      )}
    </div>
  );
}
