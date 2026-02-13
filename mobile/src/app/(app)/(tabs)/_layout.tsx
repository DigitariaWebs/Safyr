import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import { colors as defaultColors } from "@/theme/colors";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function TabsLayout() {
  // Use theme with fallback
  let theme;
  try {
    theme = useTheme();
  } catch (error) {
    // Fallback if theme context is not available - default to dark
    theme = { scheme: "dark" as const, colors: defaultColors.dark };
  }
  const { colors, scheme } = theme;
  
  // Get safe area insets with fallback
  let insets;
  try {
    insets = useSafeAreaInsets();
  } catch (error) {
    insets = { top: 0, bottom: 0, left: 0, right: 0 };
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: Platform.OS === "ios" ? 60 + insets.bottom : 60,
          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 8 : 8),
          shadowColor: scheme === "dark" ? colors.primary : "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: scheme === "dark" ? 0.2 : 0.1,
          shadowRadius: scheme === "dark" ? 12 : 8,
          elevation: 8,
          // Subtle glow for dark mode
          ...(scheme === "dark" && {
            borderTopWidth: 0.5,
          }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="main-courante/index"
        options={{
          title: "Main C.",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="ronde/index"
        options={{
          title: "Ronde",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="geolocation/index"
        options={{
          title: "Géoloc",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}

