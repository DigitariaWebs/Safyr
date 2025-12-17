"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, MoreVertical } from "lucide-react";
import { SanctionsRegister } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";

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
  const [sanctionsRegisters] = useState<SanctionsRegister[]>(
    mockSanctionsRegisters,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingRegister, setViewingRegister] =
    useState<SanctionsRegister | null>(null);

  const handleView = (register: SanctionsRegister) => {
    setViewingRegister(register);
    setIsViewModalOpen(true);
  };

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((e) => e.id === employeeId);
    return employee ? employee.name : "Employé inconnu";
  };

  const columns: ColumnDef<SanctionsRegister>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (register: SanctionsRegister) => (
        <div>
          <div className="font-medium">
            <Link
              href={`/dashboard/hr/employees/${register.employeeId}`}
              className="text-primary hover:underline"
            >
              {getEmployeeName(register.employeeId)}
            </Link>
          </div>
        </div>
      ),
    },
    {
      key: "totalWarnings",
      label: "Avertissements",
      render: (register: SanctionsRegister) => register.totalWarnings,
    },
    {
      key: "totalSuspensions",
      label: "Suspensions",
      render: (register: SanctionsRegister) => register.totalSuspensions,
    },
    {
      key: "lastUpdated",
      label: "Dernière mise à jour",
      render: (register: SanctionsRegister) =>
        register.lastUpdated.toLocaleDateString("fr-FR"),
    },
    {
      key: "actions",
      label: "Actions",
      render: (register: SanctionsRegister) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleView(register)}
              className="gap-2"
            >
              <Eye className="h-4 w-4" />
              Voir le registre
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Registre des sanctions
          </h1>
          <p className="text-muted-foreground">
            Historique des sanctions par employé
          </p>
        </div>
      </div>

      {/* Sanctions Register Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Registre des sanctions ({sanctionsRegisters.length} employés)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={sanctionsRegisters}
            columns={columns}
            searchKeys={["employeeId"]}
            searchPlaceholder="Rechercher un employé..."
          />
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Registre des sanctions"
        description={
          viewingRegister
            ? `Historique des sanctions pour ${getEmployeeName(viewingRegister.employeeId)}`
            : ""
        }
        actions={{
          primary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {viewingRegister && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employé</Label>
                <p className="text-sm font-medium">
                  {getEmployeeName(viewingRegister.employeeId)}
                </p>
              </div>
              <div>
                <Label>Total avertissements</Label>
                <p className="text-sm font-medium">
                  {viewingRegister.totalWarnings}
                </p>
              </div>
              <div>
                <Label>Total suspensions</Label>
                <p className="text-sm font-medium">
                  {viewingRegister.totalSuspensions}
                </p>
              </div>
              <div>
                <Label>Dernière mise à jour</Label>
                <p className="text-sm font-medium">
                  {viewingRegister.lastUpdated.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Label>Sanctions ({viewingRegister.sanctions.length})</Label>
              <div className="space-y-2">
                {viewingRegister.sanctions.map((sanction) => (
                  <div key={sanction.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {sanction.type} - {sanction.reason}
                      </h4>
                      <Badge variant={severityColors[sanction.severity]}>
                        {severityLabels[sanction.severity]}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label className="text-xs">Date</Label>
                        <p className="text-sm">
                          {sanction.date.toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs">Émis par</Label>
                        <p className="text-sm">{sanction.issuedBy}</p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={sanction.description}
                        readOnly
                        className="min-h-16 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
