"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Eye,
  Download,
  Euro,
  Calendar,
  TrendingUp,
  FileText,
} from "lucide-react";
import { ExpenseReport } from "@/lib/types";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";

// Mock employees
const mockEmployees = [
  { id: "1", name: "Marie Dupont" },
  { id: "2", name: "Jean Martin" },
  { id: "3", name: "Sophie Leroy" },
  { id: "4", name: "Pierre Durand" },
];

// Mock historical data
const mockHistoricalExpenses: ExpenseReport[] = [
  {
    id: "1",
    employeeId: "1",
    title: "Frais de déplacement - Mission site A",
    items: [
      {
        id: "1",
        category: "fuel",
        description: "Essence",
        amount: 45.5,
        date: new Date("2024-12-10"),
      },
    ],
    totalAmount: 69.0,
    status: "paid",
    submittedAt: new Date("2024-12-11"),
    approvedAt: new Date("2024-12-12"),
    paymentDate: new Date("2024-12-15"),
    exportedToPayroll: true,
    exportedAt: new Date("2024-12-14"),
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "2",
    employeeId: "2",
    title: "Frais de formation SSIAP",
    items: [
      {
        id: "1",
        category: "travel",
        description: "Train",
        amount: 85.0,
        date: new Date("2024-12-05"),
      },
    ],
    totalAmount: 175.0,
    status: "paid",
    submittedAt: new Date("2024-12-06"),
    approvedAt: new Date("2024-12-07"),
    paymentDate: new Date("2024-12-10"),
    exportedToPayroll: true,
    exportedAt: new Date("2024-12-08"),
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-10"),
  },
  {
    id: "3",
    employeeId: "1",
    title: "Frais novembre",
    items: [
      {
        id: "1",
        category: "fuel",
        description: "Essence",
        amount: 55.0,
        date: new Date("2024-11-15"),
      },
    ],
    totalAmount: 55.0,
    status: "paid",
    submittedAt: new Date("2024-11-16"),
    approvedAt: new Date("2024-11-18"),
    paymentDate: new Date("2024-11-25"),
    exportedToPayroll: true,
    exportedAt: new Date("2024-11-20"),
    createdAt: new Date("2024-11-15"),
    updatedAt: new Date("2024-11-25"),
  },
  {
    id: "4",
    employeeId: "3",
    title: "Déplacement site C",
    items: [
      {
        id: "1",
        category: "travel",
        description: "Transport",
        amount: 95.0,
        date: new Date("2024-11-20"),
      },
    ],
    totalAmount: 95.0,
    status: "rejected",
    submittedAt: new Date("2024-11-21"),
    reviewedAt: new Date("2024-11-22"),
    rejectionReason: "Justificatifs manquants",
    exportedToPayroll: false,
    createdAt: new Date("2024-11-20"),
    updatedAt: new Date("2024-11-22"),
  },
];

const statusLabels = {
  draft: "Brouillon",
  submitted: "Soumis",
  approved: "Approuvé",
  rejected: "Rejeté",
  paid: "Payé",
};

const statusColors = {
  draft: "secondary",
  submitted: "default",
  approved: "secondary",
  rejected: "destructive",
  paid: "secondary",
} as const;

const categoryLabels = {
  travel: "Transport",
  meal: "Repas",
  accommodation: "Hébergement",
  fuel: "Carburant",
  parking: "Parking",
  other: "Autre",
};

export default function ExpenseHistoryPage() {
  const [expenses] = useState<ExpenseReport[]>(
    mockHistoricalExpenses,
  );
  const [filterEmployee, setFilterEmployee] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterMonth, setFilterMonth] = useState<string>("all");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingExpense, setViewingExpense] = useState<ExpenseReport | null>(
    null,
  );

  const handleView = (expense: ExpenseReport) => {
    setViewingExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleExport = () => {
    alert("Exportation CSV en cours...");
  };

  // Apply filters
  let filteredExpenses = expenses;

  if (filterEmployee !== "all") {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.employeeId === filterEmployee,
    );
  }

  if (filterStatus !== "all") {
    filteredExpenses = filteredExpenses.filter(
      (e) => e.status === filterStatus,
    );
  }

  if (filterMonth !== "all") {
    const [year, month] = filterMonth.split("-").map(Number);
    filteredExpenses = filteredExpenses.filter((e) => {
      const date = e.createdAt;
      return date.getFullYear() === year && date.getMonth() + 1 === month;
    });
  }

  const columns: ColumnDef<ExpenseReport>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (expense: ExpenseReport) => {
        const employee = mockEmployees.find((e) => e.id === expense.employeeId);
        return employee?.name || "N/A";
      },
    },
    {
      key: "title",
      label: "Titre",
      render: (expense: ExpenseReport) => expense.title,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (expense: ExpenseReport) =>
        expense.createdAt.toLocaleDateString("fr-FR"),
    },
    {
      key: "totalAmount",
      label: "Montant",
      render: (expense: ExpenseReport) => (
        <div className="flex items-center gap-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">
            {expense.totalAmount.toFixed(2)} €
          </span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      render: (expense: ExpenseReport) => (
        <Badge variant={statusColors[expense.status]}>
          {statusLabels[expense.status]}
        </Badge>
      ),
    },
    {
      key: "paymentDate",
      label: "Date de paiement",
      render: (expense: ExpenseReport) =>
        expense.paymentDate
          ? expense.paymentDate.toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "actions",
      label: "Actions",
      render: (expense: ExpenseReport) => (
        <Button variant="ghost" size="sm" onClick={() => handleView(expense)}>
          <Eye className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  // Calculate stats
  const totalPaid = filteredExpenses
    .filter((e) => e.status === "paid")
    .reduce((sum, e) => sum + e.totalAmount, 0);
  const totalRejected = filteredExpenses.filter(
    (e) => e.status === "rejected",
  ).length;
  const avgAmount =
    filteredExpenses.length > 0
      ? filteredExpenses.reduce((sum, e) => sum + e.totalAmount, 0) /
        filteredExpenses.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Historique des Notes de Frais</h1>
          <p className="text-muted-foreground">
            Consultez l&apos;historique complet des notes de frais
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total payé</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPaid.toFixed(2)} €</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total notes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredExpenses.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejetées</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRejected}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgAmount.toFixed(2)} €</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Employé</Label>
              <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {mockEmployees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Statut</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                  <SelectItem value="approved">Approuvé</SelectItem>
                  <SelectItem value="rejected">Rejeté</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Mois</Label>
              <Select value={filterMonth} onValueChange={setFilterMonth}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les mois</SelectItem>
                  <SelectItem value="2024-12">Décembre 2024</SelectItem>
                  <SelectItem value="2024-11">Novembre 2024</SelectItem>
                  <SelectItem value="2024-10">Octobre 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Historique ({filteredExpenses.length} résultat(s))
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredExpenses} />
        </CardContent>
      </Card>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la note de frais"
        size="lg"
      >
        {viewingExpense && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employé</Label>
                <p className="text-sm font-medium">
                  {
                    mockEmployees.find(
                      (e) => e.id === viewingExpense.employeeId,
                    )?.name
                  }
                </p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge variant={statusColors[viewingExpense.status]}>
                  {statusLabels[viewingExpense.status]}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Titre</Label>
              <p className="text-sm">{viewingExpense.title}</p>
            </div>

            <div>
              <Label>Articles</Label>
              <div className="space-y-2 mt-2">
                {viewingExpense.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <Badge variant="outline">
                            {categoryLabels[item.category]}
                          </Badge>
                          <p className="text-sm mt-1">{item.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.date.toLocaleDateString("fr-FR")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {item.amount.toFixed(2)} €
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <Label>Montant total</Label>
                <p className="text-lg font-bold">
                  {viewingExpense.totalAmount.toFixed(2)} €
                </p>
              </div>
            </div>

            {viewingExpense.paymentDate && (
              <div>
                <Label>Date de paiement</Label>
                <p className="text-sm">
                  {viewingExpense.paymentDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}

            {viewingExpense.rejectionReason && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                <Label>Motif de rejet</Label>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  {viewingExpense.rejectionReason}
                </p>
              </div>
            )}

            {viewingExpense.exportedToPayroll && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✓ Exporté vers la paie le{" "}
                  {viewingExpense.exportedAt?.toLocaleDateString("fr-FR")}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
