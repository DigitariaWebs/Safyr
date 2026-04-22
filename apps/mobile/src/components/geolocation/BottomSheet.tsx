import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from "@/theme";

interface BottomSheetProps {
  /** Height of the minimized (collapsed) state */
  minHeight: number;
  /** Height of the expanded state */
  maxHeight: number;
  /** Extra offset from the bottom (e.g. tab bar height) */
  bottomOffset: number;
  /** Content rendered inside the sheet */
  children: React.ReactNode;
  /** Header content always visible in collapsed state */
  header: React.ReactNode;
  /** Called when sheet state changes */
  onStateChange?: (expanded: boolean) => void;
  /** Programmatically control expanded state */
  expanded?: boolean;
}

export function BottomSheet({
  minHeight,
  maxHeight,
  bottomOffset,
  children,
  header,
  onStateChange,
  expanded: expandedProp,
}: BottomSheetProps) {
  const { colors } = useTheme();
  const colorScheme = useColorScheme();
  const blurTint = colorScheme === "dark" ? "dark" : "light";

  const expandedRef = useRef(expandedProp ?? false);
  const collapseDistance = maxHeight - minHeight;

  // translateY: 0 = expanded, collapseDistance = collapsed
  const translateY = useRef(new Animated.Value(collapseDistance)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  function animateTo(expanded: boolean) {
    expandedRef.current = expanded;
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: expanded ? 0 : collapseDistance,
        damping: 20,
        stiffness: 200,
        mass: 0.5,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: expanded ? 1 : 0,
        duration: expanded ? 250 : 150,
        useNativeDriver: true,
      }),
    ]).start();
    onStateChange?.(expanded);
  }

  // React to programmatic changes
  useEffect(() => {
    if (expandedProp === undefined) return;
    if (expandedProp !== expandedRef.current) {
      animateTo(expandedProp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expandedProp]);

  function toggle() {
    animateTo(!expandedRef.current);
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          bottom: bottomOffset,
          height: maxHeight,
          transform: [{ translateY }],
        },
      ]}
    >
      <BlurView intensity={50} tint={blurTint} style={styles.blur}>
        <View
          style={[
            styles.inner,
            {
              backgroundColor: `${colors.background}CC`,
              borderColor: colors.borderSubtle,
            },
          ]}
        >
          {/* Tap handle to toggle */}
          <Pressable onPress={toggle} style={styles.handleContainer}>
            <View
              style={[
                styles.handle,
                { backgroundColor: colors.mutedForeground },
              ]}
            />
          </Pressable>

          {/* Header — always visible */}
          <View style={styles.headerContent}>{header}</View>

          {/* Expandable content */}
          <Animated.View style={[styles.content, { opacity: contentOpacity }]}>
            {children}
          </Animated.View>
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: "hidden",
  },
  blur: {
    flex: 1,
  },
  inner: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  handleContainer: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    opacity: 0.4,
  },
  headerContent: {
    gap: 10,
  },
  content: {
    flex: 1,
    marginTop: 10,
  },
});
