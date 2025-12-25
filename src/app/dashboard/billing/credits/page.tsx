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
import { Plus } from "lucide-react";
import { mockBillingInvoices, BillingInvoice } from "@/data/billing-invoices";

export default function BillingCreditsPage() {
  const [invoices, setInvoices] = useState<BillingInvoice[]>(mockBillingInvoices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(null);
  const [formData, setFormData] = useState<{
    invoiceId: string;
    amount: number;
    reason: string;
  }>({
    invoiceId: "",
    amount: 0,
    reason: "",
  });

  // Get all credits from all invoices
  const allCredits = invoices
    .flatMap((invoice) =>
      (invoice.credits || []).map((credit) => ({
        ...credit,
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        invoiceId: invoice.id,
      }))
    )
    .filter((credit) => credit);

  const columns: ColumnDef<typeof allCredits[0]>[] = [
    {
      key: "creditNumber",
      label: "N° Avoir",
      sortable: true,
    },
    {
      key: "invoiceNumber",
      label: "Facture",
    },
    {
      key: "clientName",
      label: "Client",
    },
    {
      key: "amount",
      label: "Montant",
      render: (credit) => (
        <span className="font-semibold text-red-600">
          -{credit.amount.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      key: "reason",
      label: "Raison",
      render: (credit) => <span className="text-sm">{credit.reason}</span>,
    },
    {
      key: "createdAt",
      label: "Date",
      render: (credit) =>
        new Date(credit.createdAt).toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
    },
  ];

  const handleCreate = () => {
    setFormData({
      invoiceId: "",
      amount: 0,
      reason: "",
    });
    setIsCreateModalOpen(true);
  };

  const handleSave = () => {
    const invoice = invoices.find((i) => i.id === formData.invoiceId);
    if (!invoice) return;

    const creditNumber = `AVO-2024-${String(allCredits.length + 1).padStart(3, "0")}`;
    const newCredit = {
      id: Date.now().toString(),
      creditNumber,
      amount: formData.amount,
      reason: formData.reason,
      createdAt: new Date().toISOString(),
    };

    const updatedCredits = [...(invoice.credits || []), newCredit];
    const newSubtotal = invoice.subtotal - formData.amount;
    const newVatAmount = newSubtotal * (invoice.vatRate / 100);
    const newTotal = newSubtotal + newVatAmount;

    setInvoices(
      invoices.map((i) =>
        i.id === formData.invoiceId
          ? {
              ...i,
              credits: updatedCredits,
              subtotal: newSubtotal,
              vatAmount: newVatAmount,
              total: newTotal,
              updatedAt: new Date().toISOString(),
            }
          : i
      )
    );

    setIsCreateModalOpen(false);
    setFormData({ invoiceId: "", amount: 0, reason: "" });
  };

  const handleRowClick = (credit: typeof allCredits[0]) => {
    const invoice = invoices.find((i) => i.id === credit.invoiceId);
    if (invoice) {
      setSelectedInvoice(invoice);
      setIsViewModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Avoirs</h1>
          <p className="text-muted-foreground">
            Création et suivi des avoirs pour les factures
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvel Avoir
        </Button>
      </div>

      <DataTable
        data={allCredits}
        columns={columns}
        searchKey="creditNumber"
        searchPlaceholder="Rechercher un avoir..."
        onRowClick={handleRowClick}
      />

      {/* Create Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title="Nouvel avoir"
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
                      {invoice.invoiceNumber} - {invoice.clientName} (
                      {invoice.total.toLocaleString("fr-FR")} €)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="amount">Montant de l&apos;avoir (€)</Label>
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
                placeholder="0.00"
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="reason">Raison de l&apos;avoir</Label>
              <Textarea
                id="reason"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                placeholder="Expliquez la raison de cet avoir..."
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
        title="Détails des avoirs"
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

            {selectedInvoice.credits && selectedInvoice.credits.length > 0 ? (
              <div className="space-y-3">
                {selectedInvoice.credits.map((credit) => (
                  <div
                    key={credit.id}
                    className="border rounded-lg p-4 bg-muted/50"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-sm font-semibold">
                        {credit.creditNumber}
                      </span>
                      <span className="font-semibold text-red-600">
                        -{credit.amount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{credit.reason}</p>
                    <p className="text-xs text-muted-foreground">
                      Créé le {new Date(credit.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Aucun avoir pour cette facture
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

