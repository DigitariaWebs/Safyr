import * as React from "react";
import { View, type ViewProps } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";

export type ScreenProps = ViewProps & {
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
};

export function Screen({ className, contentClassName, children, ...props }: ScreenProps) {
  const { scheme, colors } = useTheme();

  return (
    <View
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <View
        className={cn("flex-1", scheme === "dark" ? "dark" : "", contentClassName)}
        {...props}
      >
        {children}
      </View>
    </View>
  );
}
