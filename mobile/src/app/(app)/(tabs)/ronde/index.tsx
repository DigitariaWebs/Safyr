import { Text, View } from "react-native";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";

export default function RondeScreen() {
  return (
    <Screen>
      <Header title="Ronde" subtitle="Suivi des rondes (MVP)" left={<MenuButton />} />

      <View className="px-4 gap-4">
        <Card className="gap-3">
          <Text className="text-base font-semibold text-foreground">Ronde actuelle</Text>
          <Text className="text-sm text-muted-foreground">
            Placeholder: cette page affichera la ronde en cours, les points de passage,
            et l’historique.
          </Text>
          <View className="flex-row gap-3">
            <Button onPress={() => {}} className="flex-1">
              Démarrer
            </Button>
            <Button variant="secondary" onPress={() => {}} className="flex-1">
              Terminer
            </Button>
          </View>
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold text-foreground">Points de contrôle</Text>
          <Text className="text-sm text-muted-foreground">
            - Entrée principale{"\n"}- Parking{"\n"}- Zone stockage
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

