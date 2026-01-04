"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  FileText,
  FilePlus,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  Send,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { mockBillingClients } from "@/data/billing-clients";
import { mockBillingInvoices } from "@/data/billing-invoices";
import Link from "next/link";

export default function BillingDashboard() {
  const activeClients = mockBillingClients.filter(
    (c) => c.status === "Actif",
  ).length;
  const totalSites = mockBillingClients.reduce((acc, c) => acc + c.sites, 0);

  // Calculate real metrics from invoices
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const invoicesThisMonth = mockBillingInvoices.filter((inv) => {
    const invDate = new Date(inv.createdAt);
    return (
      invDate.getMonth() === currentMonth &&
      invDate.getFullYear() === currentYear
    );
  });

  const totalRevenueThisMonth = invoicesThisMonth.reduce(
    (sum, inv) => sum + inv.total,
    0,
  );
  const totalRevenue = mockBillingInvoices.reduce(
    (sum, inv) => sum + inv.total,
    0,
  );

  const pendingInvoices = mockBillingInvoices.filter(
    (inv) => inv.status === "Brouillon" || inv.status === "En attente",
  ).length;

  const sentInvoices = mockBillingInvoices.filter(
    (inv) => inv.status === "Envoyée" || inv.status === "Payée",
  ).length;

  const totalHoursBilled = mockBillingInvoices.reduce(
    (sum, inv) =>
      sum + (inv.validatedHours || inv.realizedHours || inv.planningHours || 0),
    0,
  );

  // Recent invoices
  const recentInvoices = [...mockBillingInvoices]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5);

  // Calculate average margin (simplified)
  const averageMargin = 15.5; // This would be calculated from payroll costs vs billing

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Facturation</h1>
        <p className="text-muted-foreground">
          Vue d&apos;ensemble de la facturation et des contrats clients
        </p>
      </div>

      {/* KPI Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Users}
          title="Clients Actifs"
          value={activeClients}
          subtext={`${totalSites} sites au total`}
          color="green"
        />

        <InfoCard
          icon={FileText}
          title="Factures ce mois"
          value={invoicesThisMonth.length}
          subtext={`${pendingInvoices} en attente`}
          color="blue"
        />

        <InfoCard
          icon={DollarSign}
          title="CA Ce Mois"
          value={`${totalRevenueThisMonth.toLocaleString("fr-FR")} €`}
          subtext={`${totalRevenue.toLocaleString("fr-FR")} € total`}
          color="orange"
        />

        <InfoCard
          icon={TrendingUp}
          title="Marge Moyenne"
          value={`${averageMargin}%`}
          subtext={`${totalHoursBilled} h facturées`}
          color="green"
        />
      </InfoCardContainer>

      {/* Status Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Clock}
          title="En Attente"
          value={pendingInvoices}
          subtext="Factures à traiter"
          color="orange"
        />

        <InfoCard
          icon={CheckCircle}
          title="Validées"
          value={
            mockBillingInvoices.filter((inv) => inv.status === "Validée").length
          }
          subtext="Prêtes à envoyer"
          color="blue"
        />

        <InfoCard
          icon={Send}
          title="Envoyées"
          value={sentInvoices}
          subtext="En attente de paiement"
          color="green"
        />

        <InfoCard
          icon={CheckCircle}
          title="Payées"
          value={
            mockBillingInvoices.filter((inv) => inv.status === "Payée").length
          }
          subtext="Factures réglées"
          color="green"
        />
      </InfoCardContainer>

      {/* Recent Invoices */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Factures Récentes</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/billing/invoices">Voir tout</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {recentInvoices.length > 0 ? (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => {
                const statusVariants: Record<
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
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          {invoice.invoiceNumber}
                        </span>
                        <Badge
                          variant={statusVariants[invoice.status] || "outline"}
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {invoice.clientName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">
                        {invoice.total.toLocaleString("fr-FR")} €
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(invoice.createdAt).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aucune facture récente
            </p>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/billing/invoices">
                  <FileText className="h-4 w-4 mr-2" />
                  Générer une facture
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/billing/clients">
                  <Users className="h-4 w-4 mr-2" />
                  Ajouter un client
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/billing/quotes">
                  <FilePlus className="h-4 w-4 mr-2" />
                  Nouveau devis
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/billing/services">
                  <Receipt className="h-4 w-4 mr-2" />
                  Services
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/dashboard/billing/kpi">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Voir les KPI
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingInvoices > 0 && (
                <div className="flex items-center gap-2 p-2 bg-orange-50 dark:bg-orange-950 rounded">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">
                    {pendingInvoices} facture{pendingInvoices > 1 ? "s" : ""} en
                    attente de validation
                  </span>
                </div>
              )}
              {mockBillingInvoices.filter(
                (inv) => !inv.sentAt && inv.status === "Validée",
              ).length > 0 && (
                <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded">
                  <Send className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">
                    {
                      mockBillingInvoices.filter(
                        (inv) => !inv.sentAt && inv.status === "Validée",
                      ).length
                    }{" "}
                    facture(s) validée(s) à envoyer
                  </span>
                </div>
              )}
              {pendingInvoices === 0 &&
                mockBillingInvoices.filter(
                  (inv) => !inv.sentAt && inv.status === "Validée",
                ).length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Aucune alerte
                  </p>
                )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
