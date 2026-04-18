"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

import type { AgentShift, TimeOffRequest } from "@/lib/types";
import type { PlanningSettings } from "@/lib/stores/planningSettingsStore";
import { isoWeekNumber } from "./date-utils";

export function HourDetailsSection({
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

          const wk = isoWeekNumber(date);
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
