"use client";

import { useState, useEffect } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  FileText,
  UserCheck,
  Award,
  Briefcase,
  ChevronRight,
  Target,
  DollarSign,
  Scale,
  BarChart3,
  Activity,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

function EmployeeStatsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Effectif Total
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">247</span>
            <span className="ml-2 text-sm text-muted-foreground">salariés</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">CDI</p>
              <p className="text-xl font-light">189</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">CDD</p>
              <p className="text-xl font-light">58</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">+12 ce mois</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AbsenceWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-orange-500" />
          Taux d&apos;Absentéisme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">3.2%</span>
            <span className="ml-2 text-sm text-muted-foreground">ce mois</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Objectif: 2.5%</span>
              <span className="text-orange-500">+0.7%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Congés</p>
              <p className="text-lg font-light">24</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Maladie</p>
              <p className="text-lg font-light">8</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TurnoverWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-48 mb-4" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-blue-500" />
          Turnover
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">8.5%</span>
            <span className="ml-2 text-sm text-muted-foreground">annuel</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Entrées</p>
              <p className="text-lg font-light text-emerald-400">+18</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Sorties</p>
              <p className="text-lg font-light text-red-400">-12</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-emerald-500" />
          Conformité CNAPS
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">98.2%</span>
            <span className="ml-2 text-sm text-muted-foreground">conforme</span>
          </div>
          <div className="space-y-2">
            <Progress value={98.2} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">À jour</p>
              <p className="text-lg font-light text-emerald-400">243</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">À renouveler</p>
              <p className="text-lg font-light text-orange-400">4</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TrainingWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const trainings = [
    { type: "SSIAP", valid: 198, expiring: 12, expired: 3 },
    { type: "SST", valid: 187, expiring: 18, expired: 5 },
    { type: "H0B0", valid: 156, expiring: 8, expired: 2 },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <Award className="h-4 w-4 text-primary" />
            Formations & Habilitations
          </CardTitle>
          <Link
            href="/dashboard/hr/training/ssiap"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Voir tout
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trainings.map((training) => (
            <div key={training.type} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{training.type}</span>
                <span className="text-xs text-muted-foreground">
                  {training.valid + training.expiring + training.expired} total
                </span>
              </div>
              <div className="flex gap-1 h-2">
                <div
                  className="bg-emerald-500 rounded-l-lg"
                  style={{
                    width: `${(training.valid / (training.valid + training.expiring + training.expired)) * 100}%`,
                  }}
                />
                <div
                  className="bg-orange-500"
                  style={{
                    width: `${(training.expiring / (training.valid + training.expiring + training.expired)) * 100}%`,
                  }}
                />
                <div
                  className="bg-red-500 rounded-r-lg"
                  style={{
                    width: `${(training.expired / (training.valid + training.expiring + training.expired)) * 100}%`,
                  }}
                />
              </div>
              <div className="flex gap-3 text-xs">
                <span className="text-emerald-400">
                  {training.valid} à jour
                </span>
                <span className="text-orange-400">
                  {training.expiring} expirant
                </span>
                <span className="text-red-400">{training.expired} expirés</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlertsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const alerts = [
    {
      type: "critical",
      icon: AlertTriangle,
      label: "Documents expirés",
      count: 8,
      color: "text-red-500",
    },
    {
      type: "warning",
      icon: Clock,
      label: "Expirations < 30j",
      count: 24,
      color: "text-orange-500",
    },
    {
      type: "info",
      icon: FileText,
      label: "Contrats à renouveler",
      count: 6,
      color: "text-blue-500",
    },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            Alertes RH
          </CardTitle>
          <Link
            href="/dashboard/hr/notifications/hr"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Voir tout
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.type}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={cn("h-4 w-4", alert.color)} />
                  <span className="text-sm">{alert.label}</span>
                </div>
                <span className={cn("text-lg font-light", alert.color)}>
                  {alert.count}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function PendingRequestsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const requests = [
    { type: "Congés", count: 12, color: "text-blue-500" },
    { type: "Absences", count: 5, color: "text-orange-500" },
    { type: "CSE", count: 3, color: "text-purple-500" },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Demandes en attente
          </CardTitle>
          <Link
            href="/dashboard/hr/time-management"
            className="text-xs text-primary hover:underline flex items-center gap-1"
          >
            Traiter
            <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.type}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm">{request.type}</span>
              <span className={cn("text-lg font-light", request.color)}>
                {request.count}
              </span>
            </div>
          ))}
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total</span>
              <span className="text-xl font-light text-primary">20</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PayrollWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Masse Salariale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">687K€</span>
            <span className="ml-2 text-sm text-muted-foreground">ce mois</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">+3.2%</span>
            <span className="text-muted-foreground">vs mois dernier</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Coût/heure moy.</p>
              <p className="text-lg font-light">18.50€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Budget annuel</p>
              <p className="text-lg font-light">8.2M€</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DelegationHoursWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Heures de délégation CSE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">156h</span>
            <span className="ml-2 text-sm text-muted-foreground">
              utilisées
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Allouées</p>
              <p className="text-lg font-light">200h</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Restantes</p>
              <p className="text-lg font-light text-emerald-400">44h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">78% utilisé</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CostPerEmployeeWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          Coût par employé
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">2,850€</span>
            <span className="ml-2 text-sm text-muted-foreground">
              moy./mois
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-red-400" />
            <span className="text-red-400">+4.2%</span>
            <span className="text-muted-foreground">vs mois dernier</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Salaire brut</p>
              <p className="text-lg font-light">2,150€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Charges</p>
              <p className="text-lg font-light">700€</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmployerChargesWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-purple-500" />
          Charges patronales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">28.5%</span>
            <span className="ml-2 text-sm text-muted-foreground">
              du salaire brut
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-orange-400" />
            <span className="text-orange-400">+0.3%</span>
            <span className="text-muted-foreground">vs année dernière</span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Total mensuel</p>
              <p className="text-lg font-light">81K€</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Par employé</p>
              <p className="text-lg font-light">700€</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function GenderEqualityWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Scale className="h-4 w-4 text-pink-500" />
          Index égalité H/F
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">87/100</span>
            <span className="ml-2 text-sm text-muted-foreground">points</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Objectif: 85/100</span>
              <span className="text-emerald-400">+2 points</span>
            </div>
            <Progress value={87} className="h-2" />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Femmes</p>
              <p className="text-lg font-light">42%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Écart salarial</p>
              <p className="text-lg font-light text-emerald-400">2.1%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function HRForecastWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-indigo-500" />
          Prévisions RH
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">+8</span>
            <span className="ml-2 text-sm text-muted-foreground">
              embauches prévues
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Départs prévus</p>
              <p className="text-lg font-light text-red-400">-3</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Croissance</p>
              <p className="text-lg font-light text-emerald-400">+2.7%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400">Budget formation: 45K€</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SalaryMaintenanceWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-orange-500" />
          Maintien salaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">12</span>
            <span className="ml-2 text-sm text-muted-foreground">
              cas actifs
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Maladie</p>
              <p className="text-lg font-light">8</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">AT/MP</p>
              <p className="text-lg font-light">4</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-red-400" />
            <span className="text-red-400">Coût: 28K€/mois</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RecruitmentKPIsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <UserPlus className="h-4 w-4 text-teal-500" />
          KPIs Recrutement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <span className="text-4xl font-light tracking-tight">78%</span>
            <span className="ml-2 text-sm text-muted-foreground">
              taux de succès
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Délai moyen</p>
              <p className="text-lg font-light">24 jours</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Coût/embauche</p>
              <p className="text-lg font-light">3,200€</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-emerald-400" />
            <span className="text-emerald-400">+5% vs trimestre dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const actions = [
    {
      label: "Nouveau salarié",
      href: "/dashboard/hr/employees",
      icon: UserCheck,
    },
    {
      label: "Voir congés",
      href: "/dashboard/hr/time-management/leaves",
      icon: Calendar,
    },
    {
      label: "Exports paie",
      href: "/dashboard/hr/payroll/exports",
      icon: FileText,
    },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">
          Actions rapides
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                href={action.href}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-primary/10 hover:border-primary/30 border border-transparent transition-all group"
              >
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm flex-1">{action.label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export default function HRDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Tableau de bord RH
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Vue d&apos;ensemble des indicateurs clés RH
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <EmployeeStatsWidget isLoading={isLoading} />
        <AbsenceWidget isLoading={isLoading} />
        <TurnoverWidget isLoading={isLoading} />
        <ComplianceWidget isLoading={isLoading} />

        <DelegationHoursWidget isLoading={isLoading} />
        <CostPerEmployeeWidget isLoading={isLoading} />
        <EmployerChargesWidget isLoading={isLoading} />
        <GenderEqualityWidget isLoading={isLoading} />

        <div className="md:col-span-2">
          <TrainingWidget isLoading={isLoading} />
        </div>
        <AlertsWidget isLoading={isLoading} />
        <PendingRequestsWidget isLoading={isLoading} />

        <HRForecastWidget isLoading={isLoading} />
        <SalaryMaintenanceWidget isLoading={isLoading} />
        <RecruitmentKPIsWidget isLoading={isLoading} />
        <PayrollWidget isLoading={isLoading} />

        <QuickActionsWidget isLoading={isLoading} />
      </div>
    </div>
  );
}
