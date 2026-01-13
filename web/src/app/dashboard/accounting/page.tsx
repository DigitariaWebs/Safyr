"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  DollarSign,
  Calculator,
  AlertTriangle,
  Download,
  Receipt,
} from "lucide-react";
import { mockBankAccounts } from "@/data/banking-accounts";
import { mockBillingInvoices } from "@/data/billing-invoices";

export default function AccountingDashboard() {
  // Current treasury
  const currentTreasury = mockBankAccounts.reduce(
    (acc, a) => acc + a.balance,
    0,
  );

  // Turnover calculations
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyInvoices = mockBillingInvoices.filter((inv) => {
    const invDate = new Date(inv.issuedAt || inv.createdAt);
    return (
      invDate.getMonth() === currentMonth &&
      invDate.getFullYear() === currentYear &&
      inv.status === "Payée"
    );
  });
  const monthlyTurnover = monthlyInvoices.reduce(
    (acc, inv) => acc + inv.total,
    0,
  );

  const yearlyInvoices = mockBillingInvoices.filter((inv) => {
    const invDate = new Date(inv.issuedAt || inv.createdAt);
    return invDate.getFullYear() === currentYear && inv.status === "Payée";
  });
  const yearlyTurnover = yearlyInvoices.reduce(
    (acc, inv) => acc + inv.total,
    0,
  );

  // Estimated result (simple: revenues - estimated expenses)
  // Mock expenses as 70% of revenues
  const estimatedExpenses = yearlyTurnover * 0.7;
  const estimatedResult = yearlyTurnover - estimatedExpenses;

  // VAT calculations
  const vatCollected = yearlyInvoices.reduce(
    (acc, inv) => acc + inv.vatAmount,
    0,
  );
  const vatDeductible = vatCollected * 0.3; // Mock deductible VAT
  const vatToPay = vatCollected - vatDeductible;

  // VAT deadline (mock: 20th of next month)
  const vatDeadline = new Date(currentYear, currentMonth + 1, 20);

  // Overdue invoices
  const overdueInvoices = mockBillingInvoices.filter((inv) => {
    if (!inv.paymentDueDate || inv.status === "Payée") return false;
    const dueDate = new Date(inv.paymentDueDate);
    return dueDate < new Date();
  }).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Comptabilité</h1>
        <p className="text-muted-foreground">Gestion comptable et financière</p>
      </div>

      <InfoCardContainer>
        <InfoCard
          icon={DollarSign}
          title="Trésorerie actuelle"
          value={`${currentTreasury.toLocaleString("fr-FR")} €`}
          subtext="Disponible"
          color="blue"
        />

        <InfoCard
          icon={TrendingUp}
          title="Chiffre d'affaires"
          value={`${monthlyTurnover.toLocaleString("fr-FR")} €`}
          subtext={`Ce mois • ${yearlyTurnover.toLocaleString("fr-FR")} € annuel`}
          color="green"
        />

        <InfoCard
          icon={Calculator}
          title="Résultat estimé instantané"
          value={`${estimatedResult >= 0 ? "+" : ""}${estimatedResult.toLocaleString("fr-FR")} €`}
          subtext="Estimation annuelle"
          color="purple"
        />

        <InfoCard
          icon={AlertTriangle}
          title="Factures en retard"
          value={overdueInvoices}
          subtext="À relancer"
          color="red"
        />
      </InfoCardContainer>

      {/* VAT Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              TVA (Taxe sur la Valeur Ajoutée)
            </div>
            <Button variant="outline" size="sm">
              <Calculator className="h-4 w-4 mr-2" />
              Préparer la TVA
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Collectée</span>
                <span className="font-medium text-green-600">
                  +{vatCollected.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Déductible
                </span>
                <span className="font-medium text-blue-600">
                  -{vatDeductible.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">À payer</span>
                <span className="font-bold text-orange-600">
                  {vatToPay.toLocaleString("fr-FR")} €
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Échéance</span>
                <Badge variant="outline">
                  {vatDeadline.toLocaleDateString("fr-FR")}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Statut</span>
                <Badge variant="secondary">En attente</Badge>
              </div>
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Générer FEC
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
