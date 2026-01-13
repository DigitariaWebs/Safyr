"use client";

import { useState } from "react";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Label } from "@/components/ui/label";
import { mockBillingInvoices, BillingInvoice } from "@/data/billing-invoices";

export default function BillingPayrollPage() {
  const [invoices] = useState<BillingInvoice[]>(mockBillingInvoices);

  // Filter invoices with payroll alignment
  const invoicesWithPayroll = invoices.filter((inv) => inv.payrollAlignment);

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
      key: "hoursPaid",
      label: "Heures payées",
      render: (invoice) => (
        <span className="text-sm">
          {invoice.payrollAlignment?.hoursPaid || 0} h
        </span>
      ),
    },
    {
      key: "hoursBillable",
      label: "Heures facturables",
      render: (invoice) => (
        <span className="text-sm">
          {invoice.payrollAlignment?.hoursBillable || 0} h
        </span>
      ),
    },
    {
      key: "variance",
      label: "Écart",
      render: (invoice) => {
        const variance = invoice.payrollAlignment?.variance || 0;
        return (
          <span
            className={`text-sm font-semibold ${
              variance === 0
                ? "text-green-600"
                : variance > 0
                  ? "text-orange-600"
                  : "text-red-600"
            }`}
          >
            {variance > 0 ? "+" : ""}
            {variance} h
          </span>
        );
      },
    },
    {
      key: "profitability",
      label: "Rentabilité",
      render: (invoice) => (
        <span className="text-sm font-semibold text-green-600">
          {invoice.payrollAlignment?.profitability || 0}%
        </span>
      ),
    },
  ];

  const handleRowClick = () => {
    // Open details modal
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Facturation Liée à la Paie</h1>
        <p className="text-muted-foreground">
          Alignement facturation ↔ paie, identification des écarts, analyse de
          rentabilité par mission
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">
            Total heures payées
          </Label>
          <p className="text-2xl font-bold">
            {invoicesWithPayroll.reduce(
              (sum, inv) => sum + (inv.payrollAlignment?.hoursPaid || 0),
              0,
            )}{" "}
            h
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">
            Total heures facturables
          </Label>
          <p className="text-2xl font-bold">
            {invoicesWithPayroll.reduce(
              (sum, inv) => sum + (inv.payrollAlignment?.hoursBillable || 0),
              0,
            )}{" "}
            h
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <Label className="text-sm text-muted-foreground">
            Rentabilité moyenne
          </Label>
          <p className="text-2xl font-bold text-green-600">
            {invoicesWithPayroll.length > 0
              ? (
                  invoicesWithPayroll.reduce(
                    (sum, inv) =>
                      sum + (inv.payrollAlignment?.profitability || 0),
                    0,
                  ) / invoicesWithPayroll.length
                ).toFixed(1)
              : 0}
            %
          </p>
        </div>
      </div>

      <DataTable
        data={invoicesWithPayroll}
        columns={columns}
        searchKey="invoiceNumber"
        searchPlaceholder="Rechercher une facture..."
        onRowClick={handleRowClick}
      />
    </div>
  );
}
