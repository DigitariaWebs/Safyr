"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Save, Eye } from "lucide-react";
import { mockBillingClients } from "@/data/billing-clients";
import { mockBillingInvoices } from "@/data/billing-invoices";

export default function NewInvoicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientId: "",
    clientName: "",
    period: {
      start: "",
      end: "",
    },
    planningHours: 0,
    realizedHours: 0,
    validatedHours: 0,
    normalHours: 0,
    overtimeHours: 0,
    replacements: 0,
    vatRate: 20,
    subtotal: 0,
    vatAmount: 0,
    total: 0,
  });

  const handleGenerate = () => {
    if (!formData.clientId || !formData.period.start || !formData.period.end) {
      alert("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const client = mockBillingClients.find((c) => c.id === formData.clientId);
    if (!client) return;

    const hours = {
      planningHours: formData.planningHours || 0,
      realizedHours: formData.realizedHours || 0,
      validatedHours: formData.validatedHours || 0,
    };

    const subtotal = formData.normalHours * (client.hourlyRate || 25);
    const vatAmount = (subtotal * formData.vatRate) / 100;
    const total = subtotal + vatAmount;

    setFormData({
      ...formData,
      ...hours,
      normalHours:
        formData.normalHours ||
        hours.validatedHours ||
        hours.realizedHours ||
        hours.planningHours,
      subtotal,
      vatAmount,
      total,
    });

    alert("Facture générée avec succès");
  };

  const handleSave = () => {
    const newInvoice = {
      id: `INV-${Date.now()}`,
      invoiceNumber: `FAC-${new Date().getFullYear()}-${String(mockBillingInvoices.length + 1).padStart(4, "0")}`,
      clientId: formData.clientId,
      clientName:
        mockBillingClients.find((c) => c.id === formData.clientId)?.name ||
        formData.clientName,
      period: {
        start: formData.period.start,
        end: formData.period.end,
      },
      status: "Brouillon" as const,
      planningHours: formData.planningHours,
      realizedHours: formData.realizedHours,
      validatedHours: formData.validatedHours,
      normalHours: formData.normalHours,
      overtimeHours: formData.overtimeHours,
      replacements: formData.replacements,
      subtotal: formData.subtotal,
      vatRate: formData.vatRate,
      vatAmount: formData.vatAmount,
      total: formData.total,
      previewed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    console.log("Nouvelle facture:", newInvoice);
    alert("Facture enregistrée avec succès");
    router.push("/dashboard/billing/invoices");
  };

  const handlePreview = () => {
    alert("Aperçu de la facture (à implémenter)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/dashboard/billing/invoices")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nouvelle Facture</h1>
            <p className="text-muted-foreground">
              Création d&apos;une nouvelle facture client
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Aperçu
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informations Client</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="clientId">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => {
                    const client = mockBillingClients.find(
                      (c) => c.id === value,
                    );
                    setFormData({
                      ...formData,
                      clientId: value,
                      clientName: client?.name || "",
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un client" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockBillingClients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name} - {client.siret}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="periodStart">Date début période *</Label>
                <Input
                  id="periodStart"
                  type="date"
                  value={formData.period.start}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period: {
                        ...formData.period,
                        start: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="periodEnd">Date fin période *</Label>
                <Input
                  id="periodEnd"
                  type="date"
                  value={formData.period.end}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      period: {
                        ...formData.period,
                        end: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sources de données</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="planningHours">
                  Heures planifiées (Planning)
                </Label>
                <HoursInput
                  value={formData.planningHours}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      planningHours: value,
                    })
                  }
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis le module Planning
                </p>
              </div>

              <div>
                <Label htmlFor="realizedHours">
                  Heures réalisées (Géoloc/Main courante)
                </Label>
                <HoursInput
                  value={formData.realizedHours}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      realizedHours: value,
                    })
                  }
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis Géolocalisation et Main Courante
                </p>
              </div>

              <div>
                <Label htmlFor="validatedHours">Heures validées (Paie)</Label>
                <HoursInput
                  value={formData.validatedHours}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      validatedHours: value,
                    })
                  }
                  step={0.5}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Depuis le module Paie
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Information :</strong> Les heures sont automatiquement
                importées depuis les modules Planning, Géolocalisation, Main
                Courante et Paie. Vous pouvez les modifier manuellement si
                nécessaire.
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <Button onClick={handleGenerate} variant="secondary">
                Générer les montants
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Détails de facturation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="normalHours">Heures normales</Label>
                <HoursInput
                  value={formData.normalHours}
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
                  value={formData.overtimeHours}
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
                  value={formData.replacements}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      replacements: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="vatRate">Taux de TVA (%)</Label>
                <Select
                  value={String(formData.vatRate)}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      vatRate: parseFloat(value),
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20">20%</SelectItem>
                    <SelectItem value="10">10%</SelectItem>
                    <SelectItem value="0">0%</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Montants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sous-total HT</span>
                <span className="text-lg font-semibold">
                  {formData.subtotal.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  TVA ({formData.vatRate}%)
                </span>
                <span className="text-lg font-semibold">
                  {formData.vatAmount.toLocaleString("fr-FR")} €
                </span>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-bold">Total TTC</span>
                  <span className="text-2xl font-bold text-primary">
                    {formData.total.toLocaleString("fr-FR")} €
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
