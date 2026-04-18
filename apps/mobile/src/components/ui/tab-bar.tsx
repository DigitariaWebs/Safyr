import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { AlertTriangle } from "lucide-react-native";
import Svg, { Circle } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const SOS_LONG_PRESS_MS = 2000;
const SOS_TAP_THRESHOLD = 5;
const SOS_TAP_WINDOW_MS = 3000;
const SOS_COUNTDOWN_START = 3;

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const activeRoute = state.routes[state.index]?.name;
  const isOnGeoScreen = activeRoute === "geolocation/index";

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <BlurView
        intensity={50}
        tint={scheme === "dark" ? "dark" : "light"}
        style={styles.blur}
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: `${colors.background}CC`,
              borderTopColor: isOnGeoScreen
                ? "transparent"
                : colors.borderSubtle,
              paddingBottom: Math.max(insets.bottom, 8),
            },
          ]}
        >
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;
            const isSOS = route.name === "sos";

            if (isSOS) {
              return (
                <SOSButton
                  key={route.key}
                  colors={colors}
                  navigation={navigation}
                />
              );
            }

            const label = options.title ?? route.name;
            const color = isFocused ? colors.primary : colors.mutedForeground;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <Pressable
                key={route.key}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: isFocused }}
                accessibilityLabel={label}
                style={styles.tab}
              >
                {options.tabBarIcon?.({ color, size: 20, focused: isFocused })}
                <Text
                  style={[
                    styles.label,
                    {
                      color,
                      fontFamily: getBodyFont(isFocused ? "600" : "400"),
                    },
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// SOS Center Button
// ---------------------------------------------------------------------------

interface SOSButtonProps {
  colors: ReturnType<typeof useTheme>["colors"];
  navigation: BottomTabBarProps["navigation"];
}

const CIRCLE_SIZE = 52;
const STROKE_WIDTH = 3;
const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function SOSButton({ colors, navigation }: SOSButtonProps) {
  const traceAnim = useRef(new Animated.Value(0)).current;
  const longPressRef = useRef<Animated.CompositeAnimation | null>(null);
  const tapTimestamps = useRef<number[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const triggerSOS = useCallback(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    navigation.navigate("sos");
  }, [navigation]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();

    traceAnim.setValue(0);
    const anim = Animated.timing(traceAnim, {
      toValue: 1,
      duration: SOS_LONG_PRESS_MS,
      useNativeDriver: true,
    });
    longPressRef.current = anim;
    anim.start(({ finished }) => {
      if (finished) triggerSOS();
    });
  };

  const handlePressOut = () => {
    longPressRef.current?.stop();
    traceAnim.setValue(0);
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePress = () => {
    if (countdown !== null) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const now = Date.now();
    tapTimestamps.current = tapTimestamps.current.filter(
      (t) => now - t < SOS_TAP_WINDOW_MS,
    );
    tapTimestamps.current.push(now);
    const tapCount = tapTimestamps.current.length;
    if (tapCount >= SOS_COUNTDOWN_START && tapCount < SOS_TAP_THRESHOLD) {
      startCountdown(SOS_TAP_THRESHOLD - tapCount);
    }
  };

  const startCountdown = (remaining: number) => {
    setCountdown(remaining);
    tapTimestamps.current = [];
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          countdownRef.current = null;
          triggerSOS();
          return null;
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        return prev - 1;
      });
    }, 1000);
  };

  const cancelCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = null;
    setCountdown(null);
    tapTimestamps.current = [];
  };

  const strokeDashoffset = traceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });

  return (
    <View style={styles.sosContainer}>
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <Pressable
          onPress={countdown !== null ? cancelCountdown : handlePress}
          onPressIn={countdown !== null ? undefined : handlePressIn}
          onPressOut={countdown !== null ? undefined : handlePressOut}
          accessibilityRole="button"
          accessibilityLabel="SOS — Alerte d'urgence"
          style={[
            styles.sosButton,
            {
              backgroundColor: colors.destructive,
              shadowColor: colors.destructive,
            },
          ]}
        >
          <View style={styles.sosSvgOverlay}>
            <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
              <AnimatedCircle
                cx={CIRCLE_SIZE / 2}
                cy={CIRCLE_SIZE / 2}
                r={RADIUS}
                stroke="#fff"
                strokeWidth={STROKE_WIDTH}
                fill="none"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90, ${CIRCLE_SIZE / 2}, ${CIRCLE_SIZE / 2})`}
              />
            </Svg>
          </View>
          {countdown !== null ? (
            <Text style={styles.sosCountdown}>{countdown}</Text>
          ) : (
            <AlertTriangle size={22} color="#fff" />
          )}
        </Pressable>
      </Animated.View>
      <Text
        style={[
          styles.label,
          {
            color: colors.destructive,
            fontFamily: getBodyFont("600"),
            marginTop: 2,
          },
        ]}
      >
        {countdown !== null ? "Annuler" : "SOS"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  blur: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingTop: 6,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    paddingVertical: 4,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
  },
  sosContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: -18,
  },
  sosButton: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  sosSvgOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  sosCountdown: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },
});
