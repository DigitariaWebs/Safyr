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
import type { ReactNode } from "react";
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
import { Image } from "expo-image";
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const contentFadeAnim = useRef(new Animated.Value(0)).current;
  const theme = useTheme();

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    if (visible) {
      // Reset animations
      slideAnim.setValue(-300);
      overlayOpacity.setValue(0);
      scaleAnim.setValue(0.95);
      contentFadeAnim.setValue(0);
      
      // Start entrance animations
      Animated.parallel([
        // Smooth slide in with spring
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 50,
          friction: 10,
          useNativeDriver: true,
        }),
        // Overlay fade in
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        // Scale animation for smooth entrance
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Fade in content after drawer is visible
        Animated.timing(contentFadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Exit animations
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
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(contentFadeAnim, {
          toValue: 0,
          duration: 150,
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
    },
    {
      icon: "list",
      label: "Main courante",
      route: "/(app)/(tabs)/main-courante",
      onPress: () => handleNavigate("/(app)/(tabs)/main-courante"),
    },
    {
      icon: "walk",
      label: "Ronde",
      route: "/(app)/(tabs)/ronde",
      onPress: () => handleNavigate("/(app)/(tabs)/ronde"),
    },
    {
      icon: "location",
      label: "Géolocalisation",
      route: "/(app)/(tabs)/geolocation",
      onPress: () => handleNavigate("/(app)/(tabs)/geolocation"),
    },
    {
      icon: "document-text",
      label: "Documents",
      route: "/(app)/documents",
      onPress: () => handleNavigate("/(app)/documents"),
    },
    {
      icon: "person",
      label: "Mon profil",
      route: "/(app)/profile",
      onPress: () => handleNavigate("/(app)/profile"),
    },
    {
      icon: "warning",
      label: "SOS",
      route: "/(app)/sos",
      onPress: () => handleNavigate("/(app)/sos"),
      isDestructive: true,
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
                transform: [
                  { translateX: slideAnim },
                  { scale: scaleAnim },
                ],
                shadowColor: theme.colors.primary,
                shadowOffset: { width: 4, height: 0 },
                shadowOpacity: theme.scheme === "dark" ? 0.5 : 0.2,
                shadowRadius: 16,
                elevation: 20,
                flexDirection: "column",
              }}
            >
              <Animated.View
                style={{
                  flex: 1,
                  opacity: contentFadeAnim,
                }}
              >
              {/* Header with Gradient */}
              {LinearGradient ? (
                <LinearGradient
                  colors={theme.scheme === "dark" 
                    ? ["#004d4d", "#001a1a"] // Black cyan gradient: from medium cyan to very dark cyan (inverted)
                    : [theme.colors.primary, theme.colors.accent]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{
                    paddingTop: Platform.OS === "ios" ? 60 : 40,
                    paddingBottom: 24,
                    paddingHorizontal: 20,
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={require("../../../assets/images/Logo.png")}
                        style={{ width: 40, height: 40 }}
                        contentFit="contain"
                      />
                      <Text className="text-2xl font-bold text-white">Safyr</Text>
                    </View>
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
                    backgroundColor: "#001a1a", // Black cyan fallback
                  }}
                >
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center gap-3">
                      <Image
                        source={require("../../../assets/images/Logo.png")}
                        style={{ width: 40, height: 40 }}
                        contentFit="contain"
                      />
                      <Text className="text-2xl font-bold text-white">Safyr</Text>
                    </View>
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
                {menuItems.map((item, index) => {
                  const itemFadeAnim = useRef(new Animated.Value(0)).current;
                  const itemSlideAnim = useRef(new Animated.Value(-20)).current;
                  
                  useEffect(() => {
                    if (visible) {
                      Animated.parallel([
                        Animated.timing(itemFadeAnim, {
                          toValue: 1,
                          duration: 300,
                          delay: index * 50 + 100,
                          useNativeDriver: true,
                        }),
                        Animated.spring(itemSlideAnim, {
                          toValue: 0,
                          tension: 100,
                          friction: 8,
                          delay: index * 50 + 100,
                          useNativeDriver: true,
                        }),
                      ]).start();
                    } else {
                      itemFadeAnim.setValue(0);
                      itemSlideAnim.setValue(-20);
                    }
                  }, [visible]);
                  
                  return (
                    <Animated.View
                      key={item.route}
                      style={{
                        opacity: itemFadeAnim,
                        transform: [{ translateX: itemSlideAnim }],
                      }}
                    >
                      <TouchableOpacity
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
                        backgroundColor: item.isDestructive
                          ? `${theme.colors.destructive}20`
                          : `${theme.colors.primary}20`,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: 12,
                      }}
                    >
                      <Ionicons
                        name={item.icon as any}
                        size={22}
                        color={item.isDestructive ? theme.colors.destructive : theme.colors.primary}
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
                    </Animated.View>
                  );
                })}
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
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
