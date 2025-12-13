"use client";

import { useState, useEffect } from "react";
import {
  Users,
  User,
  BarChart3,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for stats
const mockStats = [
  {
    id: "employees",
    title: "Effectif Total",
    value: "247",
    change: "+12 ce mois",
    trend: "up" as const,
    icon: Users,
  },
  {
    id: "certifications",
    title: "Cartes Pro à renouveler",
    value: "8",
    change: "sous 30 jours",
    trend: "down" as const,
    icon: User,
  },
  {
    id: "training",
    title: "Formations en cours",
    value: "15",
    change: "+3 cette semaine",
    trend: "up" as const,
    icon: BarChart3,
  },
  {
    id: "hours",
    title: "Heures travaillées",
    value: "12,450",
    change: "ce mois",
    trend: "up" as const,
    icon: DollarSign,
  },
];

type Stat = (typeof mockStats)[number];

interface StatCardProps {
  stat: Stat;
  isLoading?: boolean;
}

function StatCard({ stat, isLoading }: StatCardProps) {
  const Icon = stat.icon;
  const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border/40 bg-card p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-8 rounded-lg" />
        </div>
        <div className="mt-4">
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="mt-2 flex items-center gap-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border/40 bg-card p-6 transition-all duration-200 hover:border-border/80 hover:shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-light text-muted-foreground">
          {stat.title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </div>
      <div className="mt-4">
        <span className="text-3xl font-light tracking-tight">{stat.value}</span>
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div
          className={cn(
            "flex items-center gap-1 text-sm font-light",
            stat.trend === "up" ? "text-emerald-600" : "text-red-500",
          )}
        >
          <TrendIcon className="h-3 w-3" />
          <span>{stat.change}</span>
        </div>
        <span className="text-sm font-light text-muted-foreground">
          vs last month
        </span>
      </div>
    </div>
  );
}

interface StatCardsProps {
  stats: Stat[];
  isLoading: boolean;
  error: Error | null;
  onRetry: () => void;
}

function StatCards({ stats, isLoading, error, onRetry }: StatCardsProps) {
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-8 text-center">
        <p className="text-sm font-light text-destructive">
          Failed to load statistics
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-4 gap-2"
        >
          <RefreshCw className="h-3 w-3" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {(isLoading ? Array(4).fill(null) : stats).map((stat, index) => (
        <StatCard
          key={stat?.id || index}
          stat={stat || mockStats[index]}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);

  const fetchStats = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate occasional error for demo purposes
      // Uncomment to test error state:
      // if (Math.random() > 0.7) throw new Error("Network error")

      setStats(mockStats);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Tableau de bord RH
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Bienvenue ! Voici un aperçu des indicateurs clés de votre entreprise
          de sécurité.
        </p>
      </div>

      {/* Stats Grid */}
      <StatCards
        stats={stats}
        isLoading={isLoading}
        error={error}
        onRetry={fetchStats}
      />

      {/* Placeholder for additional content */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <h2 className="font-serif text-lg font-light">Alertes urgentes</h2>
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="font-light">
                8 cartes CNAPS expirent sous 30j
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-orange-500"></div>
              <span className="font-light">12 SSIAP à recycler</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              <span className="font-light">
                5 visites médicales à planifier
              </span>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-border/40 bg-card p-6">
          <h2 className="font-serif text-lg font-light">Actions rapides</h2>
          <div className="mt-4 space-y-2">
            <button className="w-full rounded-lg border border-border/40 p-3 text-left text-sm font-light transition-colors hover:bg-accent">
              + Nouveau salarié
            </button>
            <button className="w-full rounded-lg border border-border/40 p-3 text-left text-sm font-light transition-colors hover:bg-accent">
              Préparer la paie
            </button>
            <button className="w-full rounded-lg border border-border/40 p-3 text-left text-sm font-light transition-colors hover:bg-accent">
              Export registres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
