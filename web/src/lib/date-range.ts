export type DateFilterPreset =
  | "all"
  | "today"
  | "week"
  | "month"
  | "year"
  | "custom";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

function startOfWeek(date: Date): Date {
  const d = startOfDay(date);
  const day = d.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - diffToMonday);
  return d;
}

export function buildDateRange(
  preset: DateFilterPreset,
  customStartDate?: string,
  customEndDate?: string,
): DateRange {
  const now = new Date();

  switch (preset) {
    case "today":
      return { from: startOfDay(now), to: endOfDay(now) };
    case "week": {
      const from = startOfWeek(now);
      const to = endOfDay(
        new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6),
      );
      return { from, to };
    }
    case "month":
      return {
        from: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
        to: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      };
    case "year":
      return {
        from: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
        to: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      };
    case "custom":
      return {
        from: customStartDate ? new Date(`${customStartDate}T00:00:00`) : null,
        to: customEndDate ? new Date(`${customEndDate}T23:59:59.999`) : null,
      };
    case "all":
    default:
      return { from: null, to: null };
  }
}

export function isDateInRange(value: string | Date, range: DateRange): boolean {
  const date = value instanceof Date ? value : new Date(value);

  if (range.from && date < range.from) {
    return false;
  }
  if (range.to && date > range.to) {
    return false;
  }

  return true;
}
