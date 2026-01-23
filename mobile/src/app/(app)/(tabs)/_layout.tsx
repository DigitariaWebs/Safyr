import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import { Platform } from "react-native";

export default function TabsLayout() {
  const { colors, scheme } = useTheme();

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
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 24 : 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: scheme === "dark" ? 0.3 : 0.1,
          shadowRadius: 8,
          elevation: 8,
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

