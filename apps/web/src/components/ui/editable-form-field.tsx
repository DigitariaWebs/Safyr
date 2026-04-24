import React, { useEffect, useRef, useState } from "react";
import { Check, Edit3, Loader2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { AnyFieldApi } from "@tanstack/react-form";
import { cn } from "@/lib/utils";

type InjectedProps = {
  id?: string;
  value?: unknown;
  onBlur?: () => void;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  disabled?: boolean;
  className?: string;
};

interface EditableFormFieldProps {
  field: AnyFieldApi;
  label: string;
  onSave: (value: string | number | null) => Promise<void>;
  children: React.ReactElement<InjectedProps>;
  className?: string;
  helperText?: string;
}

export function EditableFormField({
  field,
  label,
  onSave,
  children,
  className,
  helperText,
}: EditableFormFieldProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const successTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editStartValueRef = useRef<unknown>(null);

  useEffect(
    () => () => {
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
    },
    [],
  );

  const isTouched = field.state.meta.isTouched;
  const isInvalid = isTouched && field.state.meta.errors.length > 0;
  const isDirty = Boolean(field.state.meta.isDirty);

  const handleEdit = () => {
    editStartValueRef.current = field.state.value;
    setIsEditing(true);
    setIsSuccess(false);
    setServerError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    field.setValue(editStartValueRef.current as never);
    setServerError(null);
  };

  const handleSave = async () => {
    if (isInvalid) return;

    setIsSaving(true);
    setServerError(null);
    try {
      await onSave(field.state.value as string | number | null);
      setIsSuccess(true);
      setIsEditing(false);
      if (successTimeoutRef.current) clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = setTimeout(() => setIsSuccess(false), 3000);
    } catch (e: unknown) {
      console.error(e);
      const message =
        e instanceof Error
          ? e.message
          : "Une erreur est survenue lors de la sauvegarde";
      setServerError(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between">
        <Label
          htmlFor={field.name}
          className={cn(
            isInvalid || serverError ? "text-destructive" : "",
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          )}
        >
          {label}
        </Label>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <div className="flex items-center gap-1">
              {isSuccess && (
                <CheckCircle2 className="h-4 w-4 text-green-500 animate-in fade-in duration-300" />
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={handleEdit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Edit3 className="h-4 w-4" />
                )}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-1 animate-in slide-in-from-right-2 duration-200">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleCancel}
                disabled={isSaving}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                onClick={handleSave}
                disabled={isSaving || isInvalid || !isDirty}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="relative">
        {React.cloneElement<InjectedProps>(children, {
          id: field.name,
          value: field.state.value ?? "",
          onBlur: field.handleBlur,
          onChange: (
            e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
          ) => field.handleChange(e.target.value as never),
          disabled: !isEditing || isSaving,
          className: cn(
            children.props.className,
            !isEditing &&
              "bg-muted/30 border-transparent shadow-none cursor-default focus-visible:ring-0",
            (isInvalid || serverError) &&
              "border-destructive ring-destructive/20 text-destructive placeholder:text-destructive/60",
            isSuccess && "border-green-500/50 bg-green-50/30",
          ),
        })}
      </div>

      {(isInvalid || serverError || helperText) && (
        <p
          className={cn(
            "mt-1 text-xs animate-in fade-in slide-in-from-top-1 duration-200",
            isInvalid || serverError
              ? "text-destructive"
              : "text-muted-foreground",
          )}
        >
          {serverError ||
            field.state.meta.errors
              .map((err) =>
                typeof err === "string" ? err : (err?.message ?? ""),
              )
              .filter(Boolean)
              .join(", ") ||
            helperText}
        </p>
      )}
    </div>
  );
}
