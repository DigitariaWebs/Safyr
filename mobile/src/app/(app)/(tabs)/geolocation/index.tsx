import { useState } from "react";
import { Switch, Text, View, ScrollView } from "react-native";
import { Card, Header, MenuButton, Screen } from "@/components/ui";
import { useTheme } from "@/theme";
import { useAgentLocation } from "@/features/geolocation/useAgentLocation";
import { defaultWorkZone } from "@/features/geolocation/workZone";
import { useWorkZoneMonitor } from "@/features/geolocation/useWorkZoneMonitor";
import { useNotifications } from "@/features/notifications/NotificationsContext";
// Import MapView conditionnellement pour éviter les crashes
let MapView: any = null;
try {
  MapView = require("@/components/geolocation/MapView").MapView;
} catch (e) {
  console.warn("MapView not available:", e);
}

export default function GeolocationScreen() {
  const { colors } = useTheme();
  const [enabled, setEnabled] = useState(false);
  const { permission, location, error } = useAgentLocation(enabled);
  const { push } = useNotifications();

  const coords = location?.coords;
  const monitor = useWorkZoneMonitor({
    enabled,
    location,
    zone: defaultWorkZone,
    prolongedOutsideMs: 2 * 60 * 1000,
    onProlongedOutside: ({ distanceMeters }) => {
      void push({
        title: "Sortie de zone prolongée",
        message: `Vous êtes hors zone depuis plus de 2 minutes (distance: ~${Math.round(distanceMeters)}m).`,
        level: "warning",
        source: "geolocation",
      });
    },
  });

  return (
    <Screen>
      <Header title="Géolocalisation" subtitle="Auto • statut & position" left={<MenuButton />} />

      <ScrollView 
        className="flex-1 px-4"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="gap-4">
        <Card className="flex-row items-center justify-between">
          <View>
            <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
              Géolocalisation auto
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>
              Active/désactive le suivi (MVP: foreground).
            </Text>
          </View>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ true: colors.primary, false: colors.border }}
              thumbColor={colors.foreground}
            />
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Statut</Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            Permission: {permission}
          </Text>
          {error ? <Text className="text-sm" style={{ color: colors.destructive }}>{error}</Text> : null}
          {enabled && coords ? (
            <Text className="text-sm" style={{ color: colors.foreground }}>
              Zone: {monitor.outside ? "Hors zone" : "Dans la zone"} • Distance:{" "}
              {monitor.distanceMeters ? `${Math.round(monitor.distanceMeters)}m` : "—"}
            </Text>
          ) : null}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Position</Text>
          {coords ? (
            <>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Latitude: {coords.latitude.toFixed(6)}
              </Text>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Longitude: {coords.longitude.toFixed(6)}
              </Text>
              <Text className="text-sm" style={{ color: colors.foreground }}>
                Précision: ±{Math.round(coords.accuracy ?? 0)}m
              </Text>
            </>
          ) : (
            <Text className="text-sm" style={{ color: colors.foreground }}>
              Aucune position (activez le toggle).
            </Text>
          )}
        </Card>

        <Card className="gap-2">
          <Text className="text-base font-semibold" style={{ color: colors.foreground }}>Carte</Text>
          <Text className="text-sm" style={{ color: colors.foreground }}>
            afficher la position.
          </Text>
          <View className="mt-2 h-64 rounded-xl border border-border overflow-hidden">
            {MapView ? (
              <MapView location={location} zone={defaultWorkZone} />
            ) : (
              <View className="flex-1 items-center justify-center bg-muted">
                <Text className="text-sm text-muted-foreground">
                  Carte non disponible. Rebuild requis.
                </Text>
              </View>
            )}
          </View>
        </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

