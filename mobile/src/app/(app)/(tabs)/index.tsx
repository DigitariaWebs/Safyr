import { Text, View, ScrollView, Platform, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Header, MenuButton, Screen, Toggle } from "@/components/ui";
import { useTheme } from "@/theme";
import { useState } from "react";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { getMontserratFont } from "@/utils/text-style";

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const [inService, setInService] = useState(true);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header
        title="Accueil agent"
        subtitle="Poste & statut"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.push("/(app)/notifications")}>
            <View className="flex-row items-center gap-2">
              <Ionicons name="notifications-outline" size={18} color={colors.foreground} />
              {unreadCount > 0 ? (
                <View
                  className="px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: colors.primary }}
                >
                  <Text
                    className="text-xs font-semibold"
                    style={{ color: colors.primaryForeground }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              ) : null}
            </View>
          </Button>
        }
      />

      <ScrollView 
        className="flex-1 px-4"
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottomPadding }}
        showsVerticalScrollIndicator={true}
      >
        <View className="gap-4">
        <Card
          style={{
            borderColor: inService ? colors.success : colors.destructive,
            borderWidth: 2,
            shadowColor: inService ? colors.success : colors.destructive,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.7,
            shadowRadius: 24,
            elevation: 16,
          }}
        >
          <View className="gap-4">
            <View>
              <Text className="text-sm font-medium mb-2" style={{ color: colors.foreground, fontFamily: getMontserratFont("500") }}>Statut</Text>
              <Toggle
                value={inService}
                onValueChange={setInService}
                enabledLabel="En service"
                disabledLabel="Hors service"
                enabledIcon="checkmark-circle"
                disabledIcon="close-circle"
                size="lg"
                className="w-full"
              />
            </View>
          </View>
          <View className="mt-4 pt-4" style={{ borderTopWidth: 1, borderTopColor: inService ? colors.success : colors.destructive }}>
            <Text className="text-sm font-medium" style={{ color: colors.foreground, fontFamily: getMontserratFont("500") }}>Poste actuel</Text>
            <Text className="mt-1 text-base font-semibold" style={{ color: colors.foreground, fontFamily: getMontserratFont("600") }}>
              Siège • Paris — Poste Accueil
            </Text>
            <Text className="mt-1 text-sm" style={{ color: colors.foreground, fontFamily: getMontserratFont("400") }}>
              08:00 → 16:00
            </Text>
          </View>
        </Card>

        <Card className="gap-4">
          <Text className="text-base font-bold" style={{ color: colors.foreground, fontFamily: getMontserratFont("700") }}>Actions rapides</Text>
          <View className="flex-row gap-3">
            <Button
              onPress={() => router.push("/(app)/(tabs)/main-courante")}
              className="flex-1"
            >
              <Ionicons name="list-outline" size={18} color={colors.primaryForeground} />
              <Text className="ml-2" style={{ color: colors.primaryForeground }}>Main courante</Text>
            </Button>
            <Button
              variant="secondary"
              onPress={() => router.push("/(app)/(tabs)/ronde")}
              className="flex-1"
            >
              <Ionicons name="walk-outline" size={18} />
              <Text className="ml-2">Ronde</Text>
            </Button>
          </View>
          <View className="flex-row gap-3">
            <Button
              variant="outline"
              onPress={() => router.push("/(app)/(tabs)/geolocation")}
              className="flex-1"
            >
              <Ionicons name="location-outline" size={18} />
              <Text className="ml-2">Géoloc</Text>
            </Button>
            <Button
              variant="destructive"
              onPress={() => router.push("/(app)/sos")}
              className="flex-1"
            >
              <Ionicons name="warning-outline" size={18} color={colors.destructiveForeground} />
              <Text className="ml-2" style={{ color: colors.destructiveForeground }}>SOS</Text>
            </Button>
          </View>
        </Card>

        <Card>
          <Text className="text-sm font-medium" style={{ color: colors.foreground, fontFamily: getMontserratFont("500") }}>Rappels</Text>
          <Text className="mt-2 text-sm" style={{ color: colors.foreground, fontFamily: getMontserratFont("400") }}>
            - Vérifier le matériel (radio, lampe)\n- Relire les consignes du site
          </Text>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium" style={{ color: colors.foreground, fontFamily: getMontserratFont("500") }}>Compte</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/profile")}
            className="w-full"
          >
            <Ionicons name="person-outline" size={18} />
            <Text className="ml-2">Mon profil</Text>
          </Button>
        </Card>

        <Card className="gap-3">
          <Text className="text-sm font-medium" style={{ color: colors.foreground, fontFamily: getMontserratFont("500") }}>Documents</Text>
          <Button
            variant="outline"
            onPress={() => router.push("/(app)/documents")}
            className="w-full"
          >
            <Ionicons name="document-text-outline" size={18} />
            <Text className="ml-2">Télécharger PDF</Text>
          </Button>
          <Text className="text-xs" style={{ color: colors.foreground, fontFamily: getMontserratFont("400") }}>
            Emploi du temps et bulletins de salaire
          </Text>
        </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

