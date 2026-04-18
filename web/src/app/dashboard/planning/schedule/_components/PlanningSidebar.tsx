"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  FileText,
  PanelRightClose,
  Scissors,
} from "lucide-react";

type ViewType = "daily" | "weekly" | "monthly";

export type PlanningSummary = {
  totalHours: number;
  overtimeHours: number;
  mealCount: number;
  absenceCount: number;
};

type Props = {
  periodLabel: string;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  viewType: ViewType;
  onViewChange: (v: ViewType) => void;
  simulationMode: boolean;
  onToggleSimulation: () => void;
  onExportPDF: () => void;
  summary: PlanningSummary;
  onClose: () => void;
};

export function PlanningSidebar({
  periodLabel,
  onPrev,
  onNext,
  onToday,
  viewType,
  onViewChange,
  simulationMode,
  onToggleSimulation,
  onExportPDF,
  summary,
  onClose,
}: Props) {
  const summaryItems = [
    {
      label: "Heures totales",
      value: `${summary.totalHours.toFixed(1)}h`,
      icon: Clock,
      tint: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    },
    {
      label: "Heures sup.",
      value: `${summary.overtimeHours.toFixed(1)}h`,
      icon: AlertCircle,
      tint: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Repas",
      value: summary.mealCount.toString(),
      icon: FileText,
      tint: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    {
      label: "Absences",
      value: summary.absenceCount.toString(),
      icon: Ban,
      tint: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
    },
  ] as const;

  return (
    <aside className="hidden lg:flex fixed right-4 top-32 bottom-6 z-50 w-80 flex-col bg-background/95 backdrop-blur-md border border-border/50 rounded-xl shadow-lg overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/40">
        <h2 className="text-sm font-semibold tracking-tight">
          Résumé & détails
        </h2>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onClose}
          title="Masquer le panneau"
        >
          <PanelRightClose className="h-4 w-4" />
        </Button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
        {/* Période */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Période
          </h3>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={onPrev}
              title="Période précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="flex-1 text-center text-sm font-semibold capitalize truncate">
              {periodLabel}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={onNext}
              title="Période suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full h-9"
            onClick={onToday}
          >
            Aujourd&apos;hui
          </Button>
        </section>

        {/* Vue */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Vue
          </h3>
          <div className="flex rounded-lg border bg-muted/30 p-1 text-sm">
            {(["daily", "weekly", "monthly"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onViewChange(v)}
                className={`flex-1 px-3 py-1.5 rounded-md transition font-medium ${
                  viewType === v
                    ? "bg-background shadow-sm text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {v === "daily" ? "Jour" : v === "weekly" ? "Semaine" : "Mois"}
              </button>
            ))}
          </div>
        </section>

        {/* Actions */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Actions
          </h3>
          <div className="space-y-2">
            <Button
              size="sm"
              variant={simulationMode ? "destructive" : "outline"}
              className="w-full h-9 gap-2 justify-start"
              onClick={onToggleSimulation}
            >
              <Scissors className="h-4 w-4" />
              {simulationMode ? "Simulation active" : "Simulation"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full h-9 gap-2 justify-start"
              onClick={onExportPDF}
            >
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
          </div>
        </section>

        {/* Résumé */}
        <section className="space-y-2">
          <h3 className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Résumé
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {summaryItems.map(({ label, value, icon: Icon, tint }) => (
              <div
                key={label}
                className="rounded-lg border border-border/40 bg-background p-2.5"
              >
                <div
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-md ${tint}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="mt-1.5 text-xl font-bold leading-none">
                  {value}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  );
}
