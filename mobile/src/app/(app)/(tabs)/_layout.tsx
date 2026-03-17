import { Tabs } from "expo-router";
import { Home, ClipboardList, Map, Settings } from "lucide-react-native";
import { TabBar } from "@/components/ui/tab-bar";
import { useTheme } from "@/theme";

export default function TabsLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Accueil",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size ?? 20} />
          ),
        }}
      />
      <Tabs.Screen
        name="main-courante/index"
        options={{
          title: "Main C.",
          tabBarIcon: ({ color, size }) => (
            <ClipboardList color={color} size={size ?? 20} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: "SOS",
        }}
      />
      <Tabs.Screen
        name="geolocation/index"
        options={{
          title: "Carte",
          tabBarIcon: ({ color, size }) => (
            <Map color={color} size={size ?? 20} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings/index"
        options={{
          title: "Réglages",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size ?? 20} />
          ),
        }}
      />
    </Tabs>
  );
}
