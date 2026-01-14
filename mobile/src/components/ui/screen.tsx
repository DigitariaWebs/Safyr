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
  const { scheme } = useTheme();
  return (
    <SafeAreaView
      className={cn("flex-1 bg-background", scheme === "dark" ? "dark" : "", className)}
      edges={["top"]}
    >
      <View className={cn("flex-1", contentClassName)} {...props}>
        {children}
      </View>
    </SafeAreaView>
  );
}

