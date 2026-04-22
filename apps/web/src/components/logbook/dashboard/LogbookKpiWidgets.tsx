"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  MapPin,
  Shield,
  TrendingUp,
  Users,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogbookEvent } from "@/data/logbook-events";
import { mockLogbookEvents } from "@/data/logbook-events";

interface KpiWidgetProps {
  isLoading: boolean;
}

type AnalyticsData = {
  totalIncidents: number;
  criticalIncidents: number;
  resolvedIncidents: number;
  resolutionRate: string;
  avgResolutionTime: string;
  totalRounds: number;
  avgRoundInterval: string;
  agentsInvolved: number;
  hseIncidents: number;
  topZones: [string, number][];
  trendData: { date: string; evenements: number }[];
  pieData: { name: string; value: number; color: string }[];
  typeData: { type: string; count: number }[];
};

const DARK_TOOLTIP_STYLE = {
  contentStyle: {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#f1f5f9",
    fontSize: 12,
  },
  labelStyle: { color: "#94a3b8" },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22d3ee",
};

const SEVERITY_LABELS: Record<string, string> = {
  critical: "Critique",
  high: "Haute",
  medium: "Moyenne",
  low: "Faible",
};

const TYPE_LABELS: Record<string, string> = {
  routine: "Routine",
  incident: "Incident",
  action: "Action",
  control: "Contrôle",
  critical: "Critique",
};

function computeAnalytics(events: LogbookEvent[]): AnalyticsData {
  const totalIncidents = events.filter((e) => e.type === "incident").length;
  const criticalIncidents = events.filter(
    (e) => e.severity === "critical",
  ).length;
  const resolvedIncidents = events.filter(
    (e) => e.status === "resolved",
  ).length;
  const resolutionRate =
    totalIncidents > 0
      ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1)
      : "0";

  const totalRounds = events.filter(
    (e) => e.type === "action" && e.title.toLowerCase().includes("ronde"),
  ).length;
  const agentsInvolved = new Set(events.map((e) => e.agentId)).size;
  const hseIncidents = events.filter(
    (e) => e.tags?.includes("hse") || e.tags?.includes("sst"),
  ).length;

  const zoneData = events.reduce(
    (acc, e) => {
      const zone = e.zone || e.site;
      acc[zone] = (acc[zone] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topZones = Object.entries(zoneData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const dayBuckets: Record<string, number> = {};
  for (const e of events) {
    const d = new Date(e.timestamp).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
    });
    dayBuckets[d] = (dayBuckets[d] || 0) + 1;
  }
  const trendData = Object.entries(dayBuckets)
    .sort((a, b) => {
      const [da, ma] = a[0].split("/").map(Number);
      const [db, mb] = b[0].split("/").map(Number);
      return ma !== mb ? ma - mb : da - db;
    })
    .map(([date, count]) => ({ date, evenements: count }));

  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };
  for (const e of events) {
    if (e.severity in severityCounts) {
      severityCounts[e.severity] += 1;
    }
  }
  const pieData = Object.entries(severityCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: SEVERITY_LABELS[k] ?? k,
      value: v,
      color: SEVERITY_COLORS[k] ?? "#94a3b8",
    }));

  const typeCounts: Record<string, number> = {
    routine: 0,
    incident: 0,
    action: 0,
    control: 0,
    critical: 0,
  };
  for (const e of events) {
    if (e.type in typeCounts) {
      typeCounts[e.type] += 1;
    }
  }
  const typeData = Object.entries(typeCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ type: TYPE_LABELS[k] ?? k, count: v }));

  return {
    totalIncidents,
    criticalIncidents,
    resolvedIncidents,
    resolutionRate,
    avgResolutionTime: "2.5h",
    totalRounds,
    avgRoundInterval: "45 min",
    agentsInvolved,
    hseIncidents,
    topZones,
    trendData,
    pieData,
    typeData,
  };
}

const analytics = computeAnalytics(mockLogbookEvents);

function SmallSkeletonCard() {
  return (
    <Card className="glass-card border-border/40 h-full">
      <CardHeader className="pb-2">
        <Skeleton className="h-4 w-28" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-12 w-full" />
      </CardContent>
    </Card>
  );
}

export function SecurityIncidentsWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Incidents / période
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-light tracking-tight">
          {analytics.totalIncidents}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Total incidents</p>
      </CardContent>
    </Card>
  );
}

export function CriticalEventsWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <BarChart3 className="h-4 w-4 text-red-500" />
          Incidents critiques
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-light tracking-tight">
          {analytics.criticalIncidents}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Priorité haute</p>
      </CardContent>
    </Card>
  );
}

export function ResolutionRateWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          Taux de résolution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-light tracking-tight">
          {analytics.resolutionRate}%
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {analytics.resolvedIncidents} incidents résolus
        </p>
      </CardContent>
    </Card>
  );
}

export function PatrolRoundsWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Rondes effectuées
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-light tracking-tight">
          {analytics.totalRounds}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          Intervalle moyen: {analytics.avgRoundInterval}
        </p>
      </CardContent>
    </Card>
  );
}

export function RHImpactWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          KPI RH
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Agents impliqués</span>
          <span className="font-light text-lg">{analytics.agentsInvolved}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Incidents HSE/SST</span>
          <span className="font-light text-lg">{analytics.hseIncidents}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function ClientPerformanceWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          KPI Client
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Performance sécurité</span>
          <span className="font-light text-lg">92%</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Satisfaction</span>
          <span className="font-light text-lg">4.8/5</span>
        </div>
      </CardContent>
    </Card>
  );
}

export function TrendChartWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">
          Tendance des événements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.trendData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            Aucun événement
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart
              data={analytics.trendData}
              margin={{ top: 4, right: 8, bottom: 0, left: -20 }}
            >
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                {...DARK_TOOLTIP_STYLE}
                formatter={(value) => [value, "Événements"]}
              />
              <Area
                type="monotone"
                dataKey="evenements"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#trendFill)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function SeverityDistributionWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">
          Répartition par gravité
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.pieData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            Aucun événement
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={analytics.pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={72}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {analytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  {...DARK_TOOLTIP_STYLE}
                  formatter={(value, name) => [value, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {analytics.pieData.map((entry) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-1 text-xs"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: entry.color }}
                  />
                  <span className="text-muted-foreground">
                    {entry.name} ({entry.value})
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function EventTypesWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">
          Types d&apos;événements
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.typeData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">
            Aucun événement
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart
              data={analytics.typeData}
              layout="vertical"
              margin={{ top: 4, right: 8, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#334155"
                horizontal={false}
              />
              <XAxis
                type="number"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <YAxis
                type="category"
                dataKey="type"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip
                {...DARK_TOOLTIP_STYLE}
                formatter={(value) => [value, "Événements"]}
              />
              <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function TopZonesWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <MapPin className="h-4 w-4 text-primary" />
          Zones impactées
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.topZones.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune zone</p>
        ) : (
          <div className="space-y-2">
            {analytics.topZones.map(([zone, count], index) => (
              <div
                key={zone}
                className="flex items-center justify-between p-2 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="text-sm font-medium truncate max-w-[150px]">
                    {zone}
                  </span>
                </div>
                <Badge variant="secondary">{count}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function CriticalSplitWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Critiques vs mineurs
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground">Critiques</p>
            <p className="text-3xl font-light text-red-500">
              {analytics.criticalIncidents}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Mineurs</p>
            <p className="text-3xl font-light text-emerald-500">
              {analytics.totalIncidents - analytics.criticalIncidents}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          Temps moyen de résolution: {analytics.avgResolutionTime}
        </p>
      </CardContent>
    </Card>
  );
}
