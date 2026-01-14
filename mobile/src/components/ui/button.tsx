import * as React from "react";
import { Text, TouchableOpacity, type TouchableOpacityProps } from "react-native";

type ButtonVariant =
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  | "ghost"
  | "link"
  // Back-compat (older mobile screens)
  | "primary"
  | "warning"
  | "danger";

type ButtonSize = "default" | "sm" | "lg";

export type ButtonProps = Omit<TouchableOpacityProps, "onPress"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  onPress: () => void;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
};

const VARIANT_CLASSNAME: Record<ButtonVariant, string> = {
  default: "bg-primary",
  primary: "bg-primary",
  secondary: "bg-secondary",
  destructive: "bg-destructive",
  danger: "bg-destructive",
  warning: "bg-warning",
  outline: "border border-input bg-background",
  ghost: "bg-transparent",
  link: "bg-transparent",
};

const TEXT_CLASSNAME: Record<ButtonVariant, string> = {
  default: "text-primary-foreground",
  primary: "text-primary-foreground",
  secondary: "text-secondary-foreground",
  destructive: "text-destructive-foreground",
  danger: "text-destructive-foreground",
  warning: "text-warning-foreground",
  outline: "text-foreground",
  ghost: "text-foreground",
  link: "text-primary underline",
};

const SIZE_CLASSNAME: Record<ButtonSize, string> = {
  default: "h-10 px-4",
  sm: "h-9 px-3",
  lg: "h-11 px-6",
};

export function Button({
  variant = "default",
  size = "default",
  className,
  textClassName,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      className={[
        "items-center justify-center rounded-lg",
        SIZE_CLASSNAME[size],
        VARIANT_CLASSNAME[variant],
        disabled ? "opacity-50" : "",
        className ?? "",
      ].join(" ")}
      {...props}
    >
      <Text
        className={[
          "text-center text-sm font-medium",
          TEXT_CLASSNAME[variant],
          textClassName ?? "",
        ].join(" ")}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

