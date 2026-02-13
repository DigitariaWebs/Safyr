import * as React from "react";
import { Pressable, Text, type PressableProps } from "react-native";
import { cn } from "@/lib/cn";

export type ButtonVariant =
  | "default"
  | "primary" // alias of default
  | "secondary"
  | "outline"
  | "ghost"
  | "destructive"
  | "warning";

export type ButtonSize = "default" | "sm" | "lg";

export type ButtonProps = Omit<PressableProps, "children"> & {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
};

function getVariantClasses(variant: ButtonVariant) {
  switch (variant) {
    case "default":
    case "primary":
      return {
        container: "bg-primary",
        text: "text-primary-foreground",
      };
    case "secondary":
      return {
        container: "bg-secondary",
        text: "text-secondary-foreground",
      };
    case "outline":
      return {
        container: "border border-border bg-transparent",
        text: "text-foreground",
      };
    case "ghost":
      return {
        container: "bg-transparent",
        text: "text-foreground",
      };
    case "destructive":
      return {
        container: "bg-destructive",
        text: "text-destructive-foreground",
      };
    case "warning":
      return {
        container: "bg-warning",
        text: "text-warning-foreground",
      };
  }
}

function getSizeClasses(size: ButtonSize) {
  switch (size) {
    case "sm":
      return { container: "h-9 px-3 rounded-lg", text: "text-sm" };
    case "lg":
      return { container: "h-12 px-5 rounded-xl", text: "text-base" };
    case "default":
    default:
      return { container: "h-11 px-4 rounded-xl", text: "text-sm" };
  }
}

export function Button({
  children,
  variant = "default",
  size = "default",
  disabled,
  className,
  textClassName,
  ...props
}: ButtonProps) {
  const v = getVariantClasses(variant);
  const s = getSizeClasses(size);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "items-center justify-center active:opacity-80",
        v.container,
        s.container,
        disabled ? "opacity-50" : "",
        className,
      )}
      {...props}
    >
      <Text className={cn("font-semibold", v.text, s.text, textClassName)}>
        {children}
      </Text>
    </Pressable>
  );
}
