export const typography = {
  fontFamily: {
    // Keep system-safe by default; you can later load the web fonts via expo-font.
    sans: undefined,
    mono: undefined,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    "2xl": 24,
    "3xl": 30,
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 28,
    "2xl": 32,
    "3xl": 38,
  },
  fontWeight: {
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
  },
} as const;

