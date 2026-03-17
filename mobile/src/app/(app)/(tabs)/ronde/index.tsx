import { Text, View, ScrollView } from "react-native";
import { Play, CheckCircle } from "lucide-react-native";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getBodyFont } from "@/utils/fonts";

export default function RondeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header
        title="Ronde"
        subtitle="Suivi des rondes (MVP)"
        left={<MenuButton />}
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
              style={{
                color: colors.foreground,
                fontFamily: getBodyFont("600"),
              }}
            >
              Ronde actuelle
            </Text>
            <Text
              className="text-sm"
              style={{
                color: colors.foreground,
                fontFamily: getBodyFont("400"),
              }}
            >
              Placeholder: cette page affichera la ronde en cours, les points de
              passage, et l&apos;historique.
            </Text>
            <View className="flex-row gap-3">
              <Button onPress={() => {}} className="flex-1">
                <Play size={18} color={colors.primaryForeground} />
                <Text
                  className="ml-2"
                  style={{ color: colors.primaryForeground }}
                >
                  Démarrer
                </Text>
              </Button>
              <Button variant="secondary" onPress={() => {}} className="flex-1">
                <CheckCircle size={18} color={colors.foreground} />
                <Text className="ml-2" style={{ color: colors.foreground }}>
                  Terminer
                </Text>
              </Button>
            </View>
          </Card>

          <Card className="gap-2">
            <Text
              className="text-base font-semibold"
              style={{
                color: colors.foreground,
                fontFamily: getBodyFont("600"),
              }}
            >
              Points de contrôle
            </Text>
            <Text
              className="text-sm"
              style={{
                color: colors.foreground,
                fontFamily: getBodyFont("400"),
              }}
            >
              - Entrée principale{"\n"}- Parking{"\n"}- Zone stockage
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
