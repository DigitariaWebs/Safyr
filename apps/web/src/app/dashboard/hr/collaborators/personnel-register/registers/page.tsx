"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function RegistersPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Registres réglementaires
        </h1>
        <p className="text-muted-foreground">
          Consultation et tenue des registres obligatoires
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Module en cours de construction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Registres réglementaires centralisés : personnel, DUERP, accidents,
            formations, CDD et autres registres obligatoires.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
