import { Stack } from "expo-router";
import { ThemeProvider } from "@/theme";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "./global.css";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NotificationsProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(app)" />
          </Stack>
        </NotificationsProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
