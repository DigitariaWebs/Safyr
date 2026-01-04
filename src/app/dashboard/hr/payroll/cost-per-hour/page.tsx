"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Euro, Users, Calculator, Download, Filter } from "lucide-react";
import type { PersonnelCost } from "@/lib/types";

// Mock data
const mockPersonnelCosts: PersonnelCost[] = [
  {
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    period: "2024-12",
    grossSalary: 3500,
    netSalary: 2800,
    taxableNet: 2750,
    employeeContributions: 450,
    employerContributions: 875,
    totalEmployerCost: 4375,
    currency: "EUR",
    workedHours: 160,
    costPerHour: 27.34,
    allowances: 150,
    bonuses: 500,
    maintenance: 0,
    totalCost: 4375,
  },
  {
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    period: "2024-12",
    grossSalary: 3200,
    netSalary: 2580,
    taxableNet: 2520,
    employeeContributions: 410,
    employerContributions: 798,
    totalEmployerCost: 3998,
    currency: "EUR",
    workedHours: 155,
    costPerHour: 25.79,
    allowances: 120,
    bonuses: 0,
    maintenance: 200,
    totalCost: 4198,
  },
  {
    employeeId: "EMP003",
    employeeName: "Pierre Durand",
    period: "2024-12",
    grossSalary: 2800,
    netSalary: 2250,
    taxableNet: 2200,
    employeeContributions: 360,
    employerContributions: 700,
    totalEmployerCost: 3500,
    currency: "EUR",
    workedHours: 160,
    costPerHour: 21.88,
    allowances: 80,
    bonuses: 300,
    maintenance: 0,
    totalCost: 3500,
  },
];

const departmentBreakdown = {
  Sécurité: { count: 25, totalCost: 125000, avgCostPerHour: 25.5 },
  Direction: { count: 5, totalCost: 35000, avgCostPerHour: 35.2 },
  RH: { count: 3, totalCost: 18000, avgCostPerHour: 28.75 },
  Commercial: { count: 8, totalCost: 42000, avgCostPerHour: 22.3 },
};

export default function PersonnelCostPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-12");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const filteredCosts = mockPersonnelCosts.filter((cost) => {
    if (selectedDepartment !== "all") {
      // In real app, would filter by department
      return true;
    }
    return cost.period === selectedPeriod;
  });

  const totalCosts = {
    grossPayroll: filteredCosts.reduce(
      (sum, cost) => sum + cost.grossSalary,
      0,
    ),
    netPayroll: filteredCosts.reduce((sum, cost) => sum + cost.netSalary, 0),
    employerContributions: filteredCosts.reduce(
      (sum, cost) => sum + cost.employerContributions,
      0,
    ),
    totalEmployerCost: filteredCosts.reduce(
      (sum, cost) => sum + cost.totalEmployerCost,
      0,
    ),
    avgCostPerHour:
      filteredCosts.reduce((sum, cost) => sum + cost.costPerHour, 0) /
      filteredCosts.length,
  };

  const columns: ColumnDef<PersonnelCost>[] = [
    {
      key: "employee",
      label: "Employé",
      icon: Users,
      sortable: true,
      sortValue: (cost) => cost.employeeName,
      render: (cost) => (
        <div>
          <div className="font-medium">{cost.employeeName}</div>
          <div className="text-sm text-muted-foreground">{cost.employeeId}</div>
        </div>
      ),
    },
    {
      key: "grossSalary",
      label: "Salaire brut",
      icon: Euro,
      sortable: true,
      render: (cost) => (
        <span className="font-medium">
          {cost.grossSalary.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      key: "netSalary",
      label: "Salaire net",
      sortable: true,
      render: (cost) => <span>{cost.netSalary.toLocaleString("fr-FR")} €</span>,
    },
    {
      key: "employerContributions",
      label: "Charges patronales",
      sortable: true,
      render: (cost) => (
        <span>{cost.employerContributions.toLocaleString("fr-FR")} €</span>
      ),
    },
    {
      key: "totalEmployerCost",
      label: "Coût total employeur",
      sortable: true,
      render: (cost) => (
        <span className="font-semibold text-primary">
          {cost.totalEmployerCost.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      key: "workedHours",
      label: "Heures travaillées",
      sortable: true,
      render: (cost) => <span>{cost.workedHours}h</span>,
    },
    {
      key: "costPerHour",
      label: "Coût/heure",
      icon: Calculator,
      sortable: true,
      sortValue: (cost) => cost.costPerHour,
      render: (cost) => (
        <Badge variant="outline" className="font-mono">
          {cost.costPerHour.toFixed(2)} €/h
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Analyse des coûts salariaux
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Coûts par employé, charges sociales et analyse par heure travaillée
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filtres</span>
            </div>
            <div className="flex gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Période</Label>
                <Select
                  value={selectedPeriod}
                  onValueChange={setSelectedPeriod}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2024-12">Décembre 2024</SelectItem>
                    <SelectItem value="2024-11">Novembre 2024</SelectItem>
                    <SelectItem value="2024-10">Octobre 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Département</Label>
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous</SelectItem>
                    <SelectItem value="Sécurité">Sécurité</SelectItem>
                    <SelectItem value="Direction">Direction</SelectItem>
                    <SelectItem value="RH">RH</SelectItem>
                    <SelectItem value="Commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Euro}
          title="Masse salariale brute"
          value={`${totalCosts.grossPayroll.toLocaleString("fr-FR")} €`}
          subtext="+3.2% vs mois dernier"
          color="green"
        />

        <InfoCard
          icon={Euro}
          title="Masse salariale nette"
          value={`${totalCosts.netPayroll.toLocaleString("fr-FR")} €`}
          subtext="80.2% de la masse brute"
          color="blue"
        />

        <InfoCard
          icon={Euro}
          title="Charges patronales"
          value={`${totalCosts.employerContributions.toLocaleString("fr-FR")} €`}
          subtext="25.1% de la masse brute"
          color="orange"
        />

        <InfoCard
          icon={Euro}
          title="Coût total employeur"
          value={`${totalCosts.totalEmployerCost.toLocaleString("fr-FR")} €`}
          subtext="+2.8% vs mois dernier"
          color="purple"
        />

        <InfoCard
          icon={Calculator}
          title="Coût moyen / heure"
          value={`${totalCosts.avgCostPerHour.toFixed(2)} €`}
          subtext="Par heure travaillée"
          color="gray"
        />
      </InfoCardContainer>

      {/* Department Breakdown */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Répartition par département
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(departmentBreakdown).map(([dept, data]) => (
                <div key={dept} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{dept}</div>
                    <div className="text-sm text-muted-foreground">
                      {data.count} employé{data.count !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      {data.totalCost.toLocaleString("fr-FR")} €
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {data.avgCostPerHour.toFixed(2)} €/h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Top 5 coûts les plus élevés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredCosts
                .sort((a, b) => b.totalEmployerCost - a.totalEmployerCost)
                .slice(0, 5)
                .map((cost) => (
                  <div
                    key={cost.employeeId}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <div className="font-medium">{cost.employeeName}</div>
                      <div className="text-sm text-muted-foreground">
                        {cost.employeeId}
                      </div>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {cost.costPerHour.toFixed(2)} €/h
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Détail par employé</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredCosts}
            columns={columns}
            searchKeys={["employeeName", "employeeId"]}
            getSearchValue={(cost) => `${cost.employeeName} ${cost.employeeId}`}
            searchPlaceholder="Rechercher par nom ou numéro d'employé..."
            getRowId={(cost) => cost.employeeId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
