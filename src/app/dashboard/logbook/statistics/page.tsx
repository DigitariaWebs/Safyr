"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function StatisticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Statistiques
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Analyse et rapports des événements
        </p>
      </div>

      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Rapports et KPIs
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-light text-muted-foreground">
            Module statistiques en développement
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

