"use client";

import * as React from "react";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface Period {
  id: string;
  month: number;
  year: number;
  label: string;
}

interface PeriodSelectorProps {
  periods: Period[];
  selectedPeriod: Period;
  onPeriodChange: (period: Period) => void;
  label?: string;
  showIcon?: boolean;
  className?: string;
}

export function PeriodSelector({
  periods,
  selectedPeriod,
  onPeriodChange,
  label = "Période",
  showIcon = true,
  className,
}: PeriodSelectorProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      <div className="flex items-center gap-2">
        {showIcon && <Calendar className="h-4 w-4 text-muted-foreground" />}
        <Select
          value={selectedPeriod.id}
          onValueChange={(value) => {
            const period = periods.find((p) => p.id === value);
            if (period) onPeriodChange(period);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {periods.map((period) => (
              <SelectItem key={period.id} value={period.id}>
                {period.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Helper function to generate periods
export function generatePeriods(
  startYear: number,
  startMonth: number,
  count: number
): Period[] {
  const periods: Period[] = [];
  let year = startYear;
  let month = startMonth;

  const monthNames = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  for (let i = 0; i < count; i++) {
    periods.unshift({
      id: `period-${year}-${String(month).padStart(2, "0")}`,
      month,
      year,
      label: `${monthNames[month - 1]} ${year}`,
    });

    month--;
    if (month === 0) {
      month = 12;
      year--;
    }
  }

  return periods;
}
