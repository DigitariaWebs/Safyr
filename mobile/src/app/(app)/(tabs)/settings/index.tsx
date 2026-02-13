import { View, Text, ScrollView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Screen, Header, Card } from "@/components/ui";
import { useTheme, useThemeContext } from "@/theme";
import { useNotifications } from "@/features/notifications/NotificationsContext";

type ThemeOption = {
    mode: "light" | "dark" | "system";
    label: string;
    description: string;
    icon: keyof typeof Ionicons.glyphMap;
};

const themeOptions: ThemeOption[] = [
    {
        mode: "light",
        label: "Clair",
        description: "Thème lumineux",
        icon: "sunny",
    },
    {
        mode: "dark",
        label: "Sombre",
        description: "Thème sombre",
        icon: "moon",
    },
    {
        mode: "system",
        label: "Système",
        description: "Suit les préférences système",
        icon: "phone-portrait",
    },
];

export default function SettingsScreen() {
    const { colors, scheme } = useTheme();
    const { mode, setMode } = useThemeContext();
    const { unreadCount } = useNotifications();

    return (
        <Screen>
            <Header title="Paramètres" subtitle="Configuration de l'application" />

            <ScrollView className="flex-1 px-4">
                <View className="gap-4 pb-8">
                    {/* Account / Navigation */}
                    <View className="gap-3 mt-2">
                        <Text
                            className="text-xs font-semibold uppercase tracking-wider px-1"
                            style={{ color: colors.mutedForeground }}
                        >
                            Compte & outils
                        </Text>
                        <Card className="p-4">
                            <View className="gap-4">
                                <Pressable
                                    onPress={() => router.push("/(app)/profile")}
                                    className="flex-row items-center justify-between active:opacity-70"
                                    style={{ minHeight: 56 }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Ionicons
                                                name="person"
                                                size={22}
                                                color={colors.mutedForeground}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                Profil
                                            </Text>
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                Informations agent & contacts
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                                </Pressable>

                                <View className="h-px" style={{ backgroundColor: colors.border }} />

                                <Pressable
                                    onPress={() => router.push("/(app)/notifications")}
                                    className="flex-row items-center justify-between active:opacity-70"
                                    style={{ minHeight: 56 }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Ionicons
                                                name="notifications"
                                                size={22}
                                                color={colors.mutedForeground}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                Notifications
                                            </Text>
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                {unreadCount > 0 ? `${unreadCount} non lue(s)` : "Historique des alertes"}
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                                </Pressable>

                                <View className="h-px" style={{ backgroundColor: colors.border }} />

                                <Pressable
                                    onPress={() => router.push("/(app)/schedule")}
                                    className="flex-row items-center justify-between active:opacity-70"
                                    style={{ minHeight: 56 }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Ionicons
                                                name="calendar"
                                                size={22}
                                                color={colors.mutedForeground}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                Emploi du temps
                                            </Text>
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                Planning & heures prévues
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                                </Pressable>

                                <View className="h-px" style={{ backgroundColor: colors.border }} />

                                <Pressable
                                    onPress={() => router.push("/(app)/time-off")}
                                    className="flex-row items-center justify-between active:opacity-70"
                                    style={{ minHeight: 56 }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Ionicons
                                                name="time"
                                                size={22}
                                                color={colors.mutedForeground}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                Congés
                                            </Text>
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                Historique & demandes
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                                </Pressable>

                                <View className="h-px" style={{ backgroundColor: colors.border }} />

                                <Pressable
                                    onPress={() => router.push("/(app)/payroll")}
                                    className="flex-row items-center justify-between active:opacity-70"
                                    style={{ minHeight: 56 }}
                                >
                                    <View className="flex-row items-center gap-4">
                                        <View
                                            className="w-12 h-12 rounded-2xl items-center justify-center"
                                            style={{ backgroundColor: colors.muted }}
                                        >
                                            <Ionicons
                                                name="card"
                                                size={22}
                                                color={colors.mutedForeground}
                                            />
                                        </View>
                                        <View>
                                            <Text
                                                className="text-base font-semibold"
                                                style={{ color: colors.foreground }}
                                            >
                                                Paie
                                            </Text>
                                            <Text
                                                className="text-sm"
                                                style={{ color: colors.mutedForeground }}
                                            >
                                                Détails de paie
                                            </Text>
                                        </View>
                                    </View>
                                    <Ionicons name="chevron-forward" size={18} color={colors.mutedForeground} />
                                </Pressable>
                            </View>
                        </Card>
                    </View>

                    {/* Theme Section */}
                    <View className="gap-3 mt-2">
                        <Text
                            className="text-xs font-semibold uppercase tracking-wider px-1"
                            style={{ color: colors.mutedForeground }}
                        >
                            Apparence
                        </Text>
                        <Card className="p-4">
                            <View className="gap-4">
                                {themeOptions.map((option, index) => {
                                    const isSelected = mode === option.mode;
                                    const isLast = index === themeOptions.length - 1;

                                    return (
                                        <View key={option.mode}>
                                            <Pressable
                                                onPress={() => setMode(option.mode)}
                                                className="flex-row items-center justify-between active:opacity-70"
                                                style={{ minHeight: 56 }}
                                            >
                                                <View className="flex-row items-center gap-4 flex-1">
                                                    <View
                                                        className="w-12 h-12 rounded-2xl items-center justify-center"
                                                        style={{
                                                            backgroundColor: isSelected
                                                                ? colors.primary
                                                                : colors.muted,
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name={option.icon}
                                                            size={24}
                                                            color={
                                                                isSelected
                                                                    ? colors.primaryForeground
                                                                    : colors.mutedForeground
                                                            }
                                                        />
                                                    </View>
                                                    <View className="flex-1">
                                                        <Text
                                                            className="text-base font-semibold mb-1"
                                                            style={{
                                                                color: colors.foreground,
                                                            }}
                                                        >
                                                            {option.label}
                                                        </Text>
                                                        <Text
                                                            className="text-sm"
                                                            style={{ color: colors.mutedForeground }}
                                                        >
                                                            {option.description}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {isSelected && (
                                                    <View
                                                        className="w-6 h-6 rounded-full items-center justify-center"
                                                        style={{ backgroundColor: colors.primary }}
                                                    >
                                                        <Ionicons
                                                            name="checkmark"
                                                            size={16}
                                                            color={colors.primaryForeground}
                                                        />
                                                    </View>
                                                )}
                                            </Pressable>
                                            {!isLast && (
                                                <View
                                                    className="h-px my-4"
                                                    style={{ backgroundColor: colors.border }}
                                                />
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </Card>
                    </View>

                    {/* Current Theme Info */}
                    <Card className="p-4">
                        <View className="flex-row items-center gap-3">
                            <View
                                className="w-10 h-10 rounded-xl items-center justify-center"
                                style={{ backgroundColor: colors.accent }}
                            >
                                <Ionicons
                                    name="information-circle"
                                    size={20}
                                    color={colors.accentForeground}
                                />
                            </View>
                            <View className="flex-1">
                                <Text
                                    className="text-sm font-medium mb-1"
                                    style={{ color: colors.foreground }}
                                >
                                    Thème actuel: {scheme === "dark" ? "Sombre" : "Clair"}
                                </Text>
                                <Text
                                    className="text-xs"
                                    style={{ color: colors.mutedForeground }}
                                >
                                    {mode === "system"
                                        ? "Défini automatiquement par le système"
                                        : "Défini manuellement"}
                                </Text>
                            </View>
                        </View>
                    </Card>

                    {/* App Info Section */}
                    <View className="gap-3 mt-4">
                        <Text
                            className="text-xs font-semibold uppercase tracking-wider px-1"
                            style={{ color: colors.mutedForeground }}
                        >
                            À propos
                        </Text>
                        <Card className="p-4">
                            <View className="gap-3">
                                <View className="flex-row justify-between items-center py-2">
                                    <Text
                                        className="text-sm"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        Version
                                    </Text>
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: colors.foreground }}
                                    >
                                        1.0.0
                                    </Text>
                                </View>
                                <View
                                    className="h-px"
                                    style={{ backgroundColor: colors.border }}
                                />
                                <View className="flex-row justify-between items-center py-2">
                                    <Text
                                        className="text-sm"
                                        style={{ color: colors.mutedForeground }}
                                    >
                                        Application
                                    </Text>
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: colors.foreground }}
                                    >
                                        Safyr Mobile
                                    </Text>
                                </View>
                            </View>
                        </Card>
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}
