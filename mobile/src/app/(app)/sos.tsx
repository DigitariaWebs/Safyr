import { Alert, Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { useTheme } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SOSScreen() {
  const { push } = useNotifications();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header
        title="SOS"
        subtitle="Alerte & assistance (MVP)"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            <Ionicons name="close-outline" size={18} color={colors.foreground} />
            <Text className="ml-1" style={{ color: colors.foreground }}>Fermer</Text>
          </Button>
        }
      />

      <ScrollView 
        className="flex-1 px-4"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <View className="gap-4">
        <Card className="gap-3">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
            Déclencher une alerte
          </Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            MVP: action mock. Étape suivante: envoi backend + position + notification.
          </Text>
          <Button
            variant="destructive"
            size="lg"
            onPress={async () => {
              await push({
                title: "SOS déclenché",
                message: "Une alerte a été envoyée au poste de contrôle (démo).",
                level: "destructive",
                source: "sos",
              });
              Alert.alert("Alerte envoyée (démo)", "Le poste de contrôle a été notifié.");
            }}
          >
            <Ionicons name="warning" size={20} color={colors.destructiveForeground} />
            <Text className="ml-2" style={{ color: colors.destructiveForeground }}>SOS</Text>
          </Button>
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Conseils</Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            - Mettre en sécurité les personnes{"\n"}- Appeler les secours si nécessaire
          </Text>
        </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

