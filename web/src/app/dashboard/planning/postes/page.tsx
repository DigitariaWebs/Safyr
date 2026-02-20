"use client";

import { Briefcase } from "lucide-react";

export default function PostesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="h-8 w-8 text-primary" />
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Gestion des Postes
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Création et gestion des différents postes de sécurité
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-border/40 bg-card p-8 text-center">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium">Page en développement</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La fonctionnalité de gestion des postes sera bientôt disponible.
        </p>
      </div>
    </div>
  );
}
