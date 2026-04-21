"use client";

import { useState } from "react";
import { AlertTriangle, Clock, Save, X, ZoomIn } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type {
  CheckpointScan,
  PatrolCheckpoint,
} from "@/data/geolocation-patrols";

export type IncidentSendTarget = "responsable" | "client";

interface PatrolIncidentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  scan: CheckpointScan | null;
  checkpoint: PatrolCheckpoint | null;
  checkpointIndex: number;
  onSendReport?: (target: IncidentSendTarget) => void;
  onSaveObservation?: (observation: string) => void;
}

export function PatrolIncidentModal({
  open,
  onOpenChange,
  scan,
  checkpoint,
  checkpointIndex,
  onSendReport,
  onSaveObservation,
}: PatrolIncidentModalProps) {
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [observation, setObservation] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setObservation(scan?.incidentDescription ?? "");
      setSavedFlash(false);
    }
  }

  if (!scan) return null;

  const scannedTime = scan.scannedAt
    ? new Date(scan.scannedAt).toLocaleString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const checkpointName = checkpoint?.name ?? `Point ${checkpointIndex + 1}`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/15">
                <AlertTriangle className="h-3.5 w-3.5 text-red-400" />
              </span>
              Incident — {checkpointName}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Timestamp */}
            {scannedTime && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                {scannedTime}
              </div>
            )}

            {/* Comment */}
            {scan.comment && (
              <div className="rounded-lg border border-border/50 bg-muted/20 px-3 py-2.5">
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                  Note de l&apos;agent
                </div>
                <p className="text-sm text-foreground/90 italic leading-relaxed">
                  &ldquo;{scan.comment}&rdquo;
                </p>
              </div>
            )}

            {/* Observation (editable) */}
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2.5">
              <div className="flex items-center justify-between mb-1.5">
                <div className="text-[10px] font-medium uppercase tracking-wider text-red-400">
                  Observation de l&apos;incident
                </div>
                {savedFlash && (
                  <span className="text-[10px] text-emerald-400">
                    Enregistré
                  </span>
                )}
              </div>
              <textarea
                value={observation}
                onChange={(e) => setObservation(e.target.value)}
                placeholder="Décrire l'incident observé sur ce point de contrôle…"
                rows={3}
                className="w-full text-sm bg-background/40 border border-border/50 rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500/40 leading-relaxed resize-none"
              />
              {onSaveObservation && (
                <div className="flex justify-end mt-1.5">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-[11px] text-muted-foreground hover:text-foreground"
                    onClick={() => {
                      onSaveObservation(observation);
                      setSavedFlash(true);
                      setTimeout(() => setSavedFlash(false), 1500);
                    }}
                  >
                    <Save className="h-3 w-3 mr-1" />
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>

            {/* Media grid */}
            {scan.mediaUrls && scan.mediaUrls.length > 0 && (
              <div>
                <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-2">
                  Photos / Vidéos ({scan.mediaUrls.length})
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {scan.mediaUrls.map((url, i) => (
                    <button
                      key={i}
                      onClick={() => setLightboxUrl(url)}
                      className="group relative aspect-square rounded-lg overflow-hidden border border-border/50 hover:border-border transition-colors"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt={`Media ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                        <ZoomIn className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            {onSendReport && (
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => {
                    onOpenChange(false);
                    onSendReport("responsable");
                  }}
                >
                  Envoyer au responsable
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  onClick={() => {
                    onOpenChange(false);
                    onSendReport("client");
                  }}
                >
                  Envoyer au client
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      {lightboxUrl && (
        <Dialog open={!!lightboxUrl} onOpenChange={() => setLightboxUrl(null)}>
          <DialogContent
            className="max-w-3xl p-0 overflow-hidden"
            showCloseButton={false}
          >
            <button
              onClick={() => setLightboxUrl(null)}
              className="absolute top-3 right-3 z-10 h-8 w-8 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 transition-colors text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxUrl}
              alt="Agrandir"
              className="w-full h-auto max-h-[80vh] object-contain"
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
