import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedForeground,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="main-courante"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="ronde"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="walk-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
      <Tabs.Screen
        name="geolocation"
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="location-outline" color={color} size={size ?? 22} />
          ),
        }}
      />
    </Tabs>
  );
}

