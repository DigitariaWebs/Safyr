import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function AppLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="main-courante/new" />
        <Stack.Screen name="sos" />
        <Stack.Screen name="profile" />
        <Stack.Screen name="documents" />
      </Stack>
    </>
  );
}

