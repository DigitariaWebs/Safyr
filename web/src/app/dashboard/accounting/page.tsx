"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TrendingUp,
  DollarSign,
  Calculator,
  AlertTriangle,
  Download,
  Receipt,
  Wallet,
  Percent,
  Calendar,
  BarChart3,
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

  // VAT calculations
  const vatCollected = yearlyInvoices.reduce(
    (acc, inv) => acc + inv.vatAmount,
    0,
  );
  const vatDeductible = vatCollected * 0.3;
  const vatToPay = vatCollected - vatDeductible;

  // VAT deadline
  const vatDeadline = new Date(currentYear, currentMonth + 1, 20);

  // Overdue invoices
  const overdueInvoices = mockBillingInvoices.filter((inv) => {
    if (!inv.paymentDueDate || inv.status === "Payée") return false;
    const dueDate = new Date(inv.paymentDueDate);
    return dueDate < new Date();
  }).length;

  // Extended billing stats
  const paidInvoices = mockBillingInvoices.filter((i) => i.status === "Payée");
  const pendingInvoices = mockBillingInvoices.filter(
    (i) => i.status === "Envoyée" || i.status === "En attente",
  );
  const billingStats = {
    totalRevenue: paidInvoices.reduce((sum, i) => sum + i.subtotal, 0),
    totalVAT: paidInvoices.reduce((sum, i) => sum + i.vatAmount, 0),
    pendingRevenue: pendingInvoices.reduce((sum, i) => sum + i.subtotal, 0),
    paidCount: paidInvoices.length,
    pendingCount: pendingInvoices.length,
    avgInvoiceValue:
      paidInvoices.length > 0
        ? paidInvoices.reduce((sum, i) => sum + i.subtotal, 0) /
          paidInvoices.length
        : 0,
  };

  // VAT by rate breakdown
  const vatByRate: Record<number, number> = {};
  mockBillingInvoices.forEach((inv) => {
    if (!vatByRate[inv.vatRate]) {
      vatByRate[inv.vatRate] = 0;
    }
    vatByRate[inv.vatRate] += inv.vatAmount;
  });

  // Profitability
  const profitabilityStats = {
    grossMargin: 0.18,
    netMargin: 0.08,
    estimatedProfit: billingStats.totalRevenue * 0.08,
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord Comptabilité</h1>
          <p className="text-muted-foreground">
            Gestion comptable et financière
          </p>
        </div>
        <Select defaultValue={currentYear.toString()}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentYear.toString()}>
              Année {currentYear}
            </SelectItem>
            <SelectItem value={(currentYear - 1).toString()}>
              Année {currentYear - 1}
            </SelectItem>
            <SelectItem value={(currentYear - 2).toString()}>
              Année {currentYear - 2}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main KPIs */}
      <InfoCardContainer>
        <InfoCard
          icon={DollarSign}
          title="Trésorerie actuelle"
          value={formatCurrency(currentTreasury)}
          subtext="Disponible"
          color="blue"
        />

        <InfoCard
          icon={TrendingUp}
          title="Chiffre d'affaires"
          value={formatCurrency(billingStats.totalRevenue)}
          subtext={`${billingStats.paidCount} factures payées`}
          color="green"
        />

        <InfoCard
          icon={Calculator}
          title="Résultat estimé"
          value={formatCurrency(profitabilityStats.estimatedProfit)}
          subtext={`Marge nette: ${formatPercent(profitabilityStats.netMargin)}`}
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

      {/* Revenue & Treasury Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Revenue KPIs */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-cyan-400" />
              Chiffre d&apos;Affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CA ce mois</span>
                <span className="font-medium">
                  {formatCurrency(monthlyTurnover)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CA annuel</span>
                <span className="font-medium">
                  {formatCurrency(billingStats.totalRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">En attente</span>
                <span className="font-medium text-orange-400">
                  {formatCurrency(billingStats.pendingRevenue)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Panier moyen</span>
                <span className="font-medium">
                  {formatCurrency(billingStats.avgInvoiceValue)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Treasury KPIs */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Wallet className="h-5 w-5 text-cyan-400" />
              Trésorerie
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Solde actuel</span>
                <span className="font-medium text-blue-400">
                  {formatCurrency(currentTreasury)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Comptes actifs</span>
                <span className="font-medium">
                  {mockBankAccounts.filter((a) => a.status === "Actif").length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Trésorerie J-30</span>
                <span className="font-medium">
                  {formatCurrency(currentTreasury * 0.95)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Écart prévision</span>
                <span className="font-medium text-orange-400">
                  {formatCurrency(currentTreasury * 0.05)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* VAT Section */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Percent className="h-5 w-5 text-cyan-400" />
              TVA (Taxe sur la Valeur Ajoutée)
            </div>
            <Button variant="outline" size="sm">
              <Calculator className="h-4 w-4 mr-2" />
              Préparer la TVA
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* VAT Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Collectée</span>
                <span className="font-medium text-green-400">
                  +{vatCollected.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">
                  Déductible
                </span>
                <span className="font-medium text-blue-400">
                  -{vatDeductible.toLocaleString("fr-FR")} €
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">À payer</span>
                <span className="font-bold text-orange-400">
                  {vatToPay.toLocaleString("fr-FR")} €
                </span>
              </div>
            </div>

            {/* VAT Status */}
            <div className="space-y-3">
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

            {/* VAT by Rate */}
            <div className="space-y-2">
              <span className="text-sm text-muted-foreground">Par taux</span>
              {Object.entries(vatByRate).map(([rate, amount]) => (
                <div key={rate} className="flex items-center justify-between">
                  <span className="text-sm">TVA {rate}%</span>
                  <span className="font-mono text-sm">
                    {formatCurrency(amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profitability & Actions Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Profitability */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              Rentabilité
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Marge brute</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${profitabilityStats.grossMargin * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium">
                    {formatPercent(profitabilityStats.grossMargin)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Marge nette</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-500 rounded-full"
                      style={{
                        width: `${profitabilityStats.netMargin * 100}%`,
                      }}
                    />
                  </div>
                  <span className="font-medium">
                    {formatPercent(profitabilityStats.netMargin)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-muted-foreground">Résultat estimé</span>
                <span className="font-bold text-purple-400">
                  {formatCurrency(profitabilityStats.estimatedProfit)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5 text-cyan-400" />
              Actions Rapides
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Générer FEC
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Receipt className="h-4 w-4 mr-2" />
                Déclaration TVA
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Bilan Annuel
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Relevé de Compte
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
