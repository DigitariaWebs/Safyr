import { useColorScheme } from "react-native";
import { colors, type ColorSchemeName, type ThemeColors } from "./colors";

/**
 * Single place to pick theme colors.
 * - Defaults to system color scheme
 * - You can later wire a user setting override.
 */
export function useTheme(): { scheme: ColorSchemeName; colors: ThemeColors } {
  const system = useColorScheme();
  const scheme: ColorSchemeName = system === "dark" ? "dark" : "light";
  return { scheme, colors: colors[scheme] };
}

