import { useThemeContext } from "./ThemeContext";
import { type ColorSchemeName, type ThemeColors } from "./colors";

/**
 * Hook to access theme colors and scheme.
 * Uses ThemeContext which supports manual theme switching.
 */
export function useTheme(): { scheme: ColorSchemeName; colors: ThemeColors } {
  const { scheme, colors } = useThemeContext();
  return { scheme, colors };
}

