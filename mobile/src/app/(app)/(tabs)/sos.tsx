import { Alert, Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import { AlertTriangle, ArrowLeft } from "lucide-react-native";
import { Button, Card, Header, Screen } from "@/components/ui";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { useTheme } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SOSScreen() {
  const { push } = useNotifications();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 100);

  return (
    <Screen>
      <Header
        title="SOS"
        subtitle="Alerte & assistance"
        left={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            <ArrowLeft size={18} color={colors.foreground} />
            <Text className="ml-1" style={{ color: colors.foreground }}>
              Retour
            </Text>
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
            <Text
              className="text-base font-semibold"
              style={{ color: colors.foreground }}
            >
              Déclencher une alerte
            </Text>
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              Utilisez le bouton SOS dans la barre de navigation ou appuyez
              ci-dessous pour envoyer une alerte au poste de contrôle.
            </Text>
            <Button
              variant="destructive"
              size="lg"
              onPress={async () => {
                await push({
                  title: "SOS déclenché",
                  message:
                    "Une alerte a été envoyée au poste de contrôle (démo).",
                  level: "destructive",
                  source: "sos",
                });
                Alert.alert(
                  "Alerte envoyée (démo)",
                  "Le poste de contrôle a été notifié.",
                );
              }}
            >
              <AlertTriangle size={20} color={colors.destructiveForeground} />
              <Text
                className="ml-2"
                style={{ color: colors.destructiveForeground }}
              >
                SOS
              </Text>
            </Button>
          </Card>

          <Card className="gap-2">
            <Text
              className="text-base font-semibold"
              style={{ color: colors.foreground }}
            >
              Conseils
            </Text>
            <Text className="text-sm" style={{ color: colors.foreground }}>
              - Mettre en sécurité les personnes{"\n"}- Appeler les secours si
              nécessaire
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
