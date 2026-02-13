import { useColorScheme } from "react-native";
import { colors, type ColorSchemeName, type ThemeColors } from "./colors";

/**
 * Single place to pick theme colors.
 * - Defaults to dark mode
 * - You can later wire a user setting override.
 */
export function useTheme(): { scheme: ColorSchemeName; colors: ThemeColors } {
  // Force dark mode for now
  const scheme: ColorSchemeName = "dark";
  return { scheme, colors: colors[scheme] };
}

