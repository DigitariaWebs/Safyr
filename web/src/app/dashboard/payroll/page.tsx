"use client";

import { useState, useEffect, useReducer, useRef } from "react";
import {
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Briefcase,
  Calendar,
  Clock,
  PieChart,
  BarChart3,
  Activity,
  Settings,
  ChevronUp,
  ChevronDown,
  GripVertical,
  UserCheck,
  UserX,
  Wallet,
  Target,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from "recharts";

// Widget: Gender Distribution
function GenderDistributionWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Hommes", value: 187, color: "#3b82f6" },
    { name: "Femmes", value: 60, color: "#ec4899" },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Répartition H/F
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={140}>
              <RechartsPie>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={60}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          <div className="flex-1 space-y-3">
            {data.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {((item.value / total) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Demographics (Age & Seniority)
function DemographicsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Données Démographiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Âge moyen</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light">38.2</span>
                <span className="text-sm text-muted-foreground">ans</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                Ancienneté moyenne
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light">5.8</span>
                <span className="text-sm text-muted-foreground">ans</span>
              </div>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">&lt; 30 ans</span>
              <span>42 (17%)</span>
            </div>
            <Progress value={17} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">30-50 ans</span>
              <span>158 (64%)</span>
            </div>
            <Progress value={64} className="h-2" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">&gt; 50 ans</span>
              <span>47 (19%)</span>
            </div>
            <Progress value={19} className="h-2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Contract Types
function ContractTypesWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "CDI", value: 189, color: "#10b981" },
    { name: "CDD", value: 58, color: "#f59e0b" },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-primary" />
          Répartition CDI/CDD
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {data.map((item) => (
              <div key={item.name} className="space-y-2">
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-light">{item.value}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.name}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {((item.value / 247) * 100).toFixed(1)}% de l&apos;effectif
                </p>
              </div>
            ))}
          </div>
          <Separator />
          <div className="text-xs text-muted-foreground">
            <span className="font-medium">247</span> salariés au total
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Availability
function AvailabilityWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const available = 218;
  const unavailable = 29;
  const total = available + unavailable;
  const availablePercent = (available / total) * 100;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-primary" />
          Disponibilité
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-light">
                {availablePercent.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">disponibles</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-emerald-500">
                {available}
              </p>
              <p className="text-xs text-muted-foreground">effectif actif</p>
            </div>
          </div>
          <Progress value={availablePercent} className="h-3" />
          <div className="grid grid-cols-2 gap-3 pt-2 border-t">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              <div>
                <p className="text-xs text-muted-foreground">Disponibles</p>
                <p className="text-sm font-medium">{available}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <UserX className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Absents</p>
                <p className="text-sm font-medium">{unavailable}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Payroll Mass
function PayrollMassWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Salaires de base", value: 385200 },
    { name: "Heures supp.", value: 42800 },
    { name: "Primes", value: 28500 },
    { name: "Indemnités", value: 15200 },
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary" />
          Masse Salariale
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-light">
              {(total / 1000).toFixed(1)}k €
            </p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>
          <Separator />
          <div className="space-y-2">
            {data.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center"
              >
                <span className="text-xs text-muted-foreground">
                  {item.name}
                </span>
                <span className="text-sm font-medium">
                  {(item.value / 1000).toFixed(1)}k €
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t flex items-center gap-2 text-xs text-emerald-500">
            <TrendingUp className="h-3 w-3" />
            <span>+3.2% vs mois dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Employer Costs
function EmployerCostsWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const grossPayroll = 471700;
  const employerCharges = 189080; // ~40%
  const total = grossPayroll + employerCharges;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Wallet className="h-4 w-4 text-primary" />
          Coût Global Employeur
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-light">
              {(total / 1000).toFixed(1)}k €
            </p>
            <p className="text-xs text-muted-foreground">
              Charges patronales incluses
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                Masse salariale brute
              </span>
              <span className="font-medium">
                {(grossPayroll / 1000).toFixed(1)}k €
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Charges patronales</span>
              <span className="font-medium text-orange-500">
                {(employerCharges / 1000).toFixed(1)}k €
              </span>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ratio charges/brut</span>
              <span className="font-medium">
                {((employerCharges / grossPayroll) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Charges Breakdown
function ChargesBreakdownWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { name: "Patronales", value: 189080, color: "#f97316" },
    { name: "Salariales", value: 94340, color: "#3b82f6" },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <PieChart className="h-4 w-4 text-primary" />
          Charges Patronales / Salariales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="name" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              formatter={(
                value: number | string | (string | number)[] | undefined,
              ) => {
                const numValue = typeof value === "number" ? value : 0;
                return `${(numValue / 1000).toFixed(1)}k €`;
              }}
            />
            <Bar dataKey="value" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="pt-2 border-t text-xs text-muted-foreground">
          Total charges: {((189080 + 94340) / 1000).toFixed(1)}k €
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Cost per Hour/Site
function CostPerHourWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          Coût de Revient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Par heure</p>
              <p className="text-2xl font-light">23.50 €</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Par site (moy.)</p>
              <p className="text-2xl font-light">8.2k €</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs font-medium">Top 3 sites (coût mensuel)</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Centre Commercial A
                </span>
                <span className="font-medium">42.5k €</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">
                  Plateforme Logistique B
                </span>
                <span className="font-medium">38.2k €</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Site Industriel C</span>
                <span className="font-medium">31.8k €</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Year Comparison
function YearComparisonWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-48 w-full" />
        </CardContent>
      </Card>
    );
  }

  const data = [
    { month: "Jan", n: 445, n1: 432 },
    { month: "Fév", n: 448, n1: 428 },
    { month: "Mar", n: 452, n1: 435 },
    { month: "Avr", n: 458, n1: 441 },
    { month: "Mai", n: 465, n1: 438 },
    { month: "Juin", n: 472, n1: 445 },
  ];

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-primary" />
          Comparaison N / N-1
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--background))",
                border: "1px solid hsl(var(--border))",
              }}
              formatter={(
                value: number | string | (string | number)[] | undefined,
              ) => `${value || 0}k €`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="n"
              stroke="#10b981"
              name="2024"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="n1"
              stroke="#6b7280"
              name="2023"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="pt-2 border-t flex items-center gap-2 text-xs text-emerald-500">
          <TrendingUp className="h-3 w-3" />
          <span>+5.2% d&apos;évolution annuelle</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Turnover
function TurnoverWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const departures = 8;
  const averageHeadcount = 245;
  const turnoverRate = (departures / averageHeadcount) * 100;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <TrendingDown className="h-4 w-4 text-primary" />
          Turnover
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-light">{turnoverRate.toFixed(1)}%</p>
            <p className="text-xs text-muted-foreground">
              {departures} départs ce mois
            </p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Démissions</span>
              <span>5</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Fins de CDD</span>
              <span>2</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Licenciements</span>
              <span>1</span>
            </div>
          </div>
          <div className="pt-2 border-t flex items-center gap-2 text-xs">
            <div
              className={cn(
                "flex items-center gap-1",
                turnoverRate < 5 ? "text-emerald-500" : "text-orange-500",
              )}
            >
              {turnoverRate < 5 ? (
                <TrendingDown className="h-3 w-3" />
              ) : (
                <TrendingUp className="h-3 w-3" />
              )}
              <span>
                {turnoverRate < 5 ? "Faible" : "Modéré"} (objectif: &lt;5%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Absence Rate
function AbsenceRateWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const absenceRate = 4.2;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Taux d&apos;Absence
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-light">{absenceRate}%</p>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </div>
          <Progress value={absenceRate * 2} className="h-3" />
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Arrêts maladie</span>
              <span>18 (2.8%)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Accidents du travail
              </span>
              <span>6 (1.1%)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Autres absences</span>
              <span>2 (0.3%)</span>
            </div>
          </div>
          <div className="pt-2 border-t flex items-center gap-2 text-xs text-emerald-500">
            <TrendingDown className="h-3 w-3" />
            <span>-0.8% vs mois dernier</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: Average Absence Duration
function AbsenceDurationWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          Durée Moyenne des Arrêts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-3xl font-light">12.4</p>
            <p className="text-xs text-muted-foreground">jours en moyenne</p>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Arrêts courts (&lt;7j)
              </span>
              <span>8 arrêts</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Arrêts moyens (7-30j)
              </span>
              <span>12 arrêts</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">
                Arrêts longs (&gt;30j)
              </span>
              <span>6 arrêts</span>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Arrêts en cours</span>
              <span className="font-medium">26</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget: IJSS / Maintenance
function IJSSMaintenanceWidget({ isLoading }: { isLoading: boolean }) {
  if (isLoading) {
    return (
      <Card className="glass-card border-border/40 h-full">
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const ijssReceived = 8450;
  const maintenancePaid = 12300;
  const netCost = maintenancePaid - ijssReceived;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <AlertCircle className="h-4 w-4 text-primary" />
          IJSS / Maintiens de Salaire
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">IJSS perçues</p>
              <p className="text-xl font-light text-emerald-500">
                {(ijssReceived / 1000).toFixed(1)}k €
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Maintiens versés</p>
              <p className="text-xl font-light text-orange-500">
                {(maintenancePaid / 1000).toFixed(1)}k €
              </p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Coût net</span>
              <span className="text-sm font-medium text-red-500">
                {(netCost / 1000).toFixed(1)}k €
              </span>
            </div>
            <Progress
              value={(ijssReceived / maintenancePaid) * 100}
              className="h-2"
            />
            <p className="text-xs text-muted-foreground">
              Taux de couverture IJSS:{" "}
              {((ijssReceived / maintenancePaid) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Widget Configuration Types
type WidgetConfig = {
  id: string;
  name: string;
  component: React.ComponentType<{ isLoading: boolean }>;
  visible: boolean;
  span?: number;
};

type SavedWidgetConfig = Pick<WidgetConfig, "id" | "name" | "visible" | "span">;

// Sortable Widget Component
function SortableWidget({
  id,
  config,
  isLoading,
}: {
  id: string;
  config: WidgetConfig;
  isLoading: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const Component = config.component;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        config.span === 2 && "col-span-2",
        config.span === 3 && "col-span-3",
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <div className="bg-background/90 backdrop-blur-sm border rounded-md p-1">
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <Component isLoading={isLoading} />
    </div>
  );
}

// Default Widget Configurations
const defaultWidgetConfigs: WidgetConfig[] = [
  {
    id: "gender-distribution",
    name: "Répartition H/F",
    component: GenderDistributionWidget,
    visible: true,
  },
  {
    id: "demographics",
    name: "Données Démographiques",
    component: DemographicsWidget,
    visible: true,
  },
  {
    id: "contract-types",
    name: "Répartition CDI/CDD",
    component: ContractTypesWidget,
    visible: true,
  },
  {
    id: "availability",
    name: "Disponibilité",
    component: AvailabilityWidget,
    visible: true,
  },
  {
    id: "payroll-mass",
    name: "Masse Salariale",
    component: PayrollMassWidget,
    visible: true,
  },
  {
    id: "employer-costs",
    name: "Coût Global Employeur",
    component: EmployerCostsWidget,
    visible: true,
  },
  {
    id: "charges-breakdown",
    name: "Charges Patronales/Salariales",
    component: ChargesBreakdownWidget,
    visible: true,
    span: 2,
  },
  {
    id: "cost-per-hour",
    name: "Coût de Revient",
    component: CostPerHourWidget,
    visible: true,
  },
  {
    id: "year-comparison",
    name: "Comparaison N/N-1",
    component: YearComparisonWidget,
    visible: true,
    span: 2,
  },
  {
    id: "turnover",
    name: "Turnover",
    component: TurnoverWidget,
    visible: true,
  },
  {
    id: "absence-rate",
    name: "Taux d'Absence",
    component: AbsenceRateWidget,
    visible: true,
  },
  {
    id: "absence-duration",
    name: "Durée Moyenne des Arrêts",
    component: AbsenceDurationWidget,
    visible: true,
  },
  {
    id: "ijss-maintenance",
    name: "IJSS/Maintiens",
    component: IJSSMaintenanceWidget,
    visible: true,
  },
];

type WidgetAction =
  | { type: "load"; payload: WidgetConfig[] }
  | { type: "toggle"; payload: string }
  | { type: "reorder"; payload: { oldIndex: number; newIndex: number } }
  | { type: "move"; payload: { activeId: string; overId: string } };

function widgetReducer(
  state: WidgetConfig[],
  action: WidgetAction,
): WidgetConfig[] {
  switch (action.type) {
    case "load":
      return action.payload;
    case "toggle":
      return state.map((config: WidgetConfig) =>
        config.id === action.payload
          ? { ...config, visible: !config.visible }
          : config,
      );
    case "reorder":
      return arrayMove(state, action.payload.oldIndex, action.payload.newIndex);
    case "move":
      const { activeId, overId } = action.payload;
      const activeIndex = state.findIndex(
        (c: WidgetConfig) => c.id === activeId,
      );
      const overIndex = state.findIndex((c: WidgetConfig) => c.id === overId);
      return arrayMove(state, activeIndex, overIndex);
    default:
      return state;
  }
}

export default function PayrollDashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [widgetConfigs, dispatch] = useReducer(
    widgetReducer,
    defaultWidgetConfigs,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const hasLoadedRef = useRef(false);

  const gridSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) {
      const saved = localStorage.getItem("payroll-dashboard-config");
      if (saved) {
        try {
          const savedConfigs: SavedWidgetConfig[] = JSON.parse(saved);
          let loadedConfigs = savedConfigs
            .map((saved: SavedWidgetConfig) => {
              const defaultConfig = defaultWidgetConfigs.find(
                (d: WidgetConfig) => d.id === saved.id,
              );
              return defaultConfig ? { ...defaultConfig, ...saved } : null;
            })
            .filter(Boolean) as WidgetConfig[];
          const missingDefaults = defaultWidgetConfigs.filter(
            (defaultConfig: WidgetConfig) =>
              savedConfigs.every(
                (saved: SavedWidgetConfig) => saved.id !== defaultConfig.id,
              ),
          );
          loadedConfigs = [...loadedConfigs, ...missingDefaults];
          dispatch({ type: "load", payload: loadedConfigs });
        } catch (e) {
          console.error("Error loading dashboard config:", e);
        }
      }
      hasLoadedRef.current = true;
    }
  }, []);

  useEffect(() => {
    const toSave: SavedWidgetConfig[] = widgetConfigs.map((config) => ({
      id: config.id,
      name: config.name,
      visible: config.visible,
      span: config.span,
    }));
    localStorage.setItem("payroll-dashboard-config", JSON.stringify(toSave));
  }, [widgetConfigs]);

  const toggleVisibility = (id: string) => {
    dispatch({ type: "toggle", payload: id });
  };

  const moveUp = (index: number) => {
    if (index > 0) {
      dispatch({
        type: "reorder",
        payload: { oldIndex: index, newIndex: index - 1 },
      });
    }
  };

  const moveDown = (index: number) => {
    if (index < widgetConfigs.length - 1) {
      dispatch({
        type: "reorder",
        payload: { oldIndex: index, newIndex: index + 1 },
      });
    }
  };

  function handleGridDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeId = String(active.id);
      const overId = String(over.id);

      const activeConfig = widgetConfigs.find((c) => c.id === activeId);
      const overConfig = widgetConfigs.find((c) => c.id === overId);

      if (!activeConfig || !overConfig) return;

      const isActiveVisible = activeConfig.visible;
      const isOverVisible = overConfig.visible;

      if (isActiveVisible && isOverVisible) {
        dispatch({ type: "move", payload: { activeId, overId } });
      } else if (!isActiveVisible && !isOverVisible) {
        dispatch({ type: "move", payload: { activeId, overId } });
      } else {
        dispatch({ type: "move", payload: { activeId, overId } });
      }
    }
  }

  const visibleWidgets = widgetConfigs.filter((c) => c.visible);
  const hiddenWidgets = widgetConfigs.filter((c) => !c.visible);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Paie</h1>
          <p className="text-muted-foreground">
            KPI et indicateurs de performance
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsDialogOpen(true)}
        >
          <Settings className="h-4 w-4 mr-2" />
          Configurer
        </Button>
      </div>

      <DndContext
        sensors={gridSensors}
        collisionDetection={closestCenter}
        onDragEnd={handleGridDragEnd}
      >
        <SortableContext
          items={visibleWidgets.map((w) => w.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {visibleWidgets.map((config) => (
              <SortableWidget
                key={config.id}
                id={config.id}
                config={config}
                isLoading={isLoading}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <Modal
        type="form"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title="Configuration du tableau de bord"
        description="Sélectionnez les widgets à afficher et organisez-les selon vos préférences."
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium mb-3">Widgets visibles</h3>
            <div className="space-y-2">
              {visibleWidgets.map((config, index) => (
                <div
                  key={config.id}
                  className="flex items-center gap-2 p-2 rounded-md border bg-card"
                >
                  <Checkbox
                    checked={config.visible}
                    onCheckedChange={() => toggleVisibility(config.id)}
                  />
                  <span className="flex-1 text-sm">{config.name}</span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                    >
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveDown(index)}
                      disabled={index === visibleWidgets.length - 1}
                    >
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {hiddenWidgets.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-medium mb-3">Widgets masqués</h3>
                <div className="space-y-2">
                  {hiddenWidgets.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center gap-2 p-2 rounded-md border bg-muted/30"
                    >
                      <Checkbox
                        checked={config.visible}
                        onCheckedChange={() => toggleVisibility(config.id)}
                      />
                      <span className="flex-1 text-sm text-muted-foreground">
                        {config.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={() => setIsDialogOpen(false)}>Fermer</Button>
        </div>
      </Modal>
    </div>
  );
}
