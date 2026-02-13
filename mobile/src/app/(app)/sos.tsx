import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useNotifications } from "@/features/notifications/NotificationsContext";

export default function SOSScreen() {
  const { push } = useNotifications();
  return (
    <Screen>
      <Header
        title="SOS"
        subtitle="Alerte & assistance (MVP)"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <View className="px-4 gap-4">
        <Card className="gap-3">
          <Text className="text-base font-semibold text-foreground">
            Déclencher une alerte
          </Text>
          <Text className="text-sm text-muted-foreground">
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
            SOS
          </Button>
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold text-foreground">Conseils</Text>
          <Text className="text-sm text-muted-foreground">
            - Mettre en sécurité les personnes{"\n"}- Appeler les secours si nécessaire
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

