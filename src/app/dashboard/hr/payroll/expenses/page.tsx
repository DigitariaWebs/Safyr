"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Send,
  MoreVertical,
  FileText,
  Receipt,
  Euro,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { ExpenseReport, ExpenseItem } from "@/lib/types";
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
    employeeId: "1",
    title: "Frais mission décembre",
    items: [
      {
        id: "1",
        category: "fuel",
        description: "Essence",
        amount: 50.0,
        date: new Date("2024-12-15"),
      },
    ],
    totalAmount: 50.0,
    status: "draft",
    exportedToPayroll: false,
    createdAt: new Date("2024-12-15"),
    updatedAt: new Date("2024-12-15"),
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

export default function ExpenseReportsPage() {
  const [expenses, setExpenses] = useState<ExpenseReport[]>(mockExpenseReports);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseReport | null>(
    null,
  );
  const [viewingExpense, setViewingExpense] = useState<ExpenseReport | null>(
    null,
  );
  const [formData, setFormData] = useState({
    employeeId: "1", // Current user - in real app, get from auth
    title: "",
    items: [] as Omit<ExpenseItem, "id">[],
    notes: "",
  });

  // Filter by current user (mock - in real app, use actual auth)
  const currentUserId = "1";
  const myExpenses = expenses.filter((e) => e.employeeId === currentUserId);

  const handleCreate = () => {
    setEditingExpense(null);
    setFormData({
      employeeId: currentUserId,
      title: "",
      items: [
        {
          category: "fuel",
          description: "",
          amount: 0,
          date: new Date(),
        },
      ],
      notes: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleEdit = (expense: ExpenseReport) => {
    if (expense.status !== "draft" && expense.status !== "rejected") {
      alert("Seuls les brouillons et les notes de frais rejetées peuvent être modifiés.");
      return;
    }
    setEditingExpense(expense);
    setFormData({
      employeeId: expense.employeeId,
      title: expense.title,
      items: expense.items.map((item) => ({
        category: item.category,
        description: item.description,
        amount: item.amount,
        date: item.date,
        notes: item.notes,
      })),
      notes: expense.notes || "",
    });
    setIsCreateModalOpen(true);
  };

  const handleView = (expense: ExpenseReport) => {
    setViewingExpense(expense);
    setIsViewModalOpen(true);
  };

  const handleDelete = (expenseId: string) => {
    const expense = expenses.find((e) => e.id === expenseId);
    if (expense && expense.status !== "draft") {
      alert("Seuls les brouillons peuvent être supprimés.");
      return;
    }
    if (confirm("Êtes-vous sûr de vouloir supprimer cette note de frais ?")) {
      setExpenses(expenses.filter((e) => e.id !== expenseId));
    }
  };

  const handleSave = (asDraft = false) => {
    const totalAmount = formData.items.reduce(
      (sum, item) => sum + Number(item.amount),
      0,
    );

    const expenseData = {
      employeeId: formData.employeeId,
      title: formData.title,
      items: formData.items.map((item, index) => ({
        id: (index + 1).toString(),
        ...item,
        amount: Number(item.amount),
      })),
      totalAmount,
      status: asDraft ? ("draft" as const) : ("submitted" as const),
      submittedAt: asDraft ? undefined : new Date(),
      exportedToPayroll: false,
      notes: formData.notes,
    };

    if (editingExpense) {
      setExpenses(
        expenses.map((expense) =>
          expense.id === editingExpense.id
            ? {
                ...expense,
                ...expenseData,
                updatedAt: new Date(),
              }
            : expense,
        ),
      );
    } else {
      const newExpense: ExpenseReport = {
        id: Date.now().toString(),
        ...expenseData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setExpenses([...expenses, newExpense]);
    }

    setIsCreateModalOpen(false);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          category: "fuel",
          description: "",
          amount: 0,
          date: new Date(),
        },
      ],
    });
  };

  const removeItem = (index: number) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (
    index: number,
    field: keyof Omit<ExpenseItem, "id">,
    value: any,
  ) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };
    setFormData({
      ...formData,
      items: newItems,
    });
  };

  const columns: ColumnDef<ExpenseReport>[] = [
    {
      key: "title",
      label: "Titre",
      render: (expense: ExpenseReport) => (
        <div>
          <div className="font-medium">{expense.title}</div>
          <div className="text-sm text-muted-foreground">
            {expense.items.length} article(s)
          </div>
        </div>
      ),
    },
    {
      key: "totalAmount",
      label: "Montant total",
      render: (expense: ExpenseReport) => (
        <div className="flex items-center gap-1">
          <Euro className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold">{expense.totalAmount.toFixed(2)} €</span>
        </div>
      ),
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
      key: "status",
      label: "Statut",
      render: (expense: ExpenseReport) => (
        <Badge variant={statusColors[expense.status]}>
          {statusLabels[expense.status]}
        </Badge>
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
            <DropdownMenuItem onClick={() => handleView(expense)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            {(expense.status === "draft" || expense.status === "rejected") && (
              <DropdownMenuItem onClick={() => handleEdit(expense)}>
                <Pencil className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            )}
            {expense.status === "draft" && (
              <DropdownMenuItem
                onClick={() => handleDelete(expense.id)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Calculate stats
  const draftCount = myExpenses.filter((e) => e.status === "draft").length;
  const submittedCount = myExpenses.filter((e) => e.status === "submitted").length;
  const approvedCount = myExpenses.filter((e) => e.status === "approved").length;
  const totalApprovedAmount = myExpenses
    .filter((e) => e.status === "approved" || e.status === "paid")
    .reduce((sum, e) => sum + e.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mes Notes de Frais</h1>
          <p className="text-muted-foreground">
            Déclarez et suivez vos notes de frais
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle note de frais
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brouillons</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{draftCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{submittedCount}</div>
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
            <CardTitle className="text-sm font-medium">Total approuvé</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalApprovedAmount.toFixed(2)} €
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mes notes de frais</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={myExpenses} />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={
          editingExpense ? "Modifier la note de frais" : "Nouvelle note de frais"
        }
        size="xl"
        actions={{
          primary: {
            label: "Soumettre",
            onClick: () => handleSave(false),
            icon: <Send className="h-4 w-4" />,
          },
          secondary: {
            label: "Enregistrer comme brouillon",
            onClick: () => handleSave(true),
            variant: "outline",
          },
          tertiary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "ghost",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Titre de la note de frais *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Ex: Frais de déplacement - Mission site A"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Articles</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addItem}
              >
                <Plus className="mr-2 h-4 w-4" />
                Ajouter un article
              </Button>
            </div>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <Card key={index}>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Catégorie *</Label>
                        <Select
                          value={item.category}
                          onValueChange={(value: any) =>
                            updateItem(index, "category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="travel">Transport</SelectItem>
                            <SelectItem value="meal">Repas</SelectItem>
                            <SelectItem value="accommodation">
                              Hébergement
                            </SelectItem>
                            <SelectItem value="fuel">Carburant</SelectItem>
                            <SelectItem value="parking">Parking</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Date *</Label>
                        <Input
                          type="date"
                          value={
                            item.date instanceof Date
                              ? item.date.toISOString().split("T")[0]
                              : item.date
                          }
                          onChange={(e) =>
                            updateItem(index, "date", new Date(e.target.value))
                          }
                        />
                      </div>

                      <div>
                        <Label>Description *</Label>
                        <Input
                          value={item.description}
                          onChange={(e) =>
                            updateItem(index, "description", e.target.value)
                          }
                          placeholder="Description de la dépense"
                        />
                      </div>

                      <div>
                        <Label>Montant (€) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.amount}
                          onChange={(e) =>
                            updateItem(index, "amount", e.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>

                      <div className="col-span-2">
                        <Label>Justificatif (PDF/Image)</Label>
                        <Input type="file" accept=".pdf,.jpg,.jpeg,.png" />
                      </div>

                      {formData.items.length > 1 && (
                        <div className="col-span-2">
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer cet article
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <Label>
              Montant total:{" "}
              <span className="font-bold">
                {formData.items
                  .reduce((sum, item) => sum + Number(item.amount || 0), 0)
                  .toFixed(2)}{" "}
                €
              </span>
            </Label>
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Notes additionnelles..."
              rows={3}
            />
          </div>
        </div>
      </Modal>

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
            <div>
              <Label>Titre</Label>
              <p className="text-sm font-medium">{viewingExpense.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Statut</Label>
                <div>
                  <Badge variant={statusColors[viewingExpense.status]}>
                    {statusLabels[viewingExpense.status]}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>Montant total</Label>
                <p className="text-sm font-bold">
                  {viewingExpense.totalAmount.toFixed(2)} €
                </p>
              </div>
            </div>

            <div>
              <Label>Articles ({viewingExpense.items.length})</Label>
              <div className="space-y-2 mt-2">
                {viewingExpense.items.map((item) => (
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
                          <p className="text-sm">{item.description}</p>
                          {item.notes && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {item.amount.toFixed(2)} €
                          </p>
                          {item.receipt && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-1"
                              asChild
                            >
                              <a href={item.receipt} target="_blank">
                                <Receipt className="h-3 w-3 mr-1" />
                                Voir
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

            {viewingExpense.submittedAt && (
              <div>
                <Label>Date de soumission</Label>
                <p className="text-sm">
                  {viewingExpense.submittedAt.toLocaleString("fr-FR")}
                </p>
              </div>
            )}

            {viewingExpense.approvedBy && (
              <div>
                <Label>Approuvée par</Label>
                <p className="text-sm">
                  {viewingExpense.approvedBy} le{" "}
                  {viewingExpense.approvedAt?.toLocaleString("fr-FR")}
                </p>
              </div>
            )}

            {viewingExpense.rejectionReason && (
              <div>
                <Label>Motif de rejet</Label>
                <p className="text-sm text-red-600">
                  {viewingExpense.rejectionReason}
                </p>
              </div>
            )}

            {viewingExpense.notes && (
              <div>
                <Label>Notes</Label>
                <p className="text-sm whitespace-pre-wrap">
                  {viewingExpense.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
