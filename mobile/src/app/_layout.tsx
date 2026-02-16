import { useEffect } from "react";
import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/theme";
import { NotificationsProvider } from "@/features/notifications/NotificationsContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "./global.css";

// Keep the splash screen visible while we load fonts
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load Montserrat fonts from local assets
  const [fontsLoaded, fontError] = useFonts({
    "Montserrat-Regular": require("../../assets/fonts/Montserrat-Regular.ttf"),
    "Montserrat-Medium": require("../../assets/fonts/Montserrat-Medium.ttf"),
    "Montserrat-SemiBold": require("../../assets/fonts/Montserrat-SemiBold.ttf"),
    "Montserrat-Bold": require("../../assets/fonts/Montserrat-Bold.ttf"),
    // Alias for easier use
    Montserrat: require("../../assets/fonts/Montserrat-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      // Fonts are loaded (or failed), hide splash screen
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
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
    </SafeAreaProvider>
  );
}
