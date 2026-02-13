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
        // Enhanced shadow for modern look
        "shadow-md",
        className,
      )}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
      }}
      {...props}
    />
  );
}

