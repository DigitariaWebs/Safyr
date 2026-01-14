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
      className={cn("flex-row items-center justify-between px-4 pb-2 pt-4", className)}
      {...props}
    >
      <View className="flex-row items-center gap-3">
        {left}
        <View>
          <Text className="text-xl font-semibold text-foreground">{title}</Text>
          {subtitle ? (
            <Text className="mt-1 text-sm text-muted-foreground">{subtitle}</Text>
          ) : null}
        </View>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

