"use client";

import { memo } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
  ClipboardCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { LogbookEvent } from "@/data/logbook-events";
import { mockLogbookEvents } from "@/data/logbook-events";
import { mockAlerts } from "@/data/logbook-alerts";

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
  const criticalIncidents = events.filter((e) => e.severity === "critical").length;
  const resolvedIncidents = events.filter((e) => e.status === "resolved").length;
  const resolutionRate = totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : "0";

  const totalRounds = events.filter((e) => e.type === "action" && e.title.toLowerCase().includes("ronde")).length;
  const agentsInvolved = new Set(events.map((e) => e.agentId)).size;
  const hseIncidents = events.filter((e) => e.tags?.includes("hse") || e.tags?.includes("sst")).length;

  const zoneData = events.reduce((acc, e) => {
    const zone = e.zone || e.site || "Inconnu";
    acc[zone] = (acc[zone] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topZones = Object.entries(zoneData).sort((a, b) => b[1] - a[1]).slice(0, 5) as [string, number][];

  const dayBuckets: Record<string, number> = {};
  for (const e of events) {
    const d = new Date(e.timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    dayBuckets[d] = (dayBuckets[d] || 0) + 1;
  }
  const trendData = Object.entries(dayBuckets)
    .sort((a, b) => {
      const [da, ma] = a[0].split("/").map(Number);
      const [db, mb] = b[0].split("/").map(Number);
      return ma !== mb ? ma - mb : da - db;
    })
    .map(([date, count]) => ({ date, evenements: count }));

  const severityCounts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0 };
  for (const e of events) {
    if (e.severity in severityCounts) severityCounts[e.severity] += 1;
  }
  const pieData = Object.entries(severityCounts)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({ name: SEVERITY_LABELS[k] ?? k, value: v, color: SEVERITY_COLORS[k] ?? "#94a3b8" }));

  const typeCounts: Record<string, number> = { routine: 0, incident: 0, action: 0, control: 0, critical: 0 };
  for (const e of events) {
    if (e.type in typeCounts) typeCounts[e.type] += 1;
  }
  const typeData = Object.entries(typeCounts).filter(([, v]) => v > 0).map(([k, v]) => ({ type: TYPE_LABELS[k] ?? k, count: v }));

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

export const SecurityIncidentsWidget = memo(function SecurityIncidentsWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;

  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-500" />
          Incidents / période
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">{analytics.totalIncidents} événements</Badge>
          <Badge className="text-xs" style={{ background: SEVERITY_COLORS.critical, color: "white" }}>{analytics.criticalIncidents} critiques</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics.trendData.map((entry) => ({ period: entry.date, incidents: entry.evenements }))} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="incidents" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const CriticalEventsWidget = memo(function CriticalEventsWidget({ isLoading }: KpiWidgetProps) {
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
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.trendData.map((entry) => ({ date: entry.date, value: entry.evenements }))} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Line type="monotone" name="Incidents" dataKey="value" stroke="#ef4444" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const ResolutionRateWidget = memo(function ResolutionRateWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          Taux de résolution
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">{analytics.resolutionRate}% résolus</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: "Résolus", value: analytics.resolvedIncidents, color: "#22c55e" }, { name: "Restants", value: Math.max(analytics.totalIncidents - analytics.resolvedIncidents, 0), color: "#334155" }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={84} paddingAngle={3}>
                <Cell fill="#22c55e" />
                <Cell fill="#334155" />
              </Pie>
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const PatrolRoundsWidget = memo(function PatrolRoundsWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-blue-500" />
          Rondes effectuées
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">{analytics.totalRounds} rondes</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics.trendData.map((entry) => ({ date: entry.date, rondes: Math.max(1, Math.round(entry.evenements / 2)) }))} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Line type="monotone" name="Rondes" dataKey="rondes" stroke="#38bdf8" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const RHImpactWidget = memo(function RHImpactWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          KPI RH
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">{analytics.agentsInvolved} agents</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ label: "Agents impliqués", value: analytics.agentsInvolved, color: "#22d3ee" }, { label: "Incidents HSE/SST", value: analytics.hseIncidents, color: "#f97316" }]} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="value" name="Valeur" radius={[6, 6, 0, 0]}>
                <Cell fill="#22d3ee" />
                <Cell fill="#f97316" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const ClientPerformanceWidget = memo(function ClientPerformanceWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          KPI Client
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">Performance {92}%</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[{ label: "Performance sécurité", value: 92, color: "#22c55e" }, { label: "Satisfaction", value: 96, color: "#22d3ee" }]} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="value" name="Valeur" radius={[6, 6, 0, 0]}>
                <Cell fill="#22c55e" />
                <Cell fill="#22d3ee" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const TrendChartWidget = memo(function TrendChartWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2 flex items-center justify-between">
        <CardTitle className="text-sm font-light text-muted-foreground">Tendance des événements</CardTitle>
        <div className="flex items-center gap-2">
          <Badge className="text-xs">{analytics.trendData.reduce((s, d) => s + d.evenements, 0)} événements</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {analytics.trendData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Aucun événement</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={analytics.trendData} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(value) => [value, "Événements"]} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Area type="monotone" name="Événements" dataKey="evenements" stroke="#22d3ee" strokeWidth={2} fill="url(#trendFill)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

export const SeverityDistributionWidget = memo(function SeverityDistributionWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">Répartition par gravité</CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.pieData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Aucun événement</div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={analytics.pieData} cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3} dataKey="value">
                  {analytics.pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(value, name) => [value, name]} />
                <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 justify-center mt-2">
              {analytics.pieData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: entry.color }} />
                  <span className="text-muted-foreground">{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
});

export const EventTypesWidget = memo(function EventTypesWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground">Types d'événements</CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.typeData.length === 0 ? (
          <div className="h-[220px] flex items-center justify-center text-sm text-muted-foreground">Aucun événement</div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.typeData} layout="vertical" margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="type" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...DARK_TOOLTIP_STYLE} formatter={(value) => [value, "Événements"]} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="count" name="Événements" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

export const TopZonesWidget = memo(function TopZonesWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />Zones impactées</CardTitle>
      </CardHeader>
      <CardContent>
        {analytics.topZones.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune zone</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.topZones.map(([zone, count]) => ({ zone, count }))} layout="vertical" margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="zone" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Bar dataKey="count" fill="#22d3ee" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
});

export const CriticalSplitWidget = memo(function CriticalSplitWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2"><TrendingUp className="h-4 w-4 text-primary" />Critiques vs mineurs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ name: "Critiques", value: analytics.criticalIncidents, color: "#ef4444" }, { name: "Mineurs", value: Math.max(analytics.totalIncidents - analytics.criticalIncidents, 0), color: "#22c55e" }]} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={54} outerRadius={84} paddingAngle={3}>
                <Cell fill="#ef4444" />
                <Cell fill="#22c55e" />
              </Pie>
              <Tooltip {...DARK_TOOLTIP_STYLE} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

// --- New widgets requested: incidents bar, alerts trend line, status pie
export const IncidentsByPeriodWidget = memo(function IncidentsByPeriodWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  const data = analytics.trendData.map((d) => ({ period: d.date, incidents: d.evenements }));
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-orange-500" />Incidents par période</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="period" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Bar dataKey="incidents" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const AlertsTrendWidget = memo(function AlertsTrendWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  const buckets: Record<string, number> = {};
  for (const a of mockAlerts) {
    const d = new Date(a.timestamp).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" });
    buckets[d] = (buckets[d] || 0) + 1;
  }
  const data = Object.entries(buckets).sort().map(([date, count]) => ({ date, alerts: count }));
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2"><BarChart3 className="h-4 w-4 text-primary" />Alertes (tendance)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
              <Line type="monotone" dataKey="alerts" stroke="#22d3ee" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});

export const StatusDistributionWidget = memo(function StatusDistributionWidget({ isLoading }: KpiWidgetProps) {
  if (isLoading) return <SmallSkeletonCard />;
  const statusCounts: Record<string, number> = {};
  for (const e of mockLogbookEvents) statusCounts[e.status] = (statusCounts[e.status] || 0) + 1;
  const data = Object.entries(statusCounts).map(([k, v]) => ({ name: k, value: v }));
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light text-muted-foreground flex items-center gap-2"><ClipboardCheck className="h-4 w-4 text-primary" />Répartition statuts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[220px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={48} outerRadius={72} paddingAngle={3}>
                {data.map((entry, idx) => (
                  <Cell key={idx} fill={idx === 0 ? "#f59e0b" : idx === 1 ? "#22d3ee" : "#22c55e"} />
                ))}
              </Pie>
              <Tooltip {...DARK_TOOLTIP_STYLE} />
              <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12, color: "#94a3b8" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
});
