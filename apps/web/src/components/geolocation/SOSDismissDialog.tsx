"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { DISMISS_REASONS } from "@/data/geolocation-sos";
import { useSOSStore } from "@/lib/stores/sosStore";

interface SOSDismissDialogProps {
  sosId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SOSDismissDialog({
  sosId,
  open,
  onOpenChange,
}: SOSDismissDialogProps) {
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  function handleConfirm() {
    useSOSStore.getState().dismissAlert(sosId, reason, note || undefined);
    setReason("");
    setNote("");
    onOpenChange(false);
  }

  function handleCancel() {
    setReason("");
    setNote("");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Clôturer l&apos;alerte SOS</DialogTitle>
          <DialogDescription>
            Sélectionnez une raison pour clôturer cette alerte.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <Select value={reason} onValueChange={setReason}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner une raison…" />
            </SelectTrigger>
            <SelectContent>
              {DISMISS_REASONS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Notes additionnelles (optionnel)"
            rows={3}
          />
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleCancel}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason}
          >
            Confirmer la clôture
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
