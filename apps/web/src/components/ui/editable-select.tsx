"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, CheckCircle2, Edit3, Loader2, X } from "lucide-react";

interface EditableSelectProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onSave: (v: string) => Promise<void>;
  className?: string;
}

export function EditableSelect({
  label,
  value,
  options,
  onSave,
  className,
}: EditableSelectProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startEdit = () => {
    setDraft(value);
    setIsEditing(true);
    setSuccess(false);
    setError(null);
  };

  const cancel = () => {
    setDraft(value);
    setIsEditing(false);
    setError(null);
  };

  const save = async () => {
    if (draft === value) {
      setIsEditing(false);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await onSave(draft);
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const displayValue = isEditing ? draft : value;

  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <div className="flex items-center justify-between">
        <Label className={error ? "text-destructive" : ""}>{label}</Label>
        <div className="flex items-center gap-1">
          {!isEditing ? (
            <>
              {success && <CheckCircle2 className="h-4 w-4 text-green-500" />}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={startEdit}
                disabled={saving}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                onClick={cancel}
                disabled={saving}
              >
                <X className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-primary hover:text-primary hover:bg-primary/10"
                onClick={save}
                disabled={saving || draft === value}
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>
      <Select
        value={displayValue}
        onValueChange={(v) => setDraft(v)}
        disabled={!isEditing || saving}
      >
        <SelectTrigger
          className={`w-full ${
            !isEditing
              ? "bg-muted/30 border-transparent shadow-none focus-visible:ring-0"
              : error
                ? "border-destructive"
                : ""
          }`}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}
