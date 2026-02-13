import { useState, useEffect, useRef } from "react";
import { TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  }, [menuVisible]);

  return (
    <>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={() => setMenuVisible(true)}
          activeOpacity={0.8}
          style={{
            borderRadius: 12,
            padding: 10,
            backgroundColor: theme.colors.primary,
            shadowColor: theme.colors.primary,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: 4,
          }}
        >
          <Ionicons name="menu" size={22} color="#fff" />
        </TouchableOpacity>
      </Animated.View>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
