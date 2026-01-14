/**
 * Safyr shared design tokens.
 *
 * Goal: keep color semantics consistent between web + mobile.
 * - Mobile (NativeWind/Tailwind v3) prefers HSL channel strings (e.g. "245 22% 13%")
 * - Web can consume these tokens too, or keep using its CSS OKLCH variables for now.
 */

/** @type {{ light: Record<string, string>, dark: Record<string, string> }} */
const hsl = {
  light: {
    background: "0 0% 100%",
    foreground: "220 15% 10%",
    card: "0 0% 100%",
    "card-foreground": "220 15% 10%",
    popover: "0 0% 100%",
    "popover-foreground": "220 15% 10%",
    primary: "188 65% 52%",
    "primary-foreground": "220 15% 10%",
    secondary: "220 10% 96%",
    "secondary-foreground": "220 15% 20%",
    muted: "220 10% 97%",
    "muted-foreground": "220 8% 45%",
    accent: "188 60% 95%",
    "accent-foreground": "188 100% 30%",
    destructive: "0 72% 51%",
    "destructive-foreground": "0 0% 98%",
    border: "220 13% 91%",
    input: "220 13% 91%",
    ring: "188 65% 52%",
    success: "142 70% 40%",
    "success-foreground": "0 0% 98%",
    warning: "38 92% 50%",
    "warning-foreground": "0 0% 15%",
    info: "188 65% 52%",
    "info-foreground": "220 15% 10%",
    neutral: "220 5% 50%",
    "neutral-foreground": "0 0% 98%",

    "sidebar-background": "0 0% 98%",
    "sidebar-foreground": "0 0% 45%",
    "sidebar-primary": "188 65% 52%",
    "sidebar-primary-foreground": "0 0% 100%",
    "sidebar-accent": "188 60% 95%",
    "sidebar-accent-foreground": "188 100% 30%",
    "sidebar-border": "190 10% 90%",
    "sidebar-ring": "188 65% 52%",
  },
  dark: {
    background: "245 25% 12%",
    foreground: "0 0% 95%",
    card: "245 22% 16%",
    "card-foreground": "0 0% 95%",
    popover: "245 24% 14%",
    "popover-foreground": "0 0% 95%",
    primary: "195 70% 65%",
    "primary-foreground": "245 20% 15%",
    secondary: "245 18% 22%",
    "secondary-foreground": "0 0% 98%",
    muted: "245 16% 20%",
    "muted-foreground": "195 10% 70%",
    accent: "195 50% 30%",
    "accent-foreground": "0 0% 98%",
    destructive: "0 62% 45%",
    "destructive-foreground": "0 0% 98%",
    border: "245 15% 25%",
    input: "245 15% 25%",
    ring: "195 70% 65%",
    success: "145 60% 45%",
    "success-foreground": "0 0% 98%",
    warning: "38 92% 55%",
    "warning-foreground": "0 0% 10%",
    info: "195 70% 65%",
    "info-foreground": "245 20% 15%",
    neutral: "220 5% 45%",
    "neutral-foreground": "0 0% 98%",

    "sidebar-background": "245 22% 13%",
    "sidebar-foreground": "0 0% 95%",
    "sidebar-primary": "195 70% 65%",
    "sidebar-primary-foreground": "245 20% 15%",
    "sidebar-accent": "245 18% 20%",
    "sidebar-accent-foreground": "195 70% 75%",
    "sidebar-border": "245 15% 25%",
    "sidebar-ring": "195 70% 65%",
  },
};

/** @type {{ radius: { md: string, lg: string, xl: string } }} */
const radii = {
  md: "0.625rem",
  lg: "0.75rem",
  xl: "1rem",
};

module.exports = {
  hsl,
  radii,
};

