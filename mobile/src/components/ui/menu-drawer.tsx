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
} from "react-native";
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
      icon: "person-outline",
      label: "Mon profil",
      route: "/(app)/profile",
      onPress: () => handleNavigate("/(app)/profile"),
    },
    {
      icon: "document-text-outline",
      label: "Documents",
      route: "/(app)/documents",
      onPress: () => handleNavigate("/(app)/documents"),
    },
    {
      icon: "home-outline",
      label: "Accueil",
      route: "/(app)/(tabs)/",
      onPress: () => handleNavigate("/(app)/(tabs)/"),
    },
    {
      icon: "list-outline",
      label: "Main courante",
      route: "/(app)/(tabs)/main-courante",
      onPress: () => handleNavigate("/(app)/(tabs)/main-courante"),
    },
    {
      icon: "walk-outline",
      label: "Ronde",
      route: "/(app)/(tabs)/ronde",
      onPress: () => handleNavigate("/(app)/(tabs)/ronde"),
    },
    {
      icon: "location-outline",
      label: "Géolocalisation",
      route: "/(app)/(tabs)/geolocation",
      onPress: () => handleNavigate("/(app)/(tabs)/geolocation"),
    },
    {
      icon: "warning-outline",
      label: "SOS",
      route: "/(app)/sos",
      onPress: () => handleNavigate("/(app)/sos"),
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
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            opacity: overlayOpacity,
          }}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              style={{
                width: 280,
                height: "100%",
                backgroundColor: theme.colors.background,
                transform: [{ translateX: slideAnim }],
                shadowColor: "#000",
                shadowOffset: { width: 2, height: 0 },
                shadowOpacity: 0.25,
                shadowRadius: 8,
                elevation: 8,
              }}
            >
              {/* Header */}
              <View
                style={{
                  paddingTop: Platform.OS === "ios" ? 60 : 40,
                  paddingBottom: 20,
                  paddingHorizontal: 20,
                  borderBottomWidth: 1,
                  borderBottomColor: theme.colors.border,
                  backgroundColor: theme.colors.card,
                }}
              >
                <View className="flex-row items-center justify-between mb-3">
                  <Text className="text-xl font-bold text-foreground">Menu</Text>
                  <TouchableOpacity
                    onPress={onClose}
                    className="rounded-full p-2"
                    style={{ backgroundColor: theme.colors.muted }}
                  >
                    <Ionicons name="close" size={20} color={theme.colors.foreground} />
                  </TouchableOpacity>
                </View>
                {session && (
                  <View>
                    <Text className="text-sm text-muted-foreground">Connecté en tant que</Text>
                    <Text className="mt-1 text-base font-semibold text-foreground">
                      {session.fullName}
                    </Text>
                  </View>
                )}
              </View>

              {/* Menu Items */}
              <View className="flex-1 pt-4">
                {menuItems.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={item.onPress}
                    className="flex-row items-center px-5 py-4 active:bg-muted"
                    style={{
                      borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                      borderBottomColor: theme.colors.border,
                    }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={22}
                      color={theme.colors.foreground}
                    />
                    <Text className="ml-4 text-base text-foreground">{item.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Footer */}
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
                  className="flex-row items-center justify-center rounded-lg py-3"
                  style={{ backgroundColor: theme.colors.destructive }}
                >
                  <Ionicons name="log-out-outline" size={20} color="#fff" />
                  <Text className="ml-2 font-semibold text-white">Déconnexion</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
