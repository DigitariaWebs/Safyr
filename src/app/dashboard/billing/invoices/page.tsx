"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoursInput } from "@/components/ui/hours-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Send, CheckCircle } from "lucide-react";
import { mockBillingInvoices, BillingInvoice } from "@/data/billing-invoices";
import { mockBillingClients } from "@/data/billing-clients";

export default function BillingInvoicesPage() {
  const [invoices, setInvoices] =
    useState<BillingInvoice[]>(mockBillingInvoices);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<BillingInvoice | null>(
    null,
  );
  const [formData, setFormData] = useState<Partial<BillingInvoice>>({});

  const columns: ColumnDef<BillingInvoice>[] = [
    {
      key: "invoiceNumber",
      label: "N° Facture",
      sortable: true,
    },
    {
      key: "clientName",
      label: "Client",
      sortable: true,
    },
    {
      key: "period",
      label: "Période",
      render: (invoice) => (
        <span className="text-sm">
          {new Date(invoice.period.start).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
          })}{" "}
          -{" "}
          {new Date(invoice.period.end).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
          })}
        </span>
      ),
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
      key: "status",
      label: "Statut",
      render: (invoice) => {
        const variants: Record<
          string,
          "default" | "secondary" | "outline" | "destructive"
        > = {
          Payée: "default",
          Envoyée: "secondary",
          Validée: "secondary",
          "En attente": "outline",
          Brouillon: "outline",
          Annulée: "destructive",
        };
        return (
          <Badge variant={variants[invoice.status] || "outline"}>
            {invoice.status}
          </Badge>
        );
      },
    },
    {
      key: "validatedHours",
      label: "Heures",
      render: (invoice) => (
        <span className="text-sm">
          {invoice.validatedHours ||
            invoice.realizedHours ||
            invoice.planningHours ||
            0}{" "}
          h
        </span>
      ),
    },
  ];

  const handleCreate = () => {
    setFormData({
      status: "Brouillon",
      vatRate: 20,
      normalHours: 0,
      overtimeHours: 0,
      replacements: 0,
      subtotal: 0,
      vatAmount: 0,
      total: 0,
      previewed: false,
    });
    setIsCreateModalOpen(true);
  };

  const handleGenerate = () => {
    // Simulation de génération automatique
    const client = mockBillingClients.find((c) => c.id === formData.clientId);
    if (!client) return;

    const hours =
      formData.validatedHours ||
      formData.realizedHours ||
      formData.planningHours ||
      0;
    const subtotal = hours * client.hourlyRate;
    const vatAmount = (subtotal * (formData.vatRate || 20)) / 100;
    const total = subtotal + vatAmount;

    setFormData({
      ...formData,
      subtotal,
      vatAmount,
      total,
      normalHours: hours,
    });
  };

  const handleSave = () => {
    if (formData.id) {
      setInvoices(
        invoices.map((i) => (i.id === formData.id ? { ...i, ...formData } : i)),
      );
    } else {
      const newInvoice: BillingInvoice = {
        id: (invoices.length + 1).toString(),
        invoiceNumber: `FAC-2024-${String(invoices.length + 1).padStart(3, "0")}`,
        clientId: formData.clientId || "",
        clientName:
          mockBillingClients.find((c) => c.id === formData.clientId)?.name ||
          "",
        period: formData.period || {
          start: new Date().toISOString().split("T")[0],
          end: new Date().toISOString().split("T")[0],
        },
        status: formData.status || "Brouillon",
        planningHours: formData.planningHours,
        realizedHours: formData.realizedHours,
        validatedHours: formData.validatedHours,
        normalHours: formData.normalHours || 0,
        overtimeHours: formData.overtimeHours || 0,
        replacements: formData.replacements || 0,
        subtotal: formData.subtotal || 0,
        vatRate: formData.vatRate || 20,
        vatAmount: formData.vatAmount || 0,
        total: formData.total || 0,
        previewed: formData.previewed || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setInvoices([...invoices, newInvoice]);
    }
    setIsCreateModalOpen(false);
    setFormData({});
  };

  const handleRowClick = (invoice: BillingInvoice) => {
    setSelectedInvoice(invoice);
    setIsViewModalOpen(true);
  };

  const handlePreview = (invoice: BillingInvoice) => {
    setSelectedInvoice(invoice);
    setIsPreviewModalOpen(true);
  };

  const handleValidate = (invoice: BillingInvoice) => {
    setInvoices(
      invoices.map((i) =>
        i.id === invoice.id
          ? {
              ...i,
              status: "Validée" as const,
              validatedBy: "Admin",
              validatedAt: new Date().toISOString(),
              previewed: true,
            }
          : i,
      ),
    );
  };

  const handleSend = (invoice: BillingInvoice) => {
    setInvoices(
      invoices.map((i) =>
        i.id === invoice.id
          ? {
              ...i,
              status: "Envoyée" as const,
              issuedAt: new Date().toISOString(),
              sentAt: new Date().toISOString(),
            }
          : i,
      ),
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            Génération Automatique des Factures
          </h1>
          <p className="text-muted-foreground">
            Création et gestion des factures à partir des données Planning,
            Géolocalisation, Paie et RH
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Facture
        </Button>
      </div>

      <DataTable
        data={invoices}
        columns={columns}
        searchKey="invoiceNumber"
        searchPlaceholder="Rechercher une facture..."
        onRowClick={handleRowClick}
        actions={(invoice) => (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(invoice);
              }}
            >
              <Eye className="h-4 w-4" />
            </Button>
            {invoice.status === "Brouillon" && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleValidate(invoice);
                }}
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            {invoice.status === "Validée" && (
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSend(invoice);
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      />

      {/* Create/Edit Modal */}
      <Modal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        type="form"
        title={formData.id ? "Modifier la facture" : "Nouvelle facture"}
        size="lg"
        actions={{
          primary: {
            label: formData.id ? "Modifier" : "Générer",
            onClick: formData.id ? handleSave : handleGenerate,
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
              <Label htmlFor="clientId">Client</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => {
                  const client = mockBillingClients.find((c) => c.id === value);
                  setFormData({
                    ...formData,
                    clientId: value,
                    clientName: client?.name,
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {mockBillingClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="periodStart">Date début période</Label>
              <Input
                id="periodStart"
                type="date"
                value={formData.period?.start || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      start: e.target.value,
                      end: formData.period?.end || e.target.value,
                    },
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="periodEnd">Date fin période</Label>
              <Input
                id="periodEnd"
                type="date"
                value={formData.period?.end || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    period: {
                      ...formData.period,
                      start: formData.period?.start || e.target.value,
                      end: e.target.value,
                    },
                  })
                }
              />
            </div>

            <div className="col-span-2 border-t pt-4">
              <Label className="text-base font-semibold mb-2 block">
                Sources de données
              </Label>
            </div>

            <div>
              <Label htmlFor="planningHours">
                Heures planifiées (Planning)
              </Label>
              <HoursInput
                value={formData.planningHours || 0}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    planningHours: value,
                  })
                }
                step={0.5}
              />
            </div>

            <div>
              <Label htmlFor="realizedHours">
                Heures réalisées (Géoloc/Main courante)
              </Label>
              <HoursInput
                value={formData.realizedHours || 0}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    realizedHours: value,
                  })
                }
                step={0.5}
              />
            </div>

            <div>
              <Label htmlFor="validatedHours">Heures validées (Paie)</Label>
              <HoursInput
                value={formData.validatedHours || 0}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    validatedHours: value,
                  })
                }
                step={0.5}
              />
            </div>

            <div className="col-span-2 border-t pt-4">
              <Label className="text-base font-semibold mb-2 block">
                Facturation
              </Label>
            </div>

            <div>
              <Label htmlFor="normalHours">Heures normales</Label>
              <HoursInput
                value={formData.normalHours || 0}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    normalHours: value,
                  })
                }
                step={0.5}
              />
            </div>

            <div>
              <Label htmlFor="overtimeHours">Heures supplémentaires</Label>
              <HoursInput
                value={formData.overtimeHours || 0}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    overtimeHours: value,
                  })
                }
                step={0.5}
              />
            </div>

            <div>
              <Label htmlFor="replacements">Remplacements</Label>
              <Input
                id="replacements"
                type="number"
                value={formData.replacements || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    replacements: parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div>
              <Label htmlFor="vatRate">Taux TVA (%)</Label>
              <Input
                id="vatRate"
                type="number"
                step="0.1"
                value={formData.vatRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vatRate: parseFloat(e.target.value) || 20,
                  })
                }
              />
            </div>

            {formData.subtotal !== undefined && formData.subtotal > 0 && (
              <>
                <div>
                  <Label>Montant HT</Label>
                  <p className="text-sm font-semibold">
                    {formData.subtotal.toLocaleString("fr-FR")} €
                  </p>
                </div>
                <div>
                  <Label>TVA</Label>
                  <p className="text-sm font-semibold">
                    {formData.vatAmount?.toLocaleString("fr-FR")} €
                  </p>
                </div>
                <div>
                  <Label>Montant TTC</Label>
                  <p className="text-lg font-bold text-green-600">
                    {formData.total?.toLocaleString("fr-FR")} €
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* View Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la facture"
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
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label>Numéro de facture</Label>
                <p className="text-sm font-mono font-semibold">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <div>
                <Label>Client</Label>
                <p className="text-sm font-medium">
                  {selectedInvoice.clientName}
                </p>
              </div>

              <div>
                <Label>Statut</Label>
                <Badge>{selectedInvoice.status}</Badge>
              </div>

              <div>
                <Label>Période</Label>
                <p className="text-sm">
                  {new Date(selectedInvoice.period.start).toLocaleDateString(
                    "fr-FR",
                  )}{" "}
                  -{" "}
                  {new Date(selectedInvoice.period.end).toLocaleDateString(
                    "fr-FR",
                  )}
                </p>
              </div>

              <div className="col-span-2 border-t pt-4">
                <Label className="text-base font-semibold mb-2 block">
                  Sources de données
                </Label>
              </div>

              {selectedInvoice.planningHours && (
                <div>
                  <Label>Heures planifiées (Planning)</Label>
                  <p className="text-sm">{selectedInvoice.planningHours} h</p>
                </div>
              )}

              {selectedInvoice.realizedHours && (
                <div>
                  <Label>Heures réalisées (Géoloc/Main courante)</Label>
                  <p className="text-sm">{selectedInvoice.realizedHours} h</p>
                </div>
              )}

              {selectedInvoice.validatedHours && (
                <div>
                  <Label>Heures validées (Paie)</Label>
                  <p className="text-sm">{selectedInvoice.validatedHours} h</p>
                </div>
              )}

              {selectedInvoice.variance && (
                <div>
                  <Label>Écart (prévu/réalisé)</Label>
                  <p
                    className={`text-sm font-semibold ${
                      selectedInvoice.variance.difference >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedInvoice.variance.difference > 0 ? "+" : ""}
                    {selectedInvoice.variance.difference} h
                  </p>
                </div>
              )}

              <div className="col-span-2 border-t pt-4">
                <Label className="text-base font-semibold mb-2 block">
                  Détails de facturation
                </Label>
              </div>

              <div>
                <Label>Heures normales</Label>
                <p className="text-sm">{selectedInvoice.normalHours} h</p>
              </div>

              <div>
                <Label>Heures supplémentaires</Label>
                <p className="text-sm">{selectedInvoice.overtimeHours} h</p>
              </div>

              <div>
                <Label>Remplacements</Label>
                <p className="text-sm">{selectedInvoice.replacements}</p>
              </div>

              <div>
                <Label>Montant HT</Label>
                <p className="text-sm font-semibold">
                  {selectedInvoice.subtotal.toLocaleString("fr-FR")} €
                </p>
              </div>

              <div>
                <Label>TVA ({selectedInvoice.vatRate}%</Label>
                <p className="text-sm font-semibold">
                  {selectedInvoice.vatAmount.toLocaleString("fr-FR")} €
                </p>
              </div>

              <div className="col-span-2">
                <Label>Montant TTC</Label>
                <p className="text-2xl font-bold text-green-600">
                  {selectedInvoice.total.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Preview Modal */}
      <Modal
        open={isPreviewModalOpen}
        onOpenChange={setIsPreviewModalOpen}
        type="details"
        title="Prévisualisation de la facture"
        size="lg"
        actions={{
          primary: {
            label: "Valider",
            onClick: () => {
              if (selectedInvoice) handleValidate(selectedInvoice);
              setIsPreviewModalOpen(false);
            },
          },
          secondary: {
            label: "Fermer",
            onClick: () => setIsPreviewModalOpen(false),
          },
        }}
      >
        {selectedInvoice && (
          <div className="space-y-4">
            <div className="border rounded-lg p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">FACTURE</h2>
                <p className="text-sm text-muted-foreground">
                  {selectedInvoice.invoiceNumber}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold mb-2">Client</h3>
                  <p className="text-sm">{selectedInvoice.clientName}</p>
                  {selectedInvoice.siteName && (
                    <p className="text-sm text-muted-foreground">
                      {selectedInvoice.siteName}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    <strong>Date:</strong>{" "}
                    {selectedInvoice.issuedAt
                      ? new Date(selectedInvoice.issuedAt).toLocaleDateString(
                          "fr-FR",
                        )
                      : new Date().toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-sm">
                    <strong>Période:</strong>{" "}
                    {new Date(selectedInvoice.period.start).toLocaleDateString(
                      "fr-FR",
                    )}{" "}
                    -{" "}
                    {new Date(selectedInvoice.period.end).toLocaleDateString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Description</th>
                      <th className="text-right py-2">Quantité</th>
                      <th className="text-right py-2">Prix unitaire</th>
                      <th className="text-right py-2">Total HT</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-2">Heures normales</td>
                      <td className="text-right py-2">
                        {selectedInvoice.normalHours} h
                      </td>
                      <td className="text-right py-2">-</td>
                      <td className="text-right py-2">
                        {selectedInvoice.subtotal.toLocaleString("fr-FR")} €
                      </td>
                    </tr>
                    {selectedInvoice.overtimeHours > 0 && (
                      <tr>
                        <td className="py-2">Heures supplémentaires</td>
                        <td className="text-right py-2">
                          {selectedInvoice.overtimeHours} h
                        </td>
                        <td className="text-right py-2">-</td>
                        <td className="text-right py-2">-</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-end">
                  <div className="w-64 space-y-2">
                    <div className="flex justify-between">
                      <span>Total HT:</span>
                      <span>
                        {selectedInvoice.subtotal.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>TVA ({selectedInvoice.vatRate}%):</span>
                      <span>
                        {selectedInvoice.vatAmount.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total TTC:</span>
                      <span>
                        {selectedInvoice.total.toLocaleString("fr-FR")} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
