"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Download, TrendingDown } from "lucide-react";

interface SalaryMaintenance {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "Maladie" | "Accident de travail" | "Maternité/Paternité";
  startDate: string;
  endDate?: string;
  days: number;
  grossSalary: number;
  ijss: number; // Social Security daily allowance
  employerMaintenance: number;
  totalPaid: number;
  maintenanceRate: number; // %
  status: "En cours" | "Terminé";
}

const mockMaintenanceData: SalaryMaintenance[] = [
  {
    id: "1",
    employeeId: "emp1",
    employeeName: "Jean Dupont",
    type: "Maladie",
    startDate: "2024-12-01",
    endDate: "2024-12-15",
    days: 15,
    grossSalary: 2400.00,
    ijss: 42.50,
    employerMaintenance: 37.50,
    totalPaid: 1200.00,
    maintenanceRate: 90,
    status: "Terminé",
  },
  {
    id: "2",
    employeeId: "emp2",
    employeeName: "Marie Martin",
    type: "Accident de travail",
    startDate: "2024-11-20",
    endDate: "2024-12-20",
    days: 31,
    grossSalary: 2600.00,
    ijss: 52.00,
    employerMaintenance: 34.67,
    totalPaid: 2686.77,
    maintenanceRate: 100,
    status: "En cours",
  },
  {
    id: "3",
    employeeId: "emp3",
    employeeName: "Sophie Bernard",
    type: "Maternité/Paternité",
    startDate: "2024-10-01",
    endDate: "2024-12-15",
    days: 76,
    grossSalary: 2800.00,
    ijss: 89.00,
    employerMaintenance: 4.67,
    totalPaid: 7116.92,
    maintenanceRate: 100,
    status: "Terminé",
  },
];

export default function SalaryMaintenanceAnalysisPage() {
  const [maintenances] = useState<SalaryMaintenance[]>(mockMaintenanceData);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMaintenance, setSelectedMaintenance] = useState<SalaryMaintenance | null>(null);

  const totalIJSS = maintenances.reduce((sum, m) => sum + (m.ijss * m.days), 0);
  const totalEmployerMaintenance = maintenances.reduce((sum, m) => sum + (m.employerMaintenance * m.days), 0);
  const totalPaid = maintenances.reduce((sum, m) => sum + m.totalPaid, 0);

  const columns: ColumnDef<SalaryMaintenance>[] = [
    {
      key: "employeeName",
      label: "Employé",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      render: (maintenance) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          "Maladie": "secondary",
          "Accident de travail": "outline",
          "Maternité/Paternité": "default",
        };
        return <Badge variant={variants[maintenance.type] || "outline"}>{maintenance.type}</Badge>;
      },
    },
    {
      key: "startDate",
      label: "Début",
      render: (maintenance) =>
        new Date(maintenance.startDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "endDate",
      label: "Fin",
      render: (maintenance) =>
        maintenance.endDate
          ? new Date(maintenance.endDate).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "days",
      label: "Jours",
      render: (maintenance) => <span className="font-medium">{maintenance.days}j</span>,
    },
    {
      key: "ijss",
      label: "IJSS/jour",
      render: (maintenance) => (
        <span className="text-sm">{maintenance.ijss.toFixed(2)} €</span>
      ),
    },
    {
      key: "employerMaintenance",
      label: "Maintien/jour",
      render: (maintenance) => (
        <span className="text-sm font-semibold text-orange-600">
          {maintenance.employerMaintenance.toFixed(2)} €
        </span>
      ),
    },
    {
      key: "totalPaid",
      label: "Total payé",
      render: (maintenance) => (
        <span className="font-semibold">{maintenance.totalPaid.toLocaleString("fr-FR")} €</span>
      ),
    },
    {
      key: "maintenanceRate",
      label: "Taux",
      render: (maintenance) => (
        <Badge variant="outline">{maintenance.maintenanceRate}%</Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (maintenance) => (
        <Badge variant={maintenance.status === "En cours" ? "default" : "secondary"}>
          {maintenance.status}
        </Badge>
      ),
    },
  ];

  const handleRowClick = (maintenance: SalaryMaintenance) => {
    setSelectedMaintenance(maintenance);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    alert("Export des analyses de maintien de salaire en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analyses de Maintien de Salaire</h1>
          <p className="text-muted-foreground">
            Suivi des IJSS, calculs de maintien (maladie, AT, maternité…)
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total IJSS reçues</CardTitle>
            <TrendingDown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalIJSS.toLocaleString("fr-FR")} €
            </div>
            <p className="text-xs text-muted-foreground">
              Remboursées par la Sécurité Sociale
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Maintien employeur
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totalEmployerMaintenance.toLocaleString("fr-FR")} €
            </div>
            <p className="text-xs text-muted-foreground">
              À charge de l&apos;entreprise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total versé</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalPaid.toLocaleString("fr-FR")} €
            </div>
            <p className="text-xs text-muted-foreground">
              Somme totale payée aux employés
            </p>
          </CardContent>
        </Card>
      </div>

      <DataTable
        data={maintenances}
        columns={columns}
        searchKey="employeeName"
        searchPlaceholder="Rechercher un employé..."
        onRowClick={handleRowClick}
      />

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails du maintien de salaire"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedMaintenance && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employé</Label>
                <p className="text-sm font-medium">{selectedMaintenance.employeeName}</p>
              </div>
              <div>
                <Label>Type d&apos;absence</Label>
                <Badge variant="secondary">{selectedMaintenance.type}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Date de début</Label>
                <p className="text-sm font-medium">
                  {new Date(selectedMaintenance.startDate).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <Label>Date de fin</Label>
                <p className="text-sm font-medium">
                  {selectedMaintenance.endDate
                    ? new Date(selectedMaintenance.endDate).toLocaleDateString("fr-FR")
                    : "En cours"}
                </p>
              </div>
            </div>

            <div>
              <Label>Nombre de jours</Label>
              <p className="text-sm font-medium">{selectedMaintenance.days} jours</p>
            </div>

            <div className="pt-4 border-t">
              <Label className="text-base font-semibold">Calculs</Label>
              <div className="space-y-3 mt-3">
                <div className="flex justify-between">
                  <span className="text-sm">Salaire journalier de référence:</span>
                  <span className="text-sm font-medium">
                    {(selectedMaintenance.grossSalary / 21.67).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">IJSS par jour:</span>
                  <span className="text-sm font-medium text-green-600">
                    {selectedMaintenance.ijss.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maintien employeur par jour:</span>
                  <span className="text-sm font-medium text-orange-600">
                    {selectedMaintenance.employerMaintenance.toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-sm font-semibold">Total IJSS reçues:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {(selectedMaintenance.ijss * selectedMaintenance.days).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold">
                    Total maintien employeur:
                  </span>
                  <span className="text-sm font-semibold text-orange-600">
                    {(selectedMaintenance.employerMaintenance * selectedMaintenance.days).toFixed(2)} €
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="text-base font-bold">Total versé à l&apos;employé:</span>
                  <span className="text-base font-bold text-blue-600">
                    {selectedMaintenance.totalPaid.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <Label>Taux de maintien</Label>
              <p className="text-2xl font-bold">{selectedMaintenance.maintenanceRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                Selon la convention collective et l&apos;ancienneté
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

