import { Text, View, ScrollView } from "react-native";
import { router } from "expo-router";
import {
  Bell,
  ClipboardList,
  Footprints,
  MapPin,
  AlertTriangle,
  Settings,
  Shield,
  Clock,
  TrendingUp,
  ChevronRight,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button, Card, Header, Screen, Toggle } from "@/components/ui";
import { useTheme } from "@/theme";
import { useState } from "react";
import { useNotifications } from "@/features/notifications/NotificationsContext";
import { getBodyFont, getHeadingFont } from "@/utils/fonts";

export default function HomeDashboardScreen() {
  const { colors } = useTheme();
  const { unreadCount } = useNotifications();
  const [inService, setInService] = useState(true);
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 24);

  return (
    <Screen>
      <Header
        title="Tableau de bord"
        subtitle="Agent de sécurité"
        right={
          <Button
            variant="ghost"
            size="sm"
            accessibilityLabel="Notifications"
            onPress={() => router.push("/(app)/notifications")}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <Bell size={18} color={colors.foreground} />
              {unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: colors.primary,
                    borderRadius: 10,
                    paddingHorizontal: 7,
                    paddingVertical: 2,
                    minWidth: 20,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: getBodyFont("600"),
                      color: colors.primaryForeground,
                    }}
                  >
                    {unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </Button>
        }
      />

      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: bottomPadding,
          gap: 12,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status + Shift Card */}
        <Card>
          <View style={{ gap: 16 }}>
            {/* Toggle Row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: inService
                      ? `${colors.success}15`
                      : `${colors.destructive}15`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Shield
                    size={18}
                    color={inService ? colors.success : colors.destructive}
                  />
                </View>
                <View>
                  <Text
                    style={{
                      fontSize: 11,
                      color: colors.mutedForeground,
                      fontFamily: getBodyFont("400"),
                    }}
                  >
                    Statut
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.foreground,
                      fontFamily: getBodyFont("600"),
                    }}
                  >
                    {inService ? "En service" : "Hors service"}
                  </Text>
                </View>
              </View>
              <Toggle
                value={inService}
                onValueChange={setInService}
                enabledLabel="Actif"
                disabledLabel="Inactif"
                size="sm"
              />
            </View>

            {/* Divider */}
            <View style={{ height: 1, backgroundColor: colors.borderSubtle }} />

            {/* Current Shift */}
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: `${colors.primary}15`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.mutedForeground,
                    fontFamily: getBodyFont("400"),
                  }}
                >
                  Poste actuel
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    color: colors.foreground,
                    fontFamily: getBodyFont("600"),
                  }}
                >
                  Siège • Paris — Accueil
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{
                    fontSize: 20,
                    color: colors.foreground,
                    fontFamily: getHeadingFont(),
                  }}
                >
                  08:00
                </Text>
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.mutedForeground,
                    fontFamily: getBodyFont("400"),
                  }}
                >
                  → 16:00
                </Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Stats Row */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Card style={{ flex: 1 }}>
            <View style={{ alignItems: "center", gap: 6 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: getBodyFont("400"),
                }}
              >
                Heures ce mois
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  color: colors.foreground,
                  fontFamily: getHeadingFont(),
                }}
              >
                124
              </Text>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
              >
                <TrendingUp size={12} color={colors.success} />
                <Text
                  style={{
                    fontSize: 11,
                    color: colors.success,
                    fontFamily: getBodyFont("500"),
                  }}
                >
                  +8h
                </Text>
              </View>
            </View>
          </Card>
          <Card style={{ flex: 1 }}>
            <View style={{ alignItems: "center", gap: 6 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: getBodyFont("400"),
                }}
              >
                Rondes
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  color: colors.foreground,
                  fontFamily: getHeadingFont(),
                }}
              >
                12
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: getBodyFont("400"),
                }}
              >
                ce mois
              </Text>
            </View>
          </Card>
          <Card style={{ flex: 1 }}>
            <View style={{ alignItems: "center", gap: 6 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontSize: 11,
                  color: colors.mutedForeground,
                  fontFamily: getBodyFont("400"),
                }}
              >
                Incidents
              </Text>
              <Text
                style={{
                  fontSize: 28,
                  color: colors.foreground,
                  fontFamily: getHeadingFont(),
                }}
              >
                3
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: colors.warning,
                  fontFamily: getBodyFont("500"),
                }}
              >
                1 en cours
              </Text>
            </View>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card>
          <View style={{ gap: 12 }}>
            <Text
              style={{
                fontSize: 13,
                color: colors.mutedForeground,
                fontFamily: getBodyFont("500"),
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Actions rapides
            </Text>
            <View style={{ gap: 8 }}>
              <QuickAction
                icon={<ClipboardList size={18} color={colors.primary} />}
                label="Main courante"
                subtitle="Nouveau rapport"
                colors={colors}
                onPress={() => router.push("/(app)/(tabs)/main-courante")}
              />
              <QuickAction
                icon={<Footprints size={18} color={colors.primary} />}
                label="Ronde"
                subtitle="Démarrer une ronde"
                colors={colors}
                onPress={() => router.push("/(app)/(tabs)/ronde")}
              />
              <QuickAction
                icon={<MapPin size={18} color={colors.primary} />}
                label="Carte"
                subtitle="Position & zones"
                colors={colors}
                onPress={() => router.push("/(app)/(tabs)/geolocation")}
              />
              <QuickAction
                icon={<AlertTriangle size={18} color={colors.destructive} />}
                label="SOS"
                subtitle="Alerte d'urgence"
                colors={colors}
                onPress={() => router.push("/(app)/sos")}
                destructive
              />
            </View>
          </View>
        </Card>

        {/* Rappels */}
        <Card>
          <View style={{ gap: 10 }}>
            <Text
              style={{
                fontSize: 13,
                color: colors.mutedForeground,
                fontFamily: getBodyFont("500"),
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              Rappels
            </Text>
            <ReminderItem
              colors={colors}
              text="Vérifier le matériel (radio, lampe)"
            />
            <ReminderItem colors={colors} text="Relire les consignes du site" />
          </View>
        </Card>

        {/* Settings */}
        <Card>
          <QuickLink
            icon={<Settings size={18} color={colors.primary} />}
            label="Réglages"
            colors={colors}
            onPress={() => router.push("/(app)/(tabs)/settings")}
          />
        </Card>
      </ScrollView>
    </Screen>
  );
}

/* --- Sub-components --- */

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  subtitle: string;
  colors: ReturnType<typeof useTheme>["colors"];
  onPress: () => void;
  destructive?: boolean;
}

function QuickAction({
  icon,
  label,
  subtitle,
  colors,
  onPress,
  destructive,
}: QuickActionProps) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className="w-full justify-start px-0"
    >
      <View
        style={{ flexDirection: "row", alignItems: "center", flex: 1, gap: 12 }}
      >
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: destructive
              ? `${colors.destructive}15`
              : `${colors.primary}15`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 14,
              color: colors.foreground,
              fontFamily: getBodyFont("500"),
            }}
          >
            {label}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: colors.mutedForeground,
              fontFamily: getBodyFont("400"),
            }}
          >
            {subtitle}
          </Text>
        </View>
        <ChevronRight size={16} color={colors.mutedForeground} />
      </View>
    </Button>
  );
}

interface ReminderItemProps {
  colors: ReturnType<typeof useTheme>["colors"];
  text: string;
}

function ReminderItem({ colors, text }: ReminderItemProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        backgroundColor: `${colors.muted}80`,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: colors.primary,
        }}
      />
      <Text
        style={{
          fontSize: 13,
          color: colors.foreground,
          fontFamily: getBodyFont("400"),
          flex: 1,
        }}
      >
        {text}
      </Text>
    </View>
  );
}

interface QuickLinkProps {
  icon: React.ReactNode;
  label: string;
  colors: ReturnType<typeof useTheme>["colors"];
  onPress: () => void;
}

function QuickLink({ icon, label, colors, onPress }: QuickLinkProps) {
  return (
    <Button variant="ghost" onPress={onPress} className="w-full px-0">
      <View style={{ alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 12,
            backgroundColor: `${colors.primary}15`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {icon}
        </View>
        <Text
          style={{
            fontSize: 13,
            color: colors.foreground,
            fontFamily: getBodyFont("500"),
          }}
        >
          {label}
        </Text>
      </View>
    </Button>
  );
}
