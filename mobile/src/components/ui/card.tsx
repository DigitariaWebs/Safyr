import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";
import { useTheme } from "@/theme";

export type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className, style, ...props }: CardProps) {
  const { scheme } = useTheme();

  return (
    <View
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        className,
      )}
      style={[
        {
          shadowColor: scheme === "dark" ? "#000" : "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: scheme === "dark" ? 0.3 : 0.1,
          shadowRadius: 4,
          elevation: 2,
        },
        style,
      ]}
      {...props}
    />
  );
}

