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

    // Secondary colors
    secondary: string;
    secondaryForeground: string;

    // Status colors
    success: string;
    warning: string;
    error: string;
    info: string;
    destructive: string;

    // Border and divider
    border: string;
    divider: string;
    borderSubtle: string;

    // Foreground on status colors
    destructiveForeground: string;

    // Interactive states
    disabled: string;
    placeholder: string;
}

// Helper function to convert HSL string to hex for React Native
function hslToHex(hsl: string): string {
    const match = hsl.match(/(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%/);
    if (!match) return "#000000";
    const h = parseFloat(match[1]) / 360;
    const s = parseFloat(match[2]) / 100;
    const l = parseFloat(match[3]) / 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    if (h < 1/6) { r = c; g = x; b = 0; }
    else if (h < 2/6) { r = x; g = c; b = 0; }
    else if (h < 3/6) { r = 0; g = c; b = x; }
    else if (h < 4/6) { r = 0; g = x; b = c; }
    else if (h < 5/6) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Light theme (keeping existing for compatibility)
const lightColors: ThemeColors = {
    background: hslToHex("0 0% 100%"),
    surface: hslToHex("220 10% 96%"),
    surfaceVariant: hslToHex("220 10% 97%"),
    muted: hslToHex("220 10% 97%"),
    card: hslToHex("0 0% 100%"),

    text: hslToHex("220 15% 10%"),
    textSecondary: hslToHex("220 8% 45%"),
    textTertiary: hslToHex("220 8% 45%"),
    foreground: hslToHex("220 15% 10%"),
    mutedForeground: hslToHex("220 8% 45%"),
    cardForeground: hslToHex("220 15% 10%"),

    primary: hslToHex("200 100% 55%"),        // Vibrant cyan-blue for light theme
    primaryVariant: hslToHex("200 100% 45%"), // Deeper cyan-blue variant
    onPrimary: hslToHex("0 0% 100%"),         // White text on primary
    primaryForeground: hslToHex("0 0% 100%"), // White text on primary buttons

    accent: hslToHex("200 60% 90%"),         // Light cyan accent
    onAccent: hslToHex("200 100% 40%"),       // Dark cyan text on accent
    accentForeground: hslToHex("200 100% 40%"),

    secondary: hslToHex("220 10% 96%"), // Light gray/white background
    secondaryForeground: hslToHex("220 15% 10%"), // Black text on white buttons

    success: hslToHex("142 70% 40%"),
    warning: hslToHex("38 92% 50%"),
    error: hslToHex("0 72% 51%"),
    info: hslToHex("210 60% 65%"),
    destructive: hslToHex("0 72% 51%"),

    border: hslToHex("220 15% 88%"),         // Subtle border
    divider: hslToHex("220 15% 88%"),        // Divider
    borderSubtle: "rgba(0, 0, 0, 0.1)",

    destructiveForeground: "#ffffff",

    disabled: hslToHex("220 8% 45%"),
    placeholder: hslToHex("220 8% 45%"),
};

const darkColors: ThemeColors = {
    // Background: Navy blue (matching web dark theme)
    background: "#0f172a",
    surface: "#1e293b",
    surfaceVariant: "#172033",
    muted: "#1e2a3d",
    card: "#1e293b",

    // Text: Soft white
    text: "#f0f0f0",
    textSecondary: "#94a3b8",
    textTertiary: "#64748b",
    foreground: "#f0f0f0",
    mutedForeground: "#8b95a8",
    cardForeground: "#f0f0f0",

    // Primary: Cyan (matching web)
    primary: "#22d3ee",
    primaryVariant: "#06b6d4",
    onPrimary: "#0f172a",
    primaryForeground: "#0f172a",

    // Accent
    accent: "#1a3a4a",
    onAccent: "#67e8f9",
    accentForeground: "#67e8f9",

    // Secondary
    secondary: "#293548",
    secondaryForeground: "#f0f0f0",

    // Status colors
    success: "#34d399",
    warning: "#fbbf24",
    error: "#ef4444",
    info: "#22d3ee",
    destructive: "#ef4444",

    // Border: Subtle navy-tinted
    border: "#2d3f55",
    divider: "#253347",
    borderSubtle: "rgba(45, 63, 85, 0.35)",

    destructiveForeground: "#ffffff",

    // Interactive states
    disabled: "#334155",
    placeholder: "#64748b",
};

export const colors: Record<ColorSchemeName, ThemeColors> = {
    light: lightColors,
    dark: darkColors,
};
