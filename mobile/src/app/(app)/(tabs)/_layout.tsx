import { Tabs } from "expo-router";
import { Home, ClipboardList, Footprints, MapPin, Settings } from "lucide-react-native";
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const { colors } = useTheme();

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
          display: "none",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="main-courante/index"
        options={{
          title: "Main C.",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="ronde/index"
        options={{
          title: "Ronde",
          tabBarIcon: ({ color, size }) => (
            <Footprints color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="geolocation/index"
        options={{
          title: "Géoloc",
          tabBarIcon: ({ color, size }) => (
            <MapPin color={color} size={size ?? 24} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size ?? 24} />
          ),
        }}
      />
    </Tabs>
  );
}
