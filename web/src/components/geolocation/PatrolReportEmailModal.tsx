"use client";

import { useState } from "react";
import { Mail, Paperclip, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { PatrolExecution } from "@/data/geolocation-patrols";

interface PatrolReportEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  execution: PatrolExecution | null;
  onDownloadPDF?: () => void;
}

export function PatrolReportEmailModal({
  open,
  onOpenChange,
  execution,
  onDownloadPDF,
}: PatrolReportEmailModalProps) {
  const [recipient, setRecipient] = useState("");
  const [attachPdf, setAttachPdf] = useState(true);
  const [sent, setSent] = useState(false);

  if (!execution) return null;

  const dateStr = new Date(execution.startedAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const subject = `Rapport de ronde — ${execution.site} — ${dateStr}`;
  const body = `Bonjour,\n\nVeuillez trouver ci-joint le rapport de ronde effectuée le ${dateStr} sur le site ${execution.site} par l'agent ${execution.agentName}.\n\nTaux de complétion : ${execution.completionRate}%\nDurée : ${execution.actualDurationMinutes ?? "—"} min\n\nCordialement,\nPRODIGE SÉCURITÉ`;

  function handleSend() {
    if (!recipient) return;
    if (attachPdf && onDownloadPDF) onDownloadPDF();
    setSent(true);
    setTimeout(() => {
      setSent(false);
      setRecipient("");
      onOpenChange(false);
    }, 1500);
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      setSent(false);
      setRecipient("");
    }
    onOpenChange(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500/15">
              <Mail className="h-3.5 w-3.5 text-cyan-400" />
            </span>
            Envoyer le rapport par mail
          </DialogTitle>
        </DialogHeader>

        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15">
              <Send className="h-6 w-6 text-emerald-400" />
            </div>
            <p className="text-sm font-medium text-emerald-400">
              Rapport envoyé avec succès
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="recipient" className="text-xs">
                Destinataire
              </Label>
              <Input
                id="recipient"
                type="email"
                placeholder="contact@client.fr"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="h-8 text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Objet</Label>
              <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
                {subject}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">Corps du message</Label>
              <div className="rounded-md border border-border/50 bg-muted/30 px-3 py-2 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                {body}
              </div>
            </div>

            <button
              onClick={() => setAttachPdf((v) => !v)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-xs transition-colors",
                attachPdf
                  ? "border-cyan-500/30 bg-cyan-500/8 text-cyan-400"
                  : "border-border/50 bg-muted/20 text-muted-foreground hover:bg-muted/40",
              )}
            >
              <Paperclip className="h-3.5 w-3.5 shrink-0" />
              <span>Joindre le rapport PDF</span>
              <span className="ml-auto text-[10px] font-medium">
                {attachPdf ? "✓ Activé" : "Désactivé"}
              </span>
            </button>
          </div>
        )}

        {!sent && (
          <DialogFooter>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              className="text-xs"
            >
              Annuler
            </Button>
            <Button
              size="sm"
              onClick={handleSend}
              disabled={!recipient}
              className="text-xs"
            >
              <Send className="h-3.5 w-3.5 mr-1.5" />
              Envoyer
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
