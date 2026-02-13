import * as React from "react";
import { Text, View, type ViewProps } from "react-native";
import { cn } from "@/lib/cn";

export type HeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  left?: React.ReactNode;
  className?: string;
};

export function Header({
  title,
  subtitle,
  right,
  left,
  className,
  ...props
}: HeaderProps) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between px-4 pb-3 pt-4",
        "border-b border-border/50",
        className
      )}
      style={{
        backgroundColor: "transparent",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
      {...props}
    >
      <View className="flex-row items-center gap-3 flex-1">
        {left}
        <View className="flex-1">
          <Text className="text-2xl font-bold text-foreground">{title}</Text>
          {subtitle ? (
            <Text className="mt-0.5 text-sm text-muted-foreground">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {right ? <View className="ml-3">{right}</View> : null}
    </View>
  );
}

