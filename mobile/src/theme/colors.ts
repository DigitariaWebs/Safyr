export type ColorSchemeName = "light" | "dark";

export interface ThemeColors {
    // Background colors
    background: string;
    surface: string;
    surfaceVariant: string;
    muted: string;
    card: string;

    // Text colors
    text: string;
    textSecondary: string;
    textTertiary: string;
    foreground: string;
    mutedForeground: string;
    cardForeground: string;

    // Primary colors
    primary: string;
    primaryVariant: string;
    onPrimary: string;
    primaryForeground: string;

    // Accent colors
    accent: string;
    onAccent: string;
    accentForeground: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    destructive: string;

    // Border and divider
    border: string;
    divider: string;

    // Interactive states
    disabled: string;
    placeholder: string;
}

const lightColors: ThemeColors = {
    // Background colors
    background: "#FFFFFF",
    surface: "#F5F5F5",
    surfaceVariant: "#E8E8E8",
    muted: "#F5F5F5",
    card: "#FFFFFF",

    // Text colors
    text: "#1A1A1A",
    textSecondary: "#666666",
    textTertiary: "#999999",
    foreground: "#1A1A1A",
    mutedForeground: "#666666",
    cardForeground: "#1A1A1A",

    // Primary colors
    primary: "#007AFF",
    primaryVariant: "#0051D5",
    onPrimary: "#FFFFFF",
    primaryForeground: "#FFFFFF",

    // Accent colors
    accent: "#FF9500",
    onAccent: "#FFFFFF",
    accentForeground: "#FFFFFF",

    // Status colors
    success: "#34C759",
    warning: "#FF9500",
    error: "#FF3B30",
    info: "#5AC8FA",
    destructive: "#FF3B30",

    // Border and divider
    border: "#D1D1D6",
    divider: "#E5E5EA",

    // Interactive states
    disabled: "#C7C7CC",
    placeholder: "#A0A0A0",
};

const darkColors: ThemeColors = {
    // Background colors
    background: "#000000",
    surface: "#1C1C1E",
    surfaceVariant: "#2C2C2E",
    muted: "#2C2C2E",
    card: "#1C1C1E",

    // Text colors
    text: "#FFFFFF",
    textSecondary: "#EBEBF5",
    textTertiary: "#8E8E93",
    foreground: "#FFFFFF",
    mutedForeground: "#8E8E93",
    cardForeground: "#FFFFFF",

    // Primary colors
    primary: "#0A84FF",
    primaryVariant: "#409CFF",
    onPrimary: "#FFFFFF",
    primaryForeground: "#FFFFFF",

    // Accent colors
    accent: "#FF9F0A",
    onAccent: "#000000",
    accentForeground: "#000000",

    // Status colors
    success: "#30D158",
    warning: "#FF9F0A",
    error: "#FF453A",
    info: "#64D2FF",
    destructive: "#FF453A",

    // Border and divider
    border: "#38383A",
    divider: "#48484A",

    // Interactive states
    disabled: "#48484A",
    placeholder: "#636366",
};

export const colors: Record<ColorSchemeName, ThemeColors> = {
    light: lightColors,
    dark: darkColors,
};
