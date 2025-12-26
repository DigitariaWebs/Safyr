"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, TrendingUp, Users, DollarSign } from "lucide-react";
import { mockEmployees } from "@/data/employees";

interface SocialReportData {
  year: number;
  employeeDistribution: {
    total: number;
    byGender: { male: number; female: number };
    byAge: { "18-25": number; "26-35": number; "36-50": number; "50+": number };
    bySeniority: { "0-1": number; "1-3": number; "3-5": number; "5+": number };
  };
  contracts: {
    cdi: number;
    cdd: number;
    apprentices: number;
    cddRenewed: number;
    averageCddDuration: number;
  };
  turnover: {
    entries: number;
    exits: number;
    globalRate: number;
    bySite: Record<string, number>;
    byContractType: Record<string, number>;
  };
  absences: {
    totalDays: number;
    byType: {
      maladie: number;
      accidentTravail: number;
      conges: number;
      autres: number;
    };
    averageDuration: number;
    cost: number;
  };
  payroll: {
    grossTotal: number;
    netTotal: number;
    employerContributions: number;
    employeeContributions: number;
    totalCost: number;
    averageGross: number;
    averageNet: number;
  };
  genderPayGap: {
    averageMaleGross: number;
    averageFemaleGross: number;
    gap: number;
    gapPercentage: number;
  };
  training: {
    totalExpenses: number;
    participants: number;
    hours: number;
  };
  hourlyCost: {
    average: number;
    byCategory: Record<string, number>;
  };
  comparison: {
    previousYear: number;
    evolution: number;
    evolutionPercentage: number;
  };
}

const generateMockReport = (year: number): SocialReportData => {
  const employees = mockEmployees;
  const total = employees.length;
  
  return {
    year,
    employeeDistribution: {
      total,
      byGender: {
        male: Math.floor(total * 0.65),
        female: Math.floor(total * 0.35),
      },
      byAge: {
        "18-25": Math.floor(total * 0.15),
        "26-35": Math.floor(total * 0.40),
        "36-50": Math.floor(total * 0.35),
        "50+": Math.floor(total * 0.10),
      },
      bySeniority: {
        "0-1": Math.floor(total * 0.20),
        "1-3": Math.floor(total * 0.35),
        "3-5": Math.floor(total * 0.25),
        "5+": Math.floor(total * 0.20),
      },
    },
    contracts: {
      cdi: Math.floor(total * 0.70),
      cdd: Math.floor(total * 0.25),
      apprentices: Math.floor(total * 0.05),
      cddRenewed: Math.floor(total * 0.15),
      averageCddDuration: 8.5,
    },
    turnover: {
      entries: 12,
      exits: 8,
      globalRate: 12.5,
      bySite: {
        "Site A": 15.2,
        "Site B": 10.5,
        "Site C": 11.8,
      },
      byContractType: {
        CDI: 5.2,
        CDD: 25.8,
      },
    },
    absences: {
      totalDays: 450,
      byType: {
        maladie: 180,
        accidentTravail: 45,
        conges: 200,
        autres: 25,
      },
      averageDuration: 8.5,
      cost: 125000,
    },
    payroll: {
      grossTotal: 2450000,
      netTotal: 1950000,
      employerContributions: 735000,
      employeeContributions: 245000,
      totalCost: 3185000,
      averageGross: 2450,
      averageNet: 1950,
    },
    genderPayGap: {
      averageMaleGross: 2550,
      averageFemaleGross: 2300,
      gap: 250,
      gapPercentage: 9.8,
    },
    training: {
      totalExpenses: 45000,
      participants: 35,
      hours: 280,
    },
    hourlyCost: {
      average: 18.5,
      byCategory: {
        "Agent": 16.2,
        "Chef de poste": 20.5,
        "Superviseur": 25.8,
      },
    },
    comparison: {
      previousYear: 2300000,
      evolution: 150000,
      evolutionPercentage: 6.5,
    },
  };
};

export default function SocialReportPage() {
  const [selectedYear, setSelectedYear] = useState(2024);
  const [report, setReport] = useState<SocialReportData>(generateMockReport(2024));

  const handleYearChange = (year: string) => {
    const yearNum = parseInt(year);
    setSelectedYear(yearNum);
    setReport(generateMockReport(yearNum));
  };

  const handleExport = () => {
    alert(`Export du bilan social ${selectedYear} en cours...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Bilan Social Automatisé</h1>
          <p className="text-muted-foreground">
            Génération automatique du bilan social à partir des données RH, Paie et Planning
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Exporter (PDF/Excel)
          </Button>
        </div>
      </div>

      {/* Employee Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Répartition des Effectifs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm text-muted-foreground">Total effectif</Label>
              <p className="text-2xl font-bold">{report.employeeDistribution.total}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Hommes</Label>
              <p className="text-2xl font-bold">{report.employeeDistribution.byGender.male}</p>
              <p className="text-xs text-muted-foreground">
                {((report.employeeDistribution.byGender.male / report.employeeDistribution.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Femmes</Label>
              <p className="text-2xl font-bold">{report.employeeDistribution.byGender.female}</p>
              <p className="text-xs text-muted-foreground">
                {((report.employeeDistribution.byGender.female / report.employeeDistribution.total) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Âge moyen</Label>
              <p className="text-2xl font-bold">38 ans</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Par tranche d&apos;âge</Label>
              <div className="space-y-2">
                {Object.entries(report.employeeDistribution.byAge).map(([age, count]) => (
                  <div key={age} className="flex justify-between">
                    <span className="text-sm">{age} ans</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Par ancienneté</Label>
              <div className="space-y-2">
                {Object.entries(report.employeeDistribution.bySeniority).map(([range, count]) => (
                  <div key={range} className="flex justify-between">
                    <span className="text-sm">{range} ans</span>
                    <span className="text-sm font-medium">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Contrats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label className="text-sm text-muted-foreground">CDI</Label>
              <p className="text-2xl font-bold">{report.contracts.cdi}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">CDD</Label>
              <p className="text-2xl font-bold">{report.contracts.cdd}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Apprentis</Label>
              <p className="text-2xl font-bold">{report.contracts.apprentices}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">CDD renouvelés</Label>
              <p className="text-2xl font-bold">{report.contracts.cddRenewed}</p>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-sm text-muted-foreground">Durée moyenne CDD</Label>
            <p className="text-xl font-semibold">{report.contracts.averageCddDuration} mois</p>
          </div>
        </CardContent>
      </Card>

      {/* Turnover */}
      <Card>
        <CardHeader>
          <CardTitle>Turnover</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-muted-foreground">Entrées</Label>
              <p className="text-2xl font-bold text-green-600">{report.turnover.entries}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Sorties</Label>
              <p className="text-2xl font-bold text-red-600">{report.turnover.exits}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Taux global</Label>
              <p className="text-2xl font-bold">{report.turnover.globalRate}%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payroll */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Masse Salariale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm text-muted-foreground">Brut total</Label>
              <p className="text-2xl font-bold">
                {report.payroll.grossTotal.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Net total</Label>
              <p className="text-2xl font-bold">
                {report.payroll.netTotal.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Charges patronales</Label>
              <p className="text-2xl font-bold text-orange-600">
                {report.payroll.employerContributions.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Coût total employeur</Label>
              <p className="text-2xl font-bold text-blue-600">
                {report.payroll.totalCost.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-muted-foreground">Salaire brut moyen</Label>
              <p className="text-xl font-semibold">{report.payroll.averageGross.toLocaleString("fr-FR")} €</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Salaire net moyen</Label>
              <p className="text-xl font-semibold">{report.payroll.averageNet.toLocaleString("fr-FR")} €</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gender Pay Gap */}
      <Card>
        <CardHeader>
          <CardTitle>Écart Salarial H/F</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-muted-foreground">Salaire brut moyen H</Label>
              <p className="text-xl font-semibold">
                {report.genderPayGap.averageMaleGross.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Salaire brut moyen F</Label>
              <p className="text-xl font-semibold">
                {report.genderPayGap.averageFemaleGross.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Écart</Label>
              <p className="text-xl font-semibold text-red-600">
                {report.genderPayGap.gap.toLocaleString("fr-FR")} € ({report.genderPayGap.gapPercentage}%)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Absences */}
      <Card>
        <CardHeader>
          <CardTitle>Absences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label className="text-sm text-muted-foreground">Total jours</Label>
              <p className="text-2xl font-bold">{report.absences.totalDays}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Maladie</Label>
              <p className="text-xl font-semibold">{report.absences.byType.maladie} jours</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Accident travail</Label>
              <p className="text-xl font-semibold">{report.absences.byType.accidentTravail} jours</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Coût total</Label>
              <p className="text-xl font-semibold text-orange-600">
                {report.absences.cost.toLocaleString("fr-FR")} €
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Training */}
      <Card>
        <CardHeader>
          <CardTitle>Formation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-muted-foreground">Dépenses totales</Label>
              <p className="text-2xl font-bold">
                {report.training.totalExpenses.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Participants</Label>
              <p className="text-2xl font-bold">{report.training.participants}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Heures de formation</Label>
              <p className="text-2xl font-bold">{report.training.hours} h</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Cost */}
      <Card>
        <CardHeader>
          <CardTitle>Coût Horaire</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm text-muted-foreground">Coût moyen/heure</Label>
              <p className="text-2xl font-bold">{report.hourlyCost.average.toFixed(2)} €</p>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Par catégorie</Label>
              <div className="space-y-2">
                {Object.entries(report.hourlyCost.byCategory).map(([category, cost]) => (
                  <div key={category} className="flex justify-between">
                    <span className="text-sm">{category}</span>
                    <span className="text-sm font-medium">{cost.toFixed(2)} €</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comparison N vs N-1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Comparaison {selectedYear} vs {selectedYear - 1}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label className="text-sm text-muted-foreground">Année précédente</Label>
              <p className="text-xl font-semibold">
                {report.comparison.previousYear.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Évolution</Label>
              <p className="text-xl font-semibold text-green-600">
                +{report.comparison.evolution.toLocaleString("fr-FR")} €
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Pourcentage</Label>
              <p className="text-xl font-semibold text-green-600">
                +{report.comparison.evolutionPercentage}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

