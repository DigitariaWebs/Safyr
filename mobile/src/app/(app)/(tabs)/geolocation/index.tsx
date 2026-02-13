import { useState } from "react";
import { Switch, Text, View } from "react-native";
import { Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useAgentLocation } from "@/features/geolocation/useAgentLocation";

export default function GeolocationScreen() {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const { permission, location, error } = useAgentLocation(enabled);

  const coords = location?.coords;

  return (
    <Screen>
      <Header title="Géolocalisation" subtitle="Auto • statut & position" left={<MenuButton />} />

      <View className="px-4 gap-4">
        <Card className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold text-foreground">
              Géolocalisation auto
            </Text>
            <Text className="mt-1 text-sm text-muted-foreground">
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
          <Text className="text-base font-semibold text-foreground">Statut</Text>
          <Text className="text-sm text-muted-foreground">
            Permission: {permission}
          </Text>
          {error ? <Text className="text-sm text-destructive">{error}</Text> : null}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold text-foreground">Position</Text>
          {coords ? (
            <>
              <Text className="text-sm text-muted-foreground">
                Latitude: {coords.latitude.toFixed(6)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Longitude: {coords.longitude.toFixed(6)}
              </Text>
              <Text className="text-sm text-muted-foreground">
                Précision: ±{Math.round(coords.accuracy ?? 0)}m
              </Text>
            </>
          ) : (
            <Text className="text-sm text-muted-foreground">
              Aucune position (activez le toggle).
            </Text>
          )}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold text-foreground">Carte</Text>
          <Text className="text-sm text-muted-foreground">
            MVP: placeholder. Étape suivante: intégrer une carte (react-native-maps) et
            afficher la position.
          </Text>
          <View className="mt-2 h-40 rounded-xl border border-border bg-muted/30 items-center justify-center">
            <Text className="text-sm text-muted-foreground">Carte (placeholder)</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

