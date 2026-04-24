import React from "react";
import { Label } from "@/components/ui/label";
import type { AnyFieldApi } from "@tanstack/react-form";

interface FormFieldProps {
  field: AnyFieldApi;
  label: string;
  children: React.ReactElement<{
    id?: string;
    value?: string;
    onBlur?: () => void;
    onChange?: (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void;
    className?: string;
  }>;
  className?: string;
}

export function FormField({
  field,
  label,
  children,
  className,
}: FormFieldProps) {
  const isInvalid = field.state.meta.errors.length > 0;

  return (
    <div className={className}>
      <Label
        htmlFor={field.name}
        className={isInvalid ? "text-destructive" : ""}
      >
        {label}
      </Label>
      <div className="mt-1">
        {React.cloneElement(children, {
          id: field.name,
          value: (field.state.value as string) ?? "",
          onBlur: field.handleBlur,
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => field.handleChange(e.target.value as never),
          className: `${children.props.className || ""} ${
            isInvalid
              ? "border-destructive ring-destructive/20 text-destructive placeholder:text-destructive/60"
              : ""
          }`,
        })}
      </div>
      {isInvalid && (
        <p className="mt-1 text-xs text-destructive">
          {field.state.meta.errors.join(", ")}
        </p>
      )}
    </div>
  );
}
