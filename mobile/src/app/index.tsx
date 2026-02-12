import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { router } from "expo-router";
import { getSession } from "@/features/auth/auth.storage";
import { Screen } from "@/components/ui";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const session = await getSession();
      if (!mounted) return;
      router.replace(session ? "/(app)/(tabs)" : "/(auth)/login");
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen contentClassName="items-center justify-center px-6">
      <View className="items-center">
        <Text className="text-3xl font-semibold text-foreground">Safyr</Text>
        <Text className="mt-2 text-sm text-muted-foreground">
          Portail Agent • Sécurité • RH
        </Text>
        <View className="mt-6">
          {loading ? <ActivityIndicator /> : null}
        </View>
      </View>
    </Screen>
  );
}
