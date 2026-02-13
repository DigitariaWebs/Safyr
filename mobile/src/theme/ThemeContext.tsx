import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors, type ColorSchemeName, type ThemeColors } from "./colors";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    scheme: ColorSchemeName;
    colors: ThemeColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@safyr/theme-mode";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    // Get system color scheme (can be null, so we default to dark for premium theme)
    const systemScheme = useColorScheme();
    const [mode, setModeState] = useState<ThemeMode>("dark"); // Force dark mode for premium theme

    // Load saved theme preference on mount
    useEffect(() => {
        AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
            if (saved && (saved === "light" || saved === "dark" || saved === "system")) {
                setModeState(saved as ThemeMode);
            }
        }).catch((error) => {
            // Silently fail if AsyncStorage is not available
            console.warn("Failed to load theme preference:", error);
        });
    }, []);

    // Determine the actual scheme to use
    // Default to dark for premium Dark Blue Light theme
    const scheme: ColorSchemeName =
        mode === "system"
            ? (systemScheme === "dark" ? "dark" : "dark") // Force dark
            : mode === "light" ? "light" : "dark"; // Default to dark

    const setMode = (newMode: ThemeMode) => {
        setModeState(newMode);
        AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
    };

    return (
        <ThemeContext.Provider
            value={{
                mode,
                setMode,
                scheme,
                colors: colors[scheme],
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Hook to access theme context
 * Returns the current theme mode, setter, resolved scheme, and colors
 */
export function useThemeContext(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useThemeContext must be used within a ThemeProvider");
    }
    return context;
}
