import React, { useImperativeHandle, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

export type ZoneAlertBannerHandle = {
  show: (message: string, color: string) => void;
};

export const ZoneAlertBanner = React.forwardRef<ZoneAlertBannerHandle>(
  function ZoneAlertBanner(_props, ref) {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();
    const colorScheme = useColorScheme();
    const blurTint = colorScheme === "dark" ? "dark" : "light";

    const translateY = useRef(new Animated.Value(-100)).current;
    const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const [state, setState] = useState<{
      message: string;
      color: string;
      visible: boolean;
    }>({ message: "", color: "", visible: false });

    useImperativeHandle(ref, () => ({
      show(message: string, color: string) {
        // Clear any existing dismiss timer
        if (dismissTimer.current) {
          clearTimeout(dismissTimer.current);
          dismissTimer.current = null;
        }

        // Update state
        setState({ message, color, visible: true });

        // Animate in
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }).start();

        // Start auto-dismiss timer
        dismissTimer.current = setTimeout(() => {
          Animated.timing(translateY, {
            toValue: -100,
            duration: 200,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }).start(() => {
            setState((prev) => ({ ...prev, visible: false }));
          });
          dismissTimer.current = null;
        }, 5000);
      },
    }));

    if (!state.visible) return null;

    return (
      <Animated.View
        pointerEvents="box-none"
        accessibilityRole="alert"
        accessibilityLiveRegion="assertive"
        style={[
          styles.container,
          {
            top: insets.top + 8,
            transform: [{ translateY }],
          },
        ]}
      >
        <BlurView intensity={50} tint={blurTint} style={styles.blur}>
          <View
            style={[
              styles.inner,
              {
                backgroundColor: `${state.color}33`,
                borderColor: colors.borderSubtle,
                borderWidth: StyleSheet.hairlineWidth,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: colors.foreground,
                  fontFamily: getBodyFont("600"),
                },
              ]}
            >
              {state.message}
            </Text>
          </View>
        </BlurView>
      </Animated.View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    marginHorizontal: 16,
    zIndex: 100,
  },
  blur: {
    borderRadius: 12,
    overflow: "hidden",
  },
  inner: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  text: {
    fontSize: 13,
    textAlign: "center",
  },
});
