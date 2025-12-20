"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Eye,
  CheckCircle,
  XCircle,
  MoreVertical,
  Receipt,
  Euro,
  Clock,
  Download,
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

// Mock data - same as in expenses page
const mockExpenseReports: ExpenseReport[] = [
  {
    id: "1",
    employeeId: "1",
    title: "Frais de déplacement - Mission site A",
    items: [
      {
        id: "1",
        category: "fuel",
        description: "Essence pour déplacement",
        amount: 45.5,
        date: new Date("2024-12-10"),
        receipt: "/files/receipt_1.pdf",
      },
      {
        id: "2",
        category: "meal",
        description: "Repas midi",
        amount: 15.0,
        date: new Date("2024-12-10"),
      },
      {
        id: "3",
        category: "parking",
        description: "Parking site A",
        amount: 8.5,
        date: new Date("2024-12-10"),
        receipt: "/files/receipt_2.pdf",
      },
    ],
    totalAmount: 69.0,
    status: "submitted",
    submittedAt: new Date("2024-12-11"),
    exportedToPayroll: false,
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-11"),
  },
  {
    id: "2",
    employeeId: "2",
    title: "Frais de formation SSIAP",
    items: [
      {
        id: "1",
        category: "travel",
        description: "Train Paris-Lyon",
        amount: 85.0,
        date: new Date("2024-12-05"),
        receipt: "/files/receipt_3.pdf",
      },
      {
        id: "2",
        category: "accommodation",
        description: "Hôtel 1 nuit",
        amount: 90.0,
        date: new Date("2024-12-05"),
        receipt: "/files/receipt_4.pdf",
      },
    ],
    totalAmount: 175.0,
    status: "approved",
    submittedAt: new Date("2024-12-06"),
    reviewedAt: new Date("2024-12-07"),
    reviewedBy: "Alice Dubois",
    approvedBy: "Alice Dubois",
    approvedAt: new Date("2024-12-07"),
    exportedToPayroll: false,
    createdAt: new Date("2024-12-05"),
    updatedAt: new Date("2024-12-07"),
  },
  {
    id: "3",
    employeeId: "3",
    title: "Frais de mission site B",
    items: [
      {
        id: "1",
        category: "travel",
        description: "Déplacement",
        amount: 120.0,
        date: new Date("2024-12-12"),
        receipt: "/files/receipt_5.pdf",
      },
    ],
    totalAmount: 120.0,
    status: "submitted",
    submittedAt: new Date("2024-12-13"),
    exportedToPayroll: false,
    createdAt: new Date("2024-12-12"),
    updatedAt: new Date("2024-12-13"),
  },
];

const statusLabels = {
  draft: "Brouillon",
  submitted: "En attente",
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

export default function ExpenseValidationPage() {
  const [expenses, setExpenses] = useState<ExpenseReport[]>(mockExpenseReports);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingExpense, setReviewingExpense] =
    useState<ExpenseReport | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleReview = (expense: ExpenseReport) => {
    setReviewingExpense(expense);
    setRejectionReason("");
    setIsReviewModalOpen(true);
  };

  const handleApprove = () => {
    if (!reviewingExpense) return;

    setExpenses(
      expenses.map((expense) =>
        expense.id === reviewingExpense.id
          ? {
              ...expense,
              status: "approved",
              reviewedAt: new Date(),
              reviewedBy: "Alice Dubois", // Mock current user
              approvedBy: "Alice Dubois",
              approvedAt: new Date(),
              updatedAt: new Date(),
            }
          : expense,
      ),
    );

    setIsReviewModalOpen(false);
  };

  const handleReject = () => {
    if (!reviewingExpense || !rejectionReason.trim()) {
      alert("Veuillez indiquer un motif de rejet.");
      return;
    }

    setExpenses(
      expenses.map((expense) =>
        expense.id === reviewingExpense.id
          ? {
              ...expense,
              status: "rejected",
              reviewedAt: new Date(),
              reviewedBy: "Alice Dubois",
              rejectionReason: rejectionReason,
              updatedAt: new Date(),
            }
          : expense,
      ),
    );

    setIsReviewModalOpen(false);
  };

  const handleExportToPayroll = (expenseId: string) => {
    setExpenses(
      expenses.map((expense) =>
        expense.id === expenseId
          ? {
              ...expense,
              exportedToPayroll: true,
              exportedAt: new Date(),
              status: "paid",
              paymentDate: new Date(),
              updatedAt: new Date(),
            }
          : expense,
      ),
    );
  };

  const columns: ColumnDef<ExpenseReport>[] = [
    {
      key: "employeeId",
      label: "Employé",
      render: (expense: ExpenseReport) => {
        const employee = mockEmployees.find((e) => e.id === expense.employeeId);
        return (
          <div>
            <div className="font-medium">{employee?.name || "N/A"}</div>
            <div className="text-sm text-muted-foreground">
              {expense.title}
            </div>
          </div>
        );
      },
    },
    {
      key: "submittedAt",
      label: "Date de soumission",
      render: (expense: ExpenseReport) =>
        expense.submittedAt
          ? expense.submittedAt.toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "totalAmount",
      label: "Montant",
      render: (expense: ExpenseReport) => (
        <div className="flex items-center gap-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{expense.totalAmount.toFixed(2)} €</span>
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
      key: "exportedToPayroll",
      label: "Exporté",
      render: (expense: ExpenseReport) =>
        expense.exportedToPayroll ? (
          <CheckCircle className="h-4 w-4 text-green-600" />
        ) : (
          <XCircle className="h-4 w-4 text-gray-400" />
        ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (expense: ExpenseReport) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {expense.status === "submitted" && (
              <DropdownMenuItem onClick={() => handleReview(expense)}>
                <Eye className="mr-2 h-4 w-4" />
                Examiner
              </DropdownMenuItem>
            )}
            {expense.status === "approved" && !expense.exportedToPayroll && (
              <DropdownMenuItem
                onClick={() => handleExportToPayroll(expense.id)}
              >
                <Download className="mr-2 h-4 w-4" />
                Exporter vers paie
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const pendingCount = expenses.filter((e) => e.status === "submitted").length;
  const approvedCount = expenses.filter((e) => e.status === "approved").length;
  const totalPendingAmount = expenses
    .filter((e) => e.status === "submitted")
    .reduce((sum, e) => sum + e.totalAmount, 0);
  const totalApprovedAmount = expenses
    .filter((e) => e.status === "approved" && !e.exportedToPayroll)
    .reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Validation des Notes de Frais</h1>
        <p className="text-muted-foreground">
          Examinez et validez les notes de frais des employés
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalPendingAmount.toFixed(2)} €
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              À exporter
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                expenses.filter(
                  (e) => e.status === "approved" && !e.exportedToPayroll,
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              {totalApprovedAmount.toFixed(2)} €
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total du mois
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {expenses.reduce((sum, e) => sum + e.totalAmount, 0).toFixed(2)} €
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notes de frais à valider</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={expenses} />
        </CardContent>
      </Card>

      {/* Review Modal */}
      <Modal
        open={isReviewModalOpen}
        onOpenChange={setIsReviewModalOpen}
        type="form"
        title="Examiner la note de frais"
        size="xl"
        actions={{
          primary: {
            label: "Approuver",
            onClick: handleApprove,
            icon: <CheckCircle className="h-4 w-4" />,
          },
          secondary: {
            label: "Rejeter",
            onClick: handleReject,
            variant: "destructive",
            icon: <XCircle className="h-4 w-4" />,
          },
          tertiary: {
            label: "Annuler",
            onClick: () => setIsReviewModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {reviewingExpense && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Employé</Label>
                <p className="text-sm font-medium">
                  {
                    mockEmployees.find(
                      (e) => e.id === reviewingExpense.employeeId,
                    )?.name
                  }
                </p>
              </div>

              <div>
                <Label>Montant total</Label>
                <p className="text-sm font-bold">
                  {reviewingExpense.totalAmount.toFixed(2)} €
                </p>
              </div>
            </div>

            <div>
              <Label>Titre</Label>
              <p className="text-sm">{reviewingExpense.title}</p>
            </div>

            <div>
              <Label>Articles ({reviewingExpense.items.length})</Label>
              <div className="space-y-2 mt-2">
                {reviewingExpense.items.map((item) => (
                  <Card key={item.id}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">
                              {categoryLabels[item.category]}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {item.date.toLocaleDateString("fr-FR")}
                            </span>
                          </div>
                          <p className="text-sm font-medium">
                            {item.description}
                          </p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-lg">
                            {item.amount.toFixed(2)} €
                          </p>
                          {item.receipt && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2"
                              asChild
                            >
                              <a href={item.receipt} target="_blank">
                                <Receipt className="h-3 w-3 mr-1" />
                                Justificatif
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {reviewingExpense.notes && (
              <div>
                <Label>Notes de l'employé</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {reviewingExpense.notes}
                </p>
              </div>
            )}

            <div className="bg-orange-500/10 dark:bg-orange-400/10 border border-orange-500/50 dark:border-orange-400/50 rounded-lg p-4">
              <Label htmlFor="rejectionReason">
                Motif de rejet (si rejet)
              </Label>
              <Textarea
                id="rejectionReason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Indiquez le motif du rejet..."
                rows={3}
                className="mt-2"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
