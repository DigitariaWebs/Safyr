"use client";

import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

interface PhoneInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value: string;
  onChange: (value: string) => void;
}

export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);

    const formatPhoneNumber = (input: string) => {
      // Remove all non-digit characters
      const digits = input.replace(/\D/g, "");

      // Format with spaces after every 2 digits
      let formatted = "";
      for (let i = 0; i < digits.length; i++) {
        if (i > 0 && i % 2 === 0) {
          formatted += " ";
        }
        formatted += digits[i];
      }

      return formatted;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;
      const digits = input.replace(/\D/g, "");

      // Update the raw value (digits only)
      onChange(digits);

      // Update the display value (formatted)
      setDisplayValue(formatPhoneNumber(digits));
    };

    const handleBlur = () => {
      // Ensure formatting on blur
      setDisplayValue(formatPhoneNumber(value));
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="tel"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder="+33 6 12 34 56 78"
      />
    );
  },
);

PhoneInput.displayName = "PhoneInput";
