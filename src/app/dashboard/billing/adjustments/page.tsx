"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { mockBillingInvoices, BillingInvoice } from "@/data/billing-invoices";

export default function BillingAdjustmentsPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>(mockBillingInvoices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [formData, setFormData] = useState<{
    invoiceId: string;
    type: "Manual" | "Credit" | "Exception";
    amount: number;
    reason: string;
  }>({
    invoiceId: "",
    type: "Manual",
    amount: 0,
    reason: "",
  });

  // Get all adjustments from all invoices
  const allAdjustments = invoices
    .flatMap((invoice) =>
      (invoice.adjustments || []).map((adj) => ({
        ...adj,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        invoiceId: invoice.id,
      }))
    )
    .filter((adj) => adj);

  const columns: ColumnDef<typeof allAdjustments[0]>[] = [
    {
      key: "invoiceNumber",
      label: "Facture",
      sortable: true,
    },
    {
      key: "clientName",
      label: "Client",
    },
    {
      key: "type",
      label: "Type",
      render: (adj) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          Manual: "default",
          Credit: "secondary",
          Exception: "outline",
        };
        return <Badge variant={variants[adj.type] || "outline"}>{adj.type}</Badge>;
      },
    },
    {
      key: "amount",
      label: "Montant",
      render: (adj) => (
        <span className={`font-semibold ${adj.amount < 0 ? "text-red-600" : "text-green-600"}`}>
          {adj.amount > 0 ? "+" : ""}
          {adj.amount.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      key: "reason",
      label: "Raison",
      render: (adj) => <span className="text-sm">{adj.reason}</span>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (adj) =>
        new Date(adj.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
  ];

  const handleCreate = () => {
    setFormData({
      invoiceId: "",
      type: "Manual",
      amount: 0,
      reason: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    const invoice = invoices.find((i) => i.id === formData.invoiceId);
    if (!invoice) return;

    const newAdjustment = {
      id: Date.now().toString(),
      type: formData.type,
      amount: formData.amount,
      reason: formData.reason,
      createdAt: new Date().toISOString(),
      createdBy: "Admin",
    };

    const updatedAdjustments = [...(invoice.adjustments || []), newAdjustment];
    const newSubtotal = invoice.subtotal + formData.amount;
    const newVatAmount = newSubtotal * (invoice.vatRate / 100);
    const newTotal = newSubtotal + newVatAmount;

    setInvoices(
      invoices.map((i) =>
        i.id === formData.invoiceId
          ? {
              ...i,
              adjustments: updatedAdjustments,
              subtotal: newSubtotal,
              vatAmount: newVatAmount,
              total: newTotal,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    setIsCreateModalOpen(false);
    setFormData({ invoiceId: "", type: "Manual", amount: 0, reason: "" });
  };

  const handleRowClick = (adjustment: typeof allAdjustments[0]) => {
    const invoice = invoices.find((i) => i.id === adjustment.invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setIsViewModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Ajustements & Exceptions</h1>
          <p className="text-muted-foreground">
            Ajustements manuels, justifications d&apos;écarts, gestion des avoirs et refacturation exceptionnelle
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Ajustement
        </Button>
      </div>

      <DataTable
        data={allAdjustments}
        columns={columns}
        searchKey="invoiceNumber"
        searchPlaceholder="Rechercher un ajustement..."
        onRowClick={handleRowClick}
      />

      {/* Create Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title="Nouvel ajustement"
        size="lg"
        actions={{
          primary: {
            label: "Créer",
            onClick: handleSave,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsCreateModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="invoiceId">Facture concernée</Label>
              <Select
                value={formData.invoiceId}
                onValueChange={(value) =>
                  setFormData({ ...formData, invoiceId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une facture" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((invoice) => (
                    <SelectItem key={invoice.id} value={invoice.id}>
                      {invoice.invoiceNumber} - {invoice.clientName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type">Type d&apos;ajustement</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    type: value as "Manual" | "Credit" | "Exception",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manual">Ajustement manuel</SelectItem>
                  <SelectItem value="Credit">Avoir</SelectItem>
                  <SelectItem value="Exception">Refacturation exceptionnelle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Montant (€)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                placeholder="Montant positif ou négatif"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="reason">Justification obligatoire</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Expliquez la raison de cet ajustement..."
                rows={4}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Historique des ajustements"
        size="lg"
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsViewModalOpen(false),
          },
        }}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="mb-4">
              <Label className="text-base font-semibold">Facture</Label>
              <p className="text-sm">{selectedInvoice.invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">
                {selectedInvoice.clientName}
              </p>
            </div>

            {selectedInvoice.adjustments && selectedInvoice.adjustments.length > 0 ? (
              <div className="space-y-3">
                {selectedInvoice.adjustments.map((adj) => (
                  <div
                    key={adj.id}
                    className="border rounded-lg p-4 bg-muted/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={adj.type === "Manual" ? "default" : "secondary"}>
                        {adj.type}
                      </Badge>
                      <span
                        className={`font-semibold ${
                          adj.amount < 0 ? "text-red-600" : "text-green-600"
                        }`}
                      >
                        {adj.amount > 0 ? "+" : ""}
                        {adj.amount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{adj.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Par {adj.createdBy} le{" "}
                      {new Date(adj.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun ajustement pour cette facture
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}


