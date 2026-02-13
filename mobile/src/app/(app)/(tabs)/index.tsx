import { Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useState } from "react";
import { useNotifications } from "@/features/notifications/NotificationsContext";

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const [inService, setInService] = useState(true);
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

      <View className="px-4 gap-4">
        <Card
          style={{
            backgroundColor: inService ? "rgba(76, 175, 80, 0.15)" : "rgba(255, 152, 0, 0.15)",
            borderColor: inService ? "#4CAF50" : "#FF9800",
            borderWidth: 2,
          }}
        >
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className="text-sm font-medium text-muted-foreground">Statut</Text>
              <Text
                className="mt-1 text-xl font-bold"
                style={{ color: inService ? "#81C784" : "#FFB74D" }}
              >
                {inService ? "En service" : "Hors service"}
              </Text>
            </View>
            <Switch
              value={inService}
              onValueChange={setInService}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={"#ffffff"}
            />
          </View>
          <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            <Text className="text-sm font-medium text-muted-foreground">Poste actuel</Text>
            <Text className="mt-1 text-base font-semibold text-foreground">
              Siège • Paris — Poste Accueil
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
              08:00 → 16:00
            </Text>
          </View>
        </Card>

        <Card className="gap-4">
          <Text className="text-base font-bold text-foreground">Actions rapides</Text>
          <View className="flex-row gap-3">
            <Button
              onPress={() => router.push("/(app)/(tabs)/main-courante")}
              className="flex-1"
              style={{
                backgroundColor: "#50C878",
                shadowColor: "#50C878",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              Main courante
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push("/(app)/(tabs)/ronde")}
              className="flex-1"
              style={{
                backgroundColor: "#9B59B6",
                shadowColor: "#9B59B6",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              Ronde
            </Button>
          </View>
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              onPress={() => router.push("/(app)/(tabs)/geolocation")}
              className="flex-1"
              style={{
                borderColor: "#E67E22",
                borderWidth: 2,
              }}
            >
              Géoloc
            </Button>
            <Button
              variant="destructive"
              onPress={() => router.push("/(app)/sos")}
              className="flex-1"
              style={{
                shadowColor: colors.destructive,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
              }}
            >
              SOS
            </Button>
          </View>
        </Card>

        <Card>
          <Text className="text-sm font-medium text-foreground">Rappels</Text>
          <Text className="mt-2 text-sm text-muted-foreground">
            - Vérifier le matériel (radio, lampe)\n- Relire les consignes du site
          </Text>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium text-foreground">Compte</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/profile")}
            className="w-full"
          >
            Mon profil
          </Button>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium text-foreground">Documents</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/documents")}
            className="w-full"
          >
            Télécharger PDF
          </Button>
          <Text className="text-xs text-muted-foreground">
            Emploi du temps et bulletins de salaire
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

