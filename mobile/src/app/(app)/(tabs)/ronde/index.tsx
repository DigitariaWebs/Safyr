import { Text, View, ScrollView } from "react-native";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RondeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header title="Ronde" subtitle="Suivi des rondes (MVP)" left={<MenuButton />} />

      <ScrollView 
        className="flex-1 px-4"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      >
        <View className="gap-4">
        <Card className="gap-3">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Ronde actuelle</Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            Placeholder: cette page affichera la ronde en cours, les points de passage,
            et l'historique.
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
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Points de contrôle</Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            - Entrée principale{"\n"}- Parking{"\n"}- Zone stockage
          </Text>
        </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

