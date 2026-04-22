"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { mockBillingInvoices, BillingInvoice } from "@/data/billing-invoices";

export default function BillingAccountingPage() {
  const [invoices] = useState<BillingInvoice[]>(mockBillingInvoices);

  const columns: ColumnDef<BillingInvoice>[] = [
    {
      key: "invoiceNumber",
      label: "N° Facture",
      sortable: true,
    },
    {
      key: "clientName",
      label: "Client",
    },
    {
      key: "total",
      label: "Montant TTC",
      render: (invoice) => (
        <span className="font-semibold">
          {invoice.total.toLocaleString("fr-FR")} €
        </span>
      ),
    },
    {
      key: "salesEntry",
      label: "Écriture ventes",
      render: (invoice) => (
        <span className="text-sm font-mono">
          {invoice.accountingEntries?.salesEntry || "-"}
        </span>
      ),
    },
    {
      key: "vatEntry",
      label: "Écriture TVA",
      render: (invoice) => (
        <span className="text-sm font-mono">
          {invoice.accountingEntries?.vatEntry || "-"}
        </span>
      ),
    },
    {
      key: "accountingStatus",
      label: "Statut",
      render: (invoice) => {
        const status = invoice.accountingEntries?.status || "Pending";
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          Generated: "default",
          Exported: "secondary",
          Pending: "outline",
        };
        return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
      },
    },
  ];

  const handleRowClick = () => {
    // Open details modal
  };

  const handleExportFEC = () => {
    alert("Export FEC en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Intégration avec la Comptabilité
          </h1>
          <p className="text-muted-foreground">
            Génération automatique des écritures comptables, synchronisation
            avec journaux, préparation FEC
          </p>
        </div>
        <Button variant="outline" onClick={handleExportFEC}>
          <Download className="h-4 w-4 mr-2" />
          Export FEC
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">
            Écritures générées
          </Label>
          <p className="text-2xl font-bold">
            {
              invoices.filter(
                (inv) => inv.accountingEntries?.status === "Generated",
              ).length
            }
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">
            Écritures exportées
          </Label>
          <p className="text-2xl font-bold">
            {
              invoices.filter(
                (inv) => inv.accountingEntries?.status === "Exported",
              ).length
            }
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">En attente</Label>
          <p className="text-2xl font-bold">
            {
              invoices.filter(
                (inv) =>
                  inv.accountingEntries?.status === "Pending" ||
                  !inv.accountingEntries,
              ).length
            }
          </p>
        </div>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        searchKey="invoiceNumber"
        searchPlaceholder="Rechercher une facture..."
        onRowClick={handleRowClick}
      />
    </div>
  );
}
