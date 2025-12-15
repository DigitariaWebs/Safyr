"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Landmark,
  AlertCircle,
  ChevronRight,
  Building2,
  Receipt,
  CalendarDays,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Widget: Chiffre d'Affaires (Revenue)
function RevenueWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="col-span-2 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Receipt className="h-4 w-4 text-primary" />
          CA Chiffre d&apos;Affaires
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-4xl font-light tracking-tight">
              1,234,567 €
            </span>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1 text-emerald-400 text-sm">
                <TrendingUp className="h-3 w-3" />
                <span>+5%</span>
              </div>
              <span className="text-xs text-muted-foreground">
                vs mois dernier
              </span>
            </div>
          </div>
        </div>
        {/* Mini chart placeholder */}
        <div className="mt-4 flex items-end gap-1 h-16">
          {[40, 55, 45, 60, 50, 70, 65, 80, 75, 85, 90, 95].map((h, i) => (
            <div
              key={i}
              className="flex-1 bg-primary/30 rounded-t-lg transition-all hover:bg-primary/50"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Jan</span>
          <span>Juin</span>
          <span>Déc</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Trésorerie (Treasury)
function TreasuryWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="col-span-2 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <Landmark className="h-4 w-4 text-primary" />
            Trésorerie
          </CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">876,543 €</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-chart-3" />
              <span className="text-muted-foreground">654,321 €</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Area chart placeholder */}
        <div className="h-24 relative">
          <svg
            viewBox="0 0 200 60"
            className="w-full h-full"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient
                id="treasuryGradient"
                x1="0%"
                y1="0%"
                x2="0%"
                y2="100%"
              >
                <stop offset="0%" stopColor="oklch(0.75 0.15 195 / 0.3)" />
                <stop offset="100%" stopColor="oklch(0.75 0.15 195 / 0)" />
              </linearGradient>
            </defs>
            <path
              d="M0,40 Q25,35 50,30 T100,25 T150,20 T200,15 L200,60 L0,60 Z"
              fill="url(#treasuryGradient)"
            />
            <path
              d="M0,40 Q25,35 50,30 T100,25 T150,20 T200,15"
              fill="none"
              stroke="oklch(0.75 0.15 195)"
              strokeWidth="2"
            />
          </svg>
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Centre</span>
          <span>Mature</span>
          <span>Out</span>
          <span>Usine</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: TVA
function TVAWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="col-span-1 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-16" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-6 w-24 mb-2" />
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground">
            TVA
          </CardTitle>
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
            <div className="h-2 w-2 rounded-full bg-muted" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Collectée</span>
          <span className="text-sm font-medium">123,456 €</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Déductible</span>
          <span className="text-sm font-medium">78,901 €</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">À Décaisser</span>
          <span className="text-sm font-medium text-chart-3">44,555 €</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Planning en Temps Réel
function PlanningWidget({ isLoading }: { isLoading: boolean }) {
  const tasks = [
    { name: "Thierry", status: "done", progress: 100, color: "bg-emerald-500" },
    { name: "David", status: "progress", progress: 75, color: "bg-primary" },
    { name: "Sophie", status: "progress", progress: 50, color: "bg-chart-3" },
    { name: "Marc", status: "pending", progress: 25, color: "bg-amber-500" },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-2 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-primary" />
          Planning en Temps Réel
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tasks.map((task, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-16">
                {task.name}
              </span>
              <div className="flex-1 h-6 bg-muted/30 rounded overflow-hidden">
                <div
                  className={cn("h-full rounded transition-all", task.color)}
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-muted-foreground">
          <span>8h</span>
          <span>12h</span>
          <span>16h</span>
          <span>20h</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Alertes RH (HR Alerts) - Red/Coral themed
function HRAlertWidget({ isLoading }: { isLoading: boolean }) {
  const alerts = [
    { icon: FileText, label: "Congé non traité", count: 2 },
    {
      icon: AlertCircle,
      label: "Validation de note de frais en attente",
      count: 5,
    },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-2 row-span-1 alert-card border-none">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24 bg-white/20" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full bg-white/20" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-2 row-span-1 alert-card border-none text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light flex items-center gap-2 text-white/90">
          <AlertCircle className="h-4 w-4" />
          Alertes RH
        </CardTitle>
        <span className="text-xs text-white/70">Significations</span>
      </CardHeader>
      <CardContent className="space-y-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/15 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <alert.icon className="h-4 w-4 text-white/80" />
              <span className="text-sm">{alert.label}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{alert.count}</span>
              <ChevronRight className="h-4 w-4 text-white/60" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Widget: Connexion Bancaire (Bank Connection)
function BankConnectionWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="col-span-1 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-24" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Landmark className="h-4 w-4 text-primary" />
          Connexion Bancaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full status-connected animate-pulse" />
            <span className="text-sm font-medium text-emerald-400">
              Connecté
            </span>
          </div>
          <Landmark className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <div className="mt-4 h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full w-3/4 bg-emerald-500 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Marge par Site (Margin by Site)
function MarginBySiteWidget({ isLoading }: { isLoading: boolean }) {
  const sites = [
    { name: "Paris", margin: "12%", value: 500000 },
    { name: "Lyon", margin: "10%", value: 350000 },
    { name: "Marseille", margin: "8%", value: 280000 },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-1 row-span-1 glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Marge par Site
          </CardTitle>
          <span className="text-xs text-muted-foreground">Siège</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sites.map((site, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{site.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-16 h-1.5 bg-muted/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${parseInt(site.margin) * 8}%` }}
                />
              </div>
              <span className="text-sm font-medium text-primary">
                {site.margin}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

// Widget: Quick Stats
function QuickStatsWidget({ isLoading }: { isLoading: boolean }) {
  const stats = [
    { label: "Marge Profit", value: "560K €", trend: "up" },
    { label: "Médiane", value: "80K €", trend: "up" },
    { label: "Répartition", value: "920K €", trend: "down" },
  ];

  if (isLoading) {
    return (
      <Card className="col-span-1 row-span-1 glass-card border-border/40">
        <CardContent className="pt-6">
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 row-span-1 glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardContent className="pt-6 space-y-3">
        {stats.map((stat, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-muted/30 flex items-center justify-center">
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3 text-emerald-400" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-chart-3" />
                )}
              </div>
              <span className="text-sm text-muted-foreground">
                {stat.label}
              </span>
            </div>
            <span className="text-sm font-medium">{stat.value}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Tableau de bord
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Vue d&apos;ensemble de vos indicateurs clés
        </p>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Row 1 */}
        <div className="md:col-span-2">
          <RevenueWidget isLoading={isLoading} />
        </div>
        <div className="md:col-span-2">
          <TreasuryWidget isLoading={isLoading} />
        </div>
        <div className="md:col-span-1">
          <TVAWidget isLoading={isLoading} />
        </div>

        {/* Row 2 */}
        <div className="md:col-span-2">
          <PlanningWidget isLoading={isLoading} />
        </div>
        <div className="md:col-span-2">
          <HRAlertWidget isLoading={isLoading} />
        </div>
        <div className="md:col-span-1">
          <BankConnectionWidget isLoading={isLoading} />
        </div>

        {/* Row 3 */}
        <div className="md:col-span-2 lg:col-span-1">
          <MarginBySiteWidget isLoading={isLoading} />
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <QuickStatsWidget isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
