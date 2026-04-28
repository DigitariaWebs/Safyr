"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap } from "lucide-react";

export default function H0B0Page() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Habilitations H0B0
        </h1>
        <p className="text-muted-foreground">
          Suivi des habilitations électriques H0B0 des agents
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Module en cours de construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Gestion dédiée aux habilitations H0B0 : délivrance, renouvellement,
            alertes d&apos;expiration.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
