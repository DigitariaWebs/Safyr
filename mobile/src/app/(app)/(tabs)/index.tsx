import { Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useState } from "react";

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const [inService, setInService] = useState(true);
  return (
    <Screen>
      <Header title="Accueil agent" subtitle="Poste & statut" left={<MenuButton />} />

      <View className="px-4 gap-4">
        <Card>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-muted-foreground">Statut</Text>
              <Text className="mt-1 text-lg font-semibold text-foreground">
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
          <View className="mt-4">
            <Text className="text-sm text-muted-foreground">Poste actuel</Text>
            <Text className="mt-1 text-base font-medium text-foreground">
              Siège • Paris — Poste Accueil (08:00 → 16:00)
            </Text>
          </View>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium text-foreground">Actions rapides</Text>
          <View className="flex-row gap-3">
            <Button onPress={() => router.push("/(app)/(tabs)/main-courante")} className="flex-1">
              Main courante
            </Button>
            <Button variant="secondary" onPress={() => router.push("/(app)/(tabs)/ronde")} className="flex-1">
              Ronde
            </Button>
          </View>
          <View className="flex-row gap-3">
            <Button variant="outline" onPress={() => router.push("/(app)/(tabs)/geolocation")} className="flex-1">
              Géoloc
            </Button>
            <Button variant="destructive" onPress={() => router.push("/(app)/sos")} className="flex-1">
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

