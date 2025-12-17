"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Users,
  Clock,
  FileText,
  Calculator,
  Download,
  Plus,
} from "lucide-react";
import type { PayrollStats, PayrollAnomaly } from "@/lib/types";

// Mock data - in real app this would come from API
const mockPayrollStats: PayrollStats = {
  totalVariables: 45,
  pendingValidations: 8,
  anomaliesCount: 3,
  totalPersonnelCost: 125000,
  averageCostPerEmployee: 3125,
  currency: "EUR",
  lastExportDate: new Date("2024-12-15"),
  nextPayrollDate: new Date("2024-12-31"),
};

const mockAnomalies: PayrollAnomaly[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    type: "missing_hours",
    description: "Heures travaillées manquantes pour décembre 2024",
    severity: "high",
    period: "2024-12",
    status: "open",
    createdAt: new Date("2024-12-20"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    type: "contribution_error",
    description: "Erreur dans le calcul des cotisations sociales",
    severity: "medium",
    period: "2024-12",
    status: "investigating",
    createdAt: new Date("2024-12-19"),
    updatedAt: new Date("2024-12-20"),
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Pierre Durand",
    type: "incorrect_rate",
    description: "Taux horaire incorrect appliqué",
    severity: "critical",
    period: "2024-12",
    status: "open",
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-18"),
  },
];

function PayrollOverviewWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Coût total du personnel
        </CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {mockPayrollStats.totalPersonnelCost.toLocaleString("fr-FR")} €
        </div>
        <p className="text-xs text-muted-foreground">
          <TrendingUp className="inline h-3 w-3 text-green-600 mr-1" />
          +2.5% par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

function AverageCostWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Coût moyen par salarié
        </CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {mockPayrollStats.averageCostPerEmployee.toLocaleString("fr-FR")} €
        </div>
        <p className="text-xs text-muted-foreground">
          <TrendingDown className="inline h-3 w-3 text-green-600 mr-1" />
          -0.8% par rapport au mois dernier
        </p>
      </CardContent>
    </Card>
  );
}

function PendingValidationsWidget() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Validations en attente
        </CardTitle>
        <Clock className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {mockPayrollStats.pendingValidations}
        </div>
        <p className="text-xs text-muted-foreground">
          Variables de paie à valider
        </p>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hr/payroll/variables">
              Voir les validations
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function AnomaliesWidget() {
  const criticalCount = mockAnomalies.filter(
    (a) => a.severity === "critical",
  ).length;
  const highCount = mockAnomalies.filter((a) => a.severity === "high").length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Anomalies de paie</CardTitle>
        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-red-600">
          {mockPayrollStats.anomaliesCount}
        </div>
        <p className="text-xs text-muted-foreground">
          {criticalCount} critique{criticalCount !== 1 ? "s" : ""}, {highCount}{" "}
          élevé{highCount !== 1 ? "s" : ""}
        </p>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hr/payroll/control">Voir les anomalies</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function RecentAnomaliesWidget() {
  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg">Anomalies récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockAnomalies.slice(0, 3).map((anomaly) => (
            <div
              key={anomaly.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    anomaly.severity === "critical"
                      ? "bg-red-500"
                      : anomaly.severity === "high"
                        ? "bg-orange-500"
                        : anomaly.severity === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                  }`}
                />
                <div>
                  <p className="font-medium text-sm">{anomaly.employeeName}</p>
                  <p className="text-xs text-muted-foreground">
                    {anomaly.description}
                  </p>
                </div>
              </div>
              <Badge
                variant={
                  anomaly.severity === "critical"
                    ? "destructive"
                    : anomaly.severity === "high"
                      ? "default"
                      : "secondary"
                }
              >
                {anomaly.severity === "critical"
                  ? "Critique"
                  : anomaly.severity === "high"
                    ? "Élevé"
                    : anomaly.severity === "medium"
                      ? "Moyen"
                      : "Faible"}
              </Badge>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hr/payroll/control">
              Voir toutes les anomalies
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function QuickActionsWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Actions rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start gap-2" asChild>
          <Link href="/dashboard/hr/payroll/variables">
            <Plus className="h-4 w-4" />
            Ajouter une variable de paie
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/dashboard/hr/payroll/exports">
            <Download className="h-4 w-4" />
            Exporter la paie
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/dashboard/hr/payroll/cost-per-hour">
            <Calculator className="h-4 w-4" />
            Analyser les coûts
          </Link>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href="/dashboard/hr/payroll/control">
            <CheckCircle className="h-4 w-4" />
            Contrôler la paie
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function NextPayrollWidget() {
  const daysUntilPayroll = Math.ceil(
    (mockPayrollStats.nextPayrollDate!.getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24),
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Prochaine paie</CardTitle>
        <FileText className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {daysUntilPayroll} jour{daysUntilPayroll !== 1 ? "s" : ""}
        </div>
        <p className="text-xs text-muted-foreground">
          {mockPayrollStats.nextPayrollDate?.toLocaleDateString("fr-FR")}
        </p>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/hr/payroll/exports">
              Préparer l&apos;export
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function PayrollPage() {
  // Simulate loading (removed unused isLoading state)
  useEffect(() => {
    // Loading simulation if needed in future
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Paie & Analyses
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Préparation et contrôle de la paie, analyses des coûts salariaux
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <PayrollOverviewWidget />
        <AverageCostWidget />
        <PendingValidationsWidget />
        <AnomaliesWidget />

        <div className="md:col-span-2">
          <RecentAnomaliesWidget />
        </div>
        <QuickActionsWidget />
        <NextPayrollWidget />
      </div>
    </div>
  );
}
