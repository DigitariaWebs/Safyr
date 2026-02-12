import * as React from "react";
import { View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";

export type CardProps = ViewProps & {
  className?: string;
};

export function Card({ className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        "rounded-xl border border-border bg-card p-4",
        // mild "glass" feel; safe on mobile
        "shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

