export type ColorSchemeName = "light" | "dark";

/**
 * Semantic color tokens aligned with the web app.
 * Keep these names consistent (background/foreground/card/primary/etc.).
 */
export const colors = {
  light: {
    background: "hsl(0 0% 100%)",
    foreground: "hsl(220 15% 10%)",

    card: "hsl(0 0% 100%)",
    cardForeground: "hsl(220 15% 10%)",

    popover: "hsl(0 0% 100%)",
    popoverForeground: "hsl(220 15% 10%)",

    primary: "hsl(188 65% 52%)",
    primaryForeground: "hsl(220 15% 10%)",

    secondary: "hsl(220 10% 96%)",
    secondaryForeground: "hsl(220 15% 20%)",

    muted: "hsl(220 10% 97%)",
    mutedForeground: "hsl(220 8% 45%)",

    accent: "hsl(188 60% 95%)",
    accentForeground: "hsl(188 100% 30%)",

    destructive: "hsl(0 72% 51%)",
    destructiveForeground: "hsl(0 0% 98%)",

    border: "hsl(220 13% 91%)",
    input: "hsl(220 13% 91%)",
    ring: "hsl(188 65% 52%)",

    success: "hsl(142 70% 40%)",
    warning: "hsl(38 92% 50%)",
    info: "hsl(188 65% 52%)",
  },
  dark: {
    background: "hsl(245 25% 12%)",
    foreground: "hsl(0 0% 95%)",

    card: "hsl(245 22% 16%)",
    cardForeground: "hsl(0 0% 95%)",

    popover: "hsl(245 24% 14%)",
    popoverForeground: "hsl(0 0% 95%)",

    primary: "hsl(195 70% 65%)",
    primaryForeground: "hsl(245 20% 15%)",

    secondary: "hsl(245 18% 22%)",
    secondaryForeground: "hsl(0 0% 98%)",

    muted: "hsl(245 16% 20%)",
    mutedForeground: "hsl(195 10% 70%)",

    accent: "hsl(195 50% 30%)",
    accentForeground: "hsl(0 0% 98%)",

    destructive: "hsl(0 62% 45%)",
    destructiveForeground: "hsl(0 0% 98%)",

    border: "hsl(245 15% 25%)",
    input: "hsl(245 15% 25%)",
    ring: "hsl(195 70% 65%)",

    success: "hsl(145 60% 45%)",
    warning: "hsl(38 92% 55%)",
    info: "hsl(195 70% 65%)",
  },
} as const;

export type ThemeColors = (typeof colors)[ColorSchemeName];

