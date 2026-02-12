import * as React from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import { cn } from "@/lib/cn";

export type InputProps = TextInputProps & {
  className?: string;
  containerClassName?: string;
};

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, containerClassName, ...props }, ref) => {
    return (
      <View
        className={cn(
          "h-11 flex-row items-center rounded-lg border border-input bg-background px-3",
          containerClassName,
        )}
      >
        <TextInput
          ref={ref}
          placeholderTextColor={"#94a3b8"}
          className={cn(
            "flex-1 text-base text-foreground",
            // iOS sometimes compresses text inputs without a line height
            "leading-5",
            className,
          )}
          {...props}
        />
      </View>
    );
  },
);
Input.displayName = "Input";

