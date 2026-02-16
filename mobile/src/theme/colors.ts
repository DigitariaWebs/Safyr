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
    borderPrimary: hslToHex("200 80% 50%"),  // Vibrant cyan border for light theme

    disabled: hslToHex("220 8% 45%"),
    placeholder: hslToHex("220 8% 45%"),

    glowPrimary: hslToHex("210 60% 65%"),
    glowPrimarySubtle: hslToHex("210 60% 65%"),
};

// Premium Dark Blue Light Theme
const darkColors: ThemeColors = {
    // Background: Black cyan (very dark cyan, almost black)
    background: hslToHex("180 100% 8%"),       // Black cyan background - very dark with cyan tint
    surface: hslToHex("180 90% 12%"),        // Elevated surface with cyan tint
    surfaceVariant: hslToHex("180 95% 10%"),  // Variant surface
    muted: hslToHex("180 85% 14%"),          // Muted background
    card: hslToHex("180 90% 12%"),           // Card background with modern depth

    // Text: Soft white, optimized for readability
    text: hslToHex("0 0% 96%"),              // Soft white (not pure white)
    textSecondary: hslToHex("220 15% 75%"),  // Secondary text (softer)
    textTertiary: hslToHex("220 15% 60%"),   // Tertiary text
    foreground: hslToHex("0 0% 96%"),         // Main foreground
    mutedForeground: hslToHex("220 15% 70%"), // Muted foreground
    cardForeground: hslToHex("0 0% 96%"),     // Card text

    // Primary: Vibrant cyan-blue inspired by modern templates
    primary: hslToHex("200 100% 60%"),        // Bright cyan-blue - modern and vibrant
    primaryVariant: hslToHex("200 100% 50%"), // Deeper cyan-blue for hover/pressed states
    onPrimary: hslToHex("0 0% 100%"),         // Pure white text on primary
    primaryForeground: hslToHex("0 0% 100%"), // White text on primary buttons

    // Accent: Modern cyan accent with gradient support
    accent: hslToHex("200 80% 25%"),          // Dark cyan-blue for accents
    onAccent: hslToHex("200 100% 70%"),       // Light cyan on accent
    accentForeground: hslToHex("200 100% 70%"),

    // Secondary: Light surface for secondary buttons (white/light background)
    secondary: hslToHex("220 10% 96%"),       // Light gray/white background for secondary buttons
    secondaryForeground: hslToHex("220 15% 10%"), // Black text on white secondary buttons

    // Status colors (refined for dark theme)
    success: hslToHex("145 65% 50%"),        // Soft green
    warning: hslToHex("38 85% 55%"),         // Soft amber
    error: hslToHex("0 70% 55%"),            // Soft red
    info: hslToHex("195 85% 65%"),           // Cyan-blue (same as primary)
    destructive: hslToHex("0 70% 55%"),      // Soft red

    // Border: Modern cyan borders with better visibility
    border: hslToHex("220 25% 20%"),         // Subtle border with cyan hint
    divider: hslToHex("220 25% 18%"),        // Divider with cyan tint
    borderPrimary: hslToHex("200 80% 45%"), // Vibrant cyan border for cards and primary elements

    // Interactive states
    disabled: hslToHex("220 15% 30%"),       // Disabled state
    placeholder: hslToHex("220 15% 50%"),    // Placeholder text

    // Glow effects for premium modern feel
    glowPrimary: hslToHex("200 100% 60%"),   // Vibrant cyan glow
    glowPrimarySubtle: hslToHex("200 80% 50%"), // Subtle cyan glow variant
};

export const colors: Record<ColorSchemeName, ThemeColors> = {
    light: lightColors,
    dark: darkColors,
};
