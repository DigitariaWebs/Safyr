import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useAgentLocation } from "@/features/geolocation/useAgentLocation";

export default function GeolocationScreen() {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const { permission, location, error } = useAgentLocation(enabled);

  const coords = location?.coords;

  return (
    <Screen>
      <Header
        title="Géolocalisation"
        subtitle="Auto • statut & position"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            <Ionicons name="arrow-back-outline" size={18} color={colors.foreground} />
            <Text className="ml-1" style={{ color: colors.foreground }}>Retour</Text>
          </Button>
        }
      />

      <View className="px-4 gap-4">
        <Card className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
              Géolocalisation auto
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.mutedForeground }}>
              Active/désactive le suivi (MVP: foreground).
            </Text>
          </View>
          <Switch
            value={enabled}
            onValueChange={setEnabled}
            trackColor={{ true: colors.primary, false: colors.border }}
            thumbColor={"#ffffff"}
          />
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Statut</Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            Permission: {permission}
          </Text>
          {error ? <Text className="text-sm" style={{ color: colors.destructive }}>{error}</Text> : null}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Position</Text>
          {coords ? (
            <>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Latitude: {coords.latitude.toFixed(6)}
              </Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Longitude: {coords.longitude.toFixed(6)}
              </Text>
              <Text className="text-sm" style={{ color: colors.mutedForeground }}>
                Précision: ±{Math.round(coords.accuracy ?? 0)}m
              </Text>
            </>
          ) : (
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>
              Aucune position (activez le toggle).
            </Text>
          )}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Carte</Text>
          <Text className="text-sm" style={{ color: colors.mutedForeground }}>
            MVP: placeholder. Étape suivante: intégrer une carte (react-native-maps) et
            afficher la position.
          </Text>
          <View className="mt-2 h-40 rounded-xl border border-border bg-muted/30 items-center justify-center">
            <Text className="text-sm" style={{ color: colors.mutedForeground }}>Carte (placeholder)</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

