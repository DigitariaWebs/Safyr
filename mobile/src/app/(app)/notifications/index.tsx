import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import type { AgentNotification } from "@/features/notifications/types";

function iconForLevel(level: AgentNotification["level"]): keyof typeof Ionicons.glyphMap {
  switch (level) {
    case "success":
      return "checkmark-circle";
    case "warning":
      return "warning";
    case "destructive":
      return "alert-circle";
    case "info":
    default:
      return "information-circle";
  }
}

export default function NotificationsScreen() {
  const { colors } = useTheme();
  const { items, unreadCount, markAllRead, clearAll, push } = useNotifications();

  return (
    <Screen>
      <Header
        title="Notifications"
        subtitle={`${unreadCount} non lue(s)`}
        right={
          <View className="flex-row gap-2">
            <Button variant="ghost" size="sm" onPress={() => void markAllRead()}>
              Tout lire
            </Button>
            <Button variant="outline" size="sm" onPress={() => void clearAll()}>
              Vider
            </Button>
            <Button variant="ghost" size="sm" onPress={() => router.back()}>
              Fermer
            </Button>
          </View>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-3">
          {items.length === 0 ? (
            <Card className="gap-2">
              <Text className="text-base font-semibold text-foreground">Aucune notification</Text>
              <Text className="text-sm text-muted-foreground">
                Les alertes (géoloc, SOS, congés, etc.) apparaîtront ici.
              </Text>
              <Button
                variant="secondary"
                onPress={() =>
                  void push({
                    title: "Bienvenue",
                    message: "Ceci est une notification de test (démo).",
                    level: "info",
                    source: "system",
                  })
                }
              >
                Générer un test
              </Button>
            </Card>
          ) : null}

          {items.map((n) => (
            <Card key={n.id} className={n.read ? "opacity-80" : ""}>
              <View className="flex-row items-start gap-3">
                <View
                  className="w-10 h-10 rounded-xl items-center justify-center"
                  style={{
                    backgroundColor:
                      n.level === "destructive"
                        ? `${colors.destructive}33`
                        : n.level === "warning"
                          ? `${colors.warning}33`
                          : n.level === "success"
                            ? `${colors.success}33`
                            : `${colors.accent}66`,
                  }}
                >
                  <Ionicons
                    name={iconForLevel(n.level)}
                    size={20}
                    color={
                      n.level === "destructive"
                        ? colors.destructive
                        : n.level === "warning"
                          ? colors.warning
                          : n.level === "success"
                            ? colors.success
                            : colors.accentForeground
                    }
                  />
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center justify-between gap-2">
                    <Text className="text-base font-semibold text-foreground">{n.title}</Text>
                    <Text className="text-xs text-muted-foreground">
                      {new Date(n.createdAtIso).toLocaleString()}
                    </Text>
                  </View>
                  <Text className="mt-1 text-sm text-muted-foreground">{n.message}</Text>
                  {!n.read ? (
                    <Text className="mt-2 text-xs" style={{ color: colors.primary }}>
                      Nouveau
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

