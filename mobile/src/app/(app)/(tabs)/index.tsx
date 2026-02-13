import { Switch, Text, View, ScrollView, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useState } from "react";
import { useNotifications } from "@/features/notifications/NotificationsContext";

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const [inService, setInService] = useState(true);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header
        title="Accueil agent"
        subtitle="Poste & statut"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.push("/(app)/notifications")}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
              {unreadCount > 0 ? (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.primaryForeground }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </Button>
        }
      />

      <ScrollView 
        className="flex-1 px-4"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={true}
      >
        <View className="gap-4">
        <Card
          style={{
            borderColor: inService ? colors.success : colors.destructive,
            borderWidth: 1.5,
            shadowColor: inService ? colors.success : colors.destructive,
            shadowOpacity: 0.6,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Statut</Text>
              <Text
                className="mt-1 text-xl font-bold"
                style={{ color: colors.foreground }}
              >
                {inService ? "En service" : "Hors service"}
              </Text>
            </View>
            <Switch
              value={inService}
              onValueChange={setInService}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.foreground}
            />
          </View>
          <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: inService ? colors.success : colors.destructive }}>
            <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Poste actuel</Text>
            <Text className="mt-1 text-base font-semibold" style={{ color: colors.foreground }}>
              Siège • Paris — Poste Accueil
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>
              08:00 → 16:00
            </Text>
          </View>
        </Card>

        <Card className="gap-4">
          <Text className="text-base font-bold" style={{ color: colors.foreground }}>Actions rapides</Text>
          <View className="flex-row gap-3">
            <Button
              onPress={() => router.push("/(app)/(tabs)/main-courante")}
              className="flex-1"
            >
              Main courante
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push("/(app)/(tabs)/ronde")}
              className="flex-1"
            >
              Ronde
            </Button>
          </View>
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              onPress={() => router.push("/(app)/(tabs)/geolocation")}
              className="flex-1"
            >
              Géoloc
            </Button>
            <Button
              variant="destructive"
              onPress={() => router.push("/(app)/sos")}
              className="flex-1"
            >
              SOS
            </Button>
          </View>
        </Card>

        <Card>
          <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Rappels</Text>
          <Text className="mt-2 text-sm" style={{ color: colors.foreground }}>
            - Vérifier le matériel (radio, lampe)\n- Relire les consignes du site
          </Text>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Compte</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/profile")}
            className="w-full"
          >
            Mon profil
          </Button>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Documents</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/documents")}
            className="w-full"
          >
            Télécharger PDF
          </Button>
          <Text className="text-xs" style={{ color: colors.foreground }}>
            Emploi du temps et bulletins de salaire
          </Text>
        </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

