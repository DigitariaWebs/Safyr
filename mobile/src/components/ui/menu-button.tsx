import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Menu } from "lucide-react-native";
import { useTheme } from "@/theme";
import { MenuDrawer } from "./menu-drawer";

export function MenuButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (menuVisible) {
      Animated.spring(scaleAnim, {
        toValue: 0.9,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [menuVisible, scaleAnim]);

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.8}
          accessibilityLabel="Ouvrir le menu"
          accessibilityRole="button"
          style={{
            borderRadius: 12,
            padding: 10,
            backgroundColor: "transparent",
            borderWidth: 1,
            borderColor: theme.colors.border,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: theme.scheme === "dark" ? 0.15 : 0.05,
            shadowRadius: 4,
            elevation: 1,
          }}
        >
          <Menu size={22} color={theme.colors.foreground} />
        </TouchableOpacity>
      </Animated.View>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
