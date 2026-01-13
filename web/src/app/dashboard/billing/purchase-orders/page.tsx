"use client";

import { DataTable } from "@/components/ui/DataTable";

interface PurchaseOrder {
  number: string;
  subcontractor: string;
  amount: number;
  status: string;
}

export default function BillingPurchaseOrdersPage() {
  const data: PurchaseOrder[] = []; // Placeholder for purchase orders data
  const columns = [
    {
      key: "number",
      label: "N° Bon de commande",
      sortable: true,
    },
    {
      key: "subcontractor",
      label: "Sous-traitant",
    },
    {
      key: "amount",
      label: "Montant",
    },
    {
      key: "status",
      label: "Statut",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestion des Bons de commande</h1>
        <p className="text-muted-foreground">
          Bons de commande pour les sous-traitants
        </p>
      </div>

      <DataTable
        data={data}
        columns={columns}
        searchKey="number"
        searchPlaceholder="Rechercher un bon de commande..."
      />
    </div>
  );
}
