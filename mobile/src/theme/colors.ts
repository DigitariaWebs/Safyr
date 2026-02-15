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
    borderPrimary: string; // Dark cyan border for cards and primary elements

    // Interactive states
    disabled: string;
    placeholder: string;

    // Glow effects (for premium feel)
    glowPrimary: string;
    glowPrimarySubtle: string;
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

    primary: hslToHex("210 60% 65%"),
    primaryVariant: hslToHex("210 70% 50%"),
    onPrimary: hslToHex("0 0% 100%"),
    primaryForeground: hslToHex("0 0% 100%"),

    accent: hslToHex("210 50% 92%"),
    onAccent: hslToHex("210 70% 40%"),
    accentForeground: hslToHex("210 70% 40%"),

    secondary: hslToHex("220 10% 96%"), // Light gray/white background
    secondaryForeground: hslToHex("220 15% 10%"), // Black text on white buttons

    success: hslToHex("142 70% 40%"),
    warning: hslToHex("38 92% 50%"),
    error: hslToHex("0 72% 51%"),
    info: hslToHex("210 60% 65%"),
    destructive: hslToHex("0 72% 51%"),

    border: hslToHex("220 13% 91%"),
    divider: hslToHex("220 13% 91%"),
    borderPrimary: hslToHex("195 60% 45%"), // Dark cyan border for light theme

    disabled: hslToHex("220 8% 45%"),
    placeholder: hslToHex("220 8% 45%"),

    glowPrimary: hslToHex("210 60% 65%"),
    glowPrimarySubtle: hslToHex("210 60% 65%"),
};

// Premium Dark Blue Light Theme
const darkColors: ThemeColors = {
    // Background: Very dark blue, slightly luminous (not pure black)
    background: hslToHex("220 35% 8%"),      // Deep dark blue with subtle luminosity
    surface: hslToHex("220 30% 12%"),        // Slightly lighter dark blue
    surfaceVariant: hslToHex("220 28% 10%"), // Variant surface
    muted: hslToHex("220 25% 15%"),          // Muted background
    card: hslToHex("220 30% 12%"),           // Card background (slightly lighter)

    // Text: Soft white, optimized for readability
    text: hslToHex("0 0% 96%"),              // Soft white (not pure white)
    textSecondary: hslToHex("220 15% 75%"),  // Secondary text (softer)
    textTertiary: hslToHex("220 15% 60%"),   // Tertiary text
    foreground: hslToHex("0 0% 96%"),         // Main foreground
    mutedForeground: hslToHex("220 15% 70%"), // Muted foreground
    cardForeground: hslToHex("0 0% 96%"),     // Card text

    // Primary: Cyan-blue ("blue light") that glows subtly
    primary: hslToHex("195 85% 65%"),        // Cyan-blue - main accent (shifted from 210° to 195° for cyan)
    primaryVariant: hslToHex("195 80% 55%"), // Slightly darker cyan variant
    onPrimary: hslToHex("220 35% 8%"),     // Dark text on blue (for contrast)
    primaryForeground: hslToHex("0 0% 98%"),  // Light text on blue

    // Accent: Subtle cyan-blue accent
    accent: hslToHex("195 40% 20%"),         // Darker cyan-blue accent
    onAccent: hslToHex("195 85% 70%"),       // Light cyan-blue on accent
    accentForeground: hslToHex("195 85% 70%"),

    // Secondary: Light surface for secondary buttons (white/light background)
    secondary: hslToHex("220 10% 96%"),       // Light gray/white background for secondary buttons
    secondaryForeground: hslToHex("220 15% 10%"), // Black text on white secondary buttons

    // Status colors (refined for dark theme)
    success: hslToHex("145 65% 50%"),        // Soft green
    warning: hslToHex("38 85% 55%"),         // Soft amber
    error: hslToHex("0 70% 55%"),            // Soft red
    info: hslToHex("195 85% 65%"),           // Cyan-blue (same as primary)
    destructive: hslToHex("0 70% 55%"),      // Soft red

    // Border: Very subtle, low contrast, elegant
    border: hslToHex("220 20% 18%"),         // Very subtle border
    divider: hslToHex("220 20% 16%"),       // Subtle divider
    borderPrimary: hslToHex("195 70% 35%"), // Dark cyan border for cards and primary elements

    // Interactive states
    disabled: hslToHex("220 15% 30%"),       // Disabled state
    placeholder: hslToHex("220 15% 50%"),    // Placeholder text

    // Glow effects for premium feel
    glowPrimary: hslToHex("195 85% 65%"),    // Primary glow color (cyan-blue)
    glowPrimarySubtle: hslToHex("195 85% 65%"), // Subtle glow variant (cyan-blue)
};

export const colors: Record<ColorSchemeName, ThemeColors> = {
    light: lightColors,
    dark: darkColors,
};
