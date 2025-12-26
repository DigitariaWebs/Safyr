"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Users,
  MapPin,
  Clock,
  CheckCircle,
  Download,
  Shield,
} from "lucide-react";
import { mockLogbookEvents } from "@/data/logbook-events";

export default function StatisticsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  // Calculate KPIs from mock data
  const totalIncidents = mockLogbookEvents.filter((e) => e.type === "incident").length;
  const criticalIncidents = mockLogbookEvents.filter(
    (e) => e.severity === "critical"
  ).length;
  const resolvedIncidents = mockLogbookEvents.filter(
    (e) => e.status === "resolved"
  ).length;
  const resolutionRate = totalIncidents > 0
    ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1)
    : "0";
  const avgResolutionTime = "2.5h";
  const totalVisitors = 1247; // Mock
  const totalRounds = mockLogbookEvents.filter(
    (e) => e.type === "action" && e.title.toLowerCase().includes("ronde")
  ).length;
  const avgRoundInterval = "45 min";
  const mostImpactedZones = ["Parking Niveau 2", "Entrée Principale", "Zone Technique"];
  const agentsInvolved = new Set(mockLogbookEvents.map((e) => e.agentId)).size;
  const hseIncidents = mockLogbookEvents.filter(
    (e) => e.tags?.includes("hse") || e.tags?.includes("sst")
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Dashboard KPI & Statistiques
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Indicateurs clés de performance sécurité, RH et client
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Aujourd&apos;hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      {/* KPI Sécurité */}
      <div>
        <h2 className="text-xl font-light mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          KPI Sécurité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidents / site / période</CardTitle>
              <AlertTriangle className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalIncidents}</div>
              <p className="text-xs text-muted-foreground">Total incidents</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Typologie incidents</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{criticalIncidents}</div>
              <p className="text-xs text-muted-foreground">Critiques</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps détection → résolution</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgResolutionTime}</div>
              <p className="text-xs text-muted-foreground">Moyenne</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taux résolution</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resolutionRate}%</div>
              <p className="text-xs text-muted-foreground">Incidents résolus</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Nombre de visiteurs</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalVisitors}</div>
              <p className="text-xs text-muted-foreground">Total période</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rondes effectuées</CardTitle>
              <MapPin className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRounds}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Temps moyen entre rondes</CardTitle>
              <Clock className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRoundInterval}</div>
              <p className="text-xs text-muted-foreground">Intervalle moyen</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Zones impactées</CardTitle>
              <MapPin className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mostImpactedZones.length}</div>
              <p className="text-xs text-muted-foreground">Zones critiques</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI RH */}
      <div>
        <h2 className="text-xl font-light mb-4 flex items-center gap-2">
          <Users className="h-5 w-5" />
          KPI RH
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agents impliqués</CardTitle>
              <Users className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agentsInvolved}</div>
              <p className="text-xs text-muted-foreground">Dans incidents</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Incidents HSE / SST</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hseIncidents}</div>
              <p className="text-xs text-muted-foreground">Total</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Historique par agent</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Disponible</div>
              <p className="text-xs text-muted-foreground">Consultation</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Indicateurs qualité</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">Performance</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* KPI Client */}
      <div>
        <h2 className="text-xl font-light mb-4 flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          KPI Client
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Performance sécurité</CardTitle>
              <Shield className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92%</div>
              <p className="text-xs text-muted-foreground">Taux de conformité</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qualité service</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8/5</div>
              <p className="text-xs text-muted-foreground">Satisfaction</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Analyse pics incidents</CardTitle>
              <BarChart3 className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14h-18h</div>
              <p className="text-xs text-muted-foreground">Période critique</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-border/40">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Comparaison N/N-1</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">-15%</div>
              <p className="text-xs text-muted-foreground">Réduction incidents</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zones Impactées */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Zones les plus impactées
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mostImpactedZones.map((zone, index) => (
              <div
                key={zone}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{index + 1}</Badge>
                  <span className="font-medium">{zone}</span>
                </div>
                <Badge variant="secondary">12 incidents</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparaison Critiques vs Mineurs */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Incidents critiques vs incidents mineurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Critiques</Label>
              <div className="text-3xl font-bold text-red-500">{criticalIncidents}</div>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Mineurs</Label>
              <div className="text-3xl font-bold text-green-500">
                {totalIncidents - criticalIncidents}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

