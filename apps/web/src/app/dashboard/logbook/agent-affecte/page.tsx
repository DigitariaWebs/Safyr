"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Shield } from "lucide-react";

export default function AgentAffectePage() {
  const [autoCheckEnabled, setAutoCheckEnabled] = useState(true);
  const [autoTransmitEnabled, setAutoTransmitEnabled] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
          <Shield className="h-3.5 w-3.5" />
          Sécurité / Paramétrage
        </div>
        <h1 className="mt-2 font-serif text-3xl font-light tracking-tight">
          Agent affecté
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Règles de configuration encadrant la saisie des événements par les
          agents et la transmission automatique vers le module RH.
        </p>
      </div>

      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light">Règles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label>Vérification automatique agent affecté</Label>
              <p className="text-sm text-muted-foreground">
                Seuls les agents affectés au site (selon le planning) peuvent
                saisir des événements sur la main courante. Les tentatives de
                saisie hors affectation sont bloquées et journalisées.
              </p>
            </div>
            <Switch
              checked={autoCheckEnabled}
              onCheckedChange={setAutoCheckEnabled}
            />
          </div>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label>Transmission automatique vers RH</Label>
              <p className="text-sm text-muted-foreground">
                Les événements de type incident, éloge, accident de travail ou
                suivi disciplinaire sont automatiquement transmis au module RH
                pour ouverture ou enrichissement du dossier de l&apos;agent
                concerné.
              </p>
            </div>
            <Switch
              checked={autoTransmitEnabled}
              onCheckedChange={setAutoTransmitEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
