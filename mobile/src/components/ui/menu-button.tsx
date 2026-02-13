import { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/theme";
import { MenuDrawer } from "./menu-drawer";

export function MenuButton() {
  const [menuVisible, setMenuVisible] = useState(false);
  const theme = useTheme();

  return (
    <>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="rounded-full p-2"
        style={{ backgroundColor: theme.colors.muted }}
      >
        <Ionicons name="menu" size={24} color={theme.colors.foreground} />
      </TouchableOpacity>
      <MenuDrawer visible={menuVisible} onClose={() => setMenuVisible(false)} />
    </>
  );
}
