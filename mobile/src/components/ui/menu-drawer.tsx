import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Pressable,
  Animated,
  Platform,
  Alert,
  ScrollView,
} from "react-native";
// Import conditionnel pour expo-linear-gradient
let LinearGradient: any = null;
try {
  // @ts-ignore
  LinearGradient = require("expo-linear-gradient").LinearGradient;
} catch (e) {
  console.warn("expo-linear-gradient not installed. Install with: npx expo install expo-linear-gradient");
}
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { getSession, clearSession, type Session } from "@/features/auth/auth.storage";
import { useTheme } from "@/theme";

interface MenuDrawerProps {
  visible: boolean;
  onClose: () => void;
}

export function MenuDrawer({ visible, onClose }: MenuDrawerProps) {
  const [session, setSession] = useState<Session | null>(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -300,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  async function loadSession() {
    const currentSession = await getSession();
    setSession(currentSession);
  }

  async function handleLogout() {
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Déconnexion",
          style: "destructive",
          onPress: async () => {
            await clearSession();
            router.replace("/");
          },
        },
      ]
    );
  }

  function handleNavigate(route: string) {
    onClose();
    setTimeout(() => {
      router.push(route as any);
    }, 300);
  }

  const menuItems = [
    {
      icon: "home",
      label: "Accueil",
      route: "/(app)/(tabs)/",
      onPress: () => handleNavigate("/(app)/(tabs)/"),
      color: "#4A90E2",
      gradient: ["#4A90E2", "#357ABD"],
    },
    {
      icon: "list",
      label: "Main courante",
      route: "/(app)/(tabs)/main-courante",
      onPress: () => handleNavigate("/(app)/(tabs)/main-courante"),
      color: "#50C878",
      gradient: ["#50C878", "#3FA85F"],
    },
    {
      icon: "walk",
      label: "Ronde",
      route: "/(app)/(tabs)/ronde",
      onPress: () => handleNavigate("/(app)/(tabs)/ronde"),
      color: "#9B59B6",
      gradient: ["#9B59B6", "#8E44AD"],
    },
    {
      icon: "location",
      label: "Géolocalisation",
      route: "/(app)/(tabs)/geolocation",
      onPress: () => handleNavigate("/(app)/(tabs)/geolocation"),
      color: "#E67E22",
      gradient: ["#E67E22", "#D35400"],
    },
    {
      icon: "document-text",
      label: "Documents",
      route: "/(app)/documents",
      onPress: () => handleNavigate("/(app)/documents"),
      color: "#3498DB",
      gradient: ["#3498DB", "#2980B9"],
    },
    {
      icon: "person",
      label: "Mon profil",
      route: "/(app)/profile",
      onPress: () => handleNavigate("/(app)/profile"),
      color: "#1ABC9C",
      gradient: ["#1ABC9C", "#16A085"],
    },
    {
      icon: "warning",
      label: "SOS",
      route: "/(app)/sos",
      onPress: () => handleNavigate("/(app)/sos"),
      color: "#E74C3C",
      gradient: ["#E74C3C", "#C0392B"],
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable
        style={{ flex: 1 }}
        onPress={onClose}
      >
        <Animated.View
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            opacity: overlayOpacity,
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                width: 300,
                height: "100%",
                backgroundColor: theme.colors.background,
                transform: [{ translateX: slideAnim }],
                shadowColor: "#000",
                shadowOffset: { width: 4, height: 0 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 16,
                flexDirection: "column",
              }}
            >
              {/* Header with Gradient */}
              {LinearGradient ? (
                <LinearGradient
                  colors={["#4A90E2", "#357ABD"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingTop: Platform.OS === "ios" ? 60 : 40,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-white">Safyr</Text>
                    <TouchableOpacity
                      onPress={onClose}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 20,
                        padding: 8,
                      }}
                    >
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {session && (
                    <View style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: 12, padding: 12 }}>
                      <Text className="text-xs text-white/80" style={{ marginBottom: 4 }}>
                        Connecté en tant que
                      </Text>
                      <Text className="text-base font-semibold text-white">
                        {session.fullName}
                      </Text>
                    </View>
                  )}
                </LinearGradient>
              ) : (
                <View
                  style={{
                    paddingTop: Platform.OS === "ios" ? 60 : 40,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                    backgroundColor: theme.colors.primary,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <Text className="text-2xl font-bold text-white">Safyr</Text>
                    <TouchableOpacity
                      onPress={onClose}
                      style={{
                        backgroundColor: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 20,
                        padding: 8,
                      }}
                    >
                      <Ionicons name="close" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                  {session && (
                    <View style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: 12, padding: 12 }}>
                      <Text className="text-xs text-white/80" style={{ marginBottom: 4 }}>
                        Connecté en tant que
                      </Text>
                      <Text className="text-base font-semibold text-white">
                        {session.fullName}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {/* Menu Items - Scrollable */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                  paddingTop: 8,
                  paddingBottom: 8,
                }}
                showsVerticalScrollIndicator={true}
                indicatorStyle={theme.scheme === "dark" ? "white" : "black"}
              >
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 20,
                      paddingVertical: 16,
                      marginHorizontal: 12,
                      marginVertical: 4,
                      borderRadius: 12,
                      backgroundColor: theme.colors.card,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: `${item.color}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={item.color}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "600",
                        color: theme.colors.foreground,
                        flex: 1,
                      }}
                    >
                      {item.label}
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={18}
                      color={theme.colors.mutedForeground}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Footer - Fixed at bottom */}
              <View
                style={{
                  padding: 20,
                  borderTopWidth: 1,
                  borderTopColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                }}
              >
                <TouchableOpacity
                  onPress={handleLogout}
                  activeOpacity={0.8}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 12,
                    paddingVertical: 14,
                    backgroundColor: theme.colors.destructive,
                    shadowColor: theme.colors.destructive,
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "600", color: "#fff" }}>
                    Déconnexion
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
