import { Alert, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Screen } from "@/components/ui";

export default function SOSScreen() {
  return (
    <Screen>
      <Header
        title="SOS"
        subtitle="Alerte & assistance (MVP)"
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
            onPress={() =>
              Alert.alert("Alerte envoyée (démo)", "Le poste de contrôle a été notifié.")
            }
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

