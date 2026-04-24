"use client";

import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

const formatPhoneNumber = (input: string) => {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  let formatted = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && i % 2 === 0) formatted += " ";
    formatted += digits[i];
  }
  return formatted;
};

type PhoneFieldProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "type"
> & {
  value?: string | number | readonly string[];
};

// Event-style phone input. Emits digits-only via onChange event target.value.
// Use inside EditableFormField (which clones with injected event handlers).
export const PhoneField = forwardRef<HTMLInputElement, PhoneFieldProps>(
  ({ value, onChange, placeholder = "06 12 34 56 78", ...props }, ref) => {
    const displayValue = formatPhoneNumber(String(value ?? ""));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const digits = e.target.value.replace(/\D/g, "").slice(0, 10);
      const synthetic = {
        ...e,
        target: { ...e.target, value: digits },
        currentTarget: { ...e.currentTarget, value: digits },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange?.(synthetic);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
      />
    );
  },
);

PhoneField.displayName = "PhoneField";
