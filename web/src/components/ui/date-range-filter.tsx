"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateFilterPreset } from "@/lib/date-range";

const PRESET_LABELS: Record<DateFilterPreset, string> = {
  all: "Toutes les dates",
  today: "Aujourd'hui",
  week: "Cette semaine",
  month: "Ce mois",
  year: "Cette année",
  custom: "Période personnalisée",
};

const WEEKDAY_LABELS = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

const MONTH_LABELS = [
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

interface DateRangeFilterProps {
  preset: DateFilterPreset;
  customStartDate: string;
  customEndDate: string;
  onPresetChange: (preset: DateFilterPreset) => void;
  onCustomStartDateChange: (value: string) => void;
  onCustomEndDateChange: (value: string) => void;
  label?: string;
  className?: string;
}

function parseDateInput(value: string): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatAsInputDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatAsFrenchDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

function buildCalendarDays(monthAnchor: Date): Date[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const mondayIndex =
    firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
  const gridStart = new Date(year, month, 1 - mondayIndex);

  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(gridStart);
    day.setDate(gridStart.getDate() + i);
    return day;
  });
}

export function DateRangeFilter({
  preset,
  customStartDate,
  customEndDate,
  onPresetChange,
  onCustomStartDateChange,
  onCustomEndDateChange,
  label,
  className,
}: DateRangeFilterProps) {
  const startDate = parseDateInput(customStartDate);
  const endDate = parseDateInput(customEndDate);

  const [monthAnchor, setMonthAnchor] = useState<Date>(startDate ?? new Date());
  const [isOpen, setIsOpen] = useState(false);

  const calendarDays = useMemo(
    () => buildCalendarDays(monthAnchor),
    [monthAnchor],
  );

  const rangeLabel = useMemo(() => {
    if (startDate && endDate) {
      return `${formatAsFrenchDate(startDate)} - ${formatAsFrenchDate(endDate)}`;
    }
    if (startDate) {
      return `À partir du ${formatAsFrenchDate(startDate)}`;
    }
    if (endDate) {
      return `Jusqu'au ${formatAsFrenchDate(endDate)}`;
    }
    return "Sélectionner une période";
  }, [startDate, endDate]);

  const handleSelectDay = (day: Date) => {
    const dayDate = new Date(day.getFullYear(), day.getMonth(), day.getDate());

    if (!startDate || (startDate && endDate)) {
      onCustomStartDateChange(formatAsInputDate(dayDate));
      onCustomEndDateChange("");
      return;
    }

    if (dayDate.getTime() >= startDate.getTime()) {
      onCustomEndDateChange(formatAsInputDate(dayDate));
      return;
    }

    onCustomStartDateChange(formatAsInputDate(dayDate));
    onCustomEndDateChange(formatAsInputDate(startDate));
  };

  const handlePreviousMonth = () => {
    setMonthAnchor(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  };

  const handleNextMonth = () => {
    setMonthAnchor(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  };

  return (
    <div className={cn(label ? "space-y-2" : "", className)}>
      {label ? <Label>{label}</Label> : null}
      <div className="flex flex-col gap-2 md:flex-row">
        <Select
          value={preset}
          onValueChange={(value) => onPresetChange(value as DateFilterPreset)}
        >
          <SelectTrigger className="w-full md:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{PRESET_LABELS.all}</SelectItem>
            <SelectItem value="today">{PRESET_LABELS.today}</SelectItem>
            <SelectItem value="week">{PRESET_LABELS.week}</SelectItem>
            <SelectItem value="month">{PRESET_LABELS.month}</SelectItem>
            <SelectItem value="year">{PRESET_LABELS.year}</SelectItem>
            <SelectItem value="custom">{PRESET_LABELS.custom}</SelectItem>
          </SelectContent>
        </Select>

        {preset === "custom" && (
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="justify-start gap-2 w-full md:w-[320px]"
              >
                <Calendar className="h-4 w-4" />
                <span className="truncate">{rangeLabel}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[320px] p-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handlePreviousMonth}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <p className="text-sm font-medium">
                    {MONTH_LABELS[monthAnchor.getMonth()]}{" "}
                    {monthAnchor.getFullYear()}
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleNextMonth}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
                  {WEEKDAY_LABELS.map((weekday) => (
                    <span key={weekday} className="py-1">
                      {weekday}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day) => {
                    const isCurrentMonth =
                      day.getMonth() === monthAnchor.getMonth();
                    const isRangeStart =
                      !!startDate &&
                      day.getFullYear() === startDate.getFullYear() &&
                      day.getMonth() === startDate.getMonth() &&
                      day.getDate() === startDate.getDate();
                    const isRangeEnd =
                      !!endDate &&
                      day.getFullYear() === endDate.getFullYear() &&
                      day.getMonth() === endDate.getMonth() &&
                      day.getDate() === endDate.getDate();
                    const inRange =
                      !!startDate &&
                      !!endDate &&
                      day.getTime() > startDate.getTime() &&
                      day.getTime() < endDate.getTime();

                    return (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() => handleSelectDay(day)}
                        className={cn(
                          "h-9 rounded-md text-sm transition-colors",
                          !isCurrentMonth && "text-muted-foreground/50",
                          inRange && "bg-primary/15",
                          (isRangeStart || isRangeEnd) &&
                            "bg-primary text-primary-foreground",
                          !(isRangeStart || isRangeEnd) && "hover:bg-accent",
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    1er clic: début - 2e clic: fin
                  </p>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onCustomStartDateChange("");
                      onCustomEndDateChange("");
                    }}
                  >
                    Effacer
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}
