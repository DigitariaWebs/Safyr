"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import { Sanction, SanctionsRegister } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";

interface SanctionRow {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  type: string;
  reason: string;
  description: string;
  issuedBy: string;
  severity: "minor" | "major" | "severe";
}

// Mock employees for selection
const mockEmployees = [
  { id: "1", name: "Marie Dupont" },
  { id: "2", name: "Jean Martin" },
  { id: "3", name: "Sophie Leroy" },
  { id: "4", name: "Pierre Durand" },
];

// Mock data - replace with API call
const mockSanctionsRegisters: SanctionsRegister[] = [
  {
    id: "1",
    employeeId: "1",
    sanctions: [
      {
        id: "1",
        employeeId: "1",
        date: new Date("2024-01-15"),
        type: "Avertissement",
        reason: "Retard répété",
        description: "Plusieurs retards non justifiés cette semaine",
        issuedBy: "Alice Dubois",
        severity: "minor",
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
    ],
    totalWarnings: 1,
    totalSuspensions: 0,
    lastUpdated: new Date("2024-01-15"),
  },
  {
    id: "2",
    employeeId: "2",
    sanctions: [
      {
        id: "2",
        employeeId: "2",
        date: new Date("2024-01-10"),
        type: "Suspension",
        reason: "Comportement inapproprié",
        description: "Incident avec un collègue",
        issuedBy: "Alice Dubois",
        severity: "major",
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
      {
        id: "3",
        employeeId: "2",
        date: new Date("2024-01-01"),
        type: "Avertissement",
        reason: "Violation des règles",
        description: "Non-respect des protocoles",
        issuedBy: "Alice Dubois",
        severity: "minor",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ],
    totalWarnings: 1,
    totalSuspensions: 1,
    lastUpdated: new Date("2024-01-10"),
  },
];

const severityLabels = {
  minor: "Mineure",
  major: "Majeure",
  severe: "Grave",
};

const severityColors = {
  minor: "secondary",
  major: "default",
  severe: "destructive",
} as const;

export default function SanctionsRegisterPage() {
  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    return employee ? employee.name : "Employé inconnu";
  };

  // Flatten sanctions data, excluding suspensions
  const sanctionRows: SanctionRow[] = mockSanctionsRegisters
    .flatMap((register) =>
      register.sanctions
        .filter((sanction: Sanction) => sanction.type !== "Suspension")
        .map((sanction: Sanction) => ({
          ...sanction,
          employeeId: sanction.employeeId,
          employeeName: getEmployeeName(sanction.employeeId),
        })),
    )
    .sort((a, b) => b.date.getTime() - a.date.getTime());

  const handleExportSinglePDF = (row: SanctionRow) => {
    const doc = new jsPDF();
    doc.text("Sanction", 20, 20);
    doc.text(
      "Note: Ceci est un exemple de PDF et non l'implémentation finale.",
      20,
      30,
    );
    doc.text(`Employé: ${row.employeeName}`, 20, 50);
    doc.text(`Date: ${row.date.toLocaleDateString("fr-FR")}`, 20, 60);
    doc.text(`Type: ${row.type}`, 20, 70);
    doc.text(`Raison: ${row.reason}`, 20, 80);
    doc.text(`Description: ${row.description}`, 20, 90);
    doc.text(`Émis par: ${row.issuedBy}`, 20, 100);
    doc.text(`Sévérité: ${severityLabels[row.severity]}`, 20, 110);
    doc.save(`sanction-${row.id}.pdf`);
  };

  const columns: ColumnDef<SanctionRow>[] = [
    {
      key: "employeeName",
      label: "Employé",
      render: (row: SanctionRow) => (
        <div className="font-medium">
          <Link
            href={`/dashboard/hr/employees/${row.employeeId}`}
            className="text-primary hover:underline"
          >
            {row.employeeName}
          </Link>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (row: SanctionRow) => row.date.toLocaleDateString("fr-FR"),
    },
    {
      key: "type",
      label: "Type",
      render: (row: SanctionRow) => row.type,
    },
    {
      key: "reason",
      label: "Raison",
      render: (row: SanctionRow) => row.reason,
    },
    {
      key: "description",
      label: "Description",
      render: (row: SanctionRow) => (
        <div className="max-w-xs truncate" title={row.description}>
          {row.description}
        </div>
      ),
    },
    {
      key: "issuedBy",
      label: "Émis par",
      render: (row: SanctionRow) => row.issuedBy,
    },
    {
      key: "severity",
      label: "Sévérité",
      render: (row: SanctionRow) => (
        <Badge variant={severityColors[row.severity]}>
          {severityLabels[row.severity]}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: SanctionRow) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleExportSinglePDF(row)}
          className="gap-2"
        >
          <Download className="h-4 w-4" />
          Exporter PDF
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Registre des sanctions
        </h1>
        <p className="text-muted-foreground">
          Historique des sanctions par employé
        </p>
      </div>

      {/* Sanctions Register Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registre des sanctions ({sanctionRows.length} sanctions)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sanctionRows}
            columns={columns}
            searchKeys={["employeeName", "type", "reason"]}
            searchPlaceholder="Rechercher une sanction..."
          />
        </CardContent>
      </Card>
    </div>
  );
}
