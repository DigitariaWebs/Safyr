// Static Tailwind class strings — all must appear as complete literals
// so Tailwind's scanner generates them at build time.

export type SiteColor =
  | "blue"
  | "emerald"
  | "amber"
  | "violet"
  | "red"
  | "pink"
  | "cyan"
  | "orange"
  | "teal"
  | "rose"
  | "indigo";

export interface SiteColorClasses {
  bg: string; // solid background (group headers, badges)
  bgMuted: string; // translucent background (cards, highlights)
  text: string; // colored text
  border: string; // colored border
  dot: string; // small dot indicator
}

export const SITE_COLOR_MAP: Record<SiteColor, SiteColorClasses> = {
  blue: {
    bg: "bg-blue-500",
    bgMuted: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500",
    dot: "bg-blue-500",
  },
  emerald: {
    bg: "bg-emerald-500",
    bgMuted: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500",
    dot: "bg-emerald-500",
  },
  amber: {
    bg: "bg-amber-500",
    bgMuted: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500",
    dot: "bg-amber-500",
  },
  violet: {
    bg: "bg-violet-500",
    bgMuted: "bg-violet-500/15",
    text: "text-violet-400",
    border: "border-violet-500",
    dot: "bg-violet-500",
  },
  red: {
    bg: "bg-red-500",
    bgMuted: "bg-red-500/15",
    text: "text-red-400",
    border: "border-red-500",
    dot: "bg-red-500",
  },
  pink: {
    bg: "bg-pink-500",
    bgMuted: "bg-pink-500/15",
    text: "text-pink-400",
    border: "border-pink-500",
    dot: "bg-pink-500",
  },
  cyan: {
    bg: "bg-cyan-500",
    bgMuted: "bg-cyan-500/15",
    text: "text-cyan-400",
    border: "border-cyan-500",
    dot: "bg-cyan-500",
  },
  orange: {
    bg: "bg-orange-500",
    bgMuted: "bg-orange-500/15",
    text: "text-orange-400",
    border: "border-orange-500",
    dot: "bg-orange-500",
  },
  teal: {
    bg: "bg-teal-500",
    bgMuted: "bg-teal-500/15",
    text: "text-teal-400",
    border: "border-teal-500",
    dot: "bg-teal-500",
  },
  rose: {
    bg: "bg-rose-500",
    bgMuted: "bg-rose-500/15",
    text: "text-rose-400",
    border: "border-rose-500",
    dot: "bg-rose-500",
  },
  indigo: {
    bg: "bg-indigo-500",
    bgMuted: "bg-indigo-500/15",
    text: "text-indigo-400",
    border: "border-indigo-500",
    dot: "bg-indigo-500",
  },
};

export const SITE_COLOR_OPTIONS: SiteColor[] = [
  "blue",
  "emerald",
  "amber",
  "violet",
  "red",
  "pink",
  "cyan",
  "orange",
  "teal",
  "rose",
  "indigo",
];

export function getSiteColorClasses(color: SiteColor): SiteColorClasses {
  return SITE_COLOR_MAP[color];
}
