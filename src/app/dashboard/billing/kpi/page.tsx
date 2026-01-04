"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import {
  Download,
  DollarSign,
  Clock,
  TrendingUp,
  FileText,
} from "lucide-react";
import { mockBillingInvoices } from "@/data/billing-invoices";
import { mockBillingClients } from "@/data/billing-clients";

export default function BillingKPIPage() {
  const invoices = mockBillingInvoices;
  const clients = mockBillingClients;

  // Calculate KPIs
  const totalRevenue = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const revenueByClient = invoices.reduce(
    (acc, inv) => {
      acc[inv.clientId] = (acc[inv.clientId] || 0) + inv.total;
      return acc;
    },
    {} as Record<string, number>,
  );

  const revenueBySite = invoices.reduce(
    (acc, inv) => {
      if (inv.siteId) {
        acc[inv.siteId] = (acc[inv.siteId] || 0) + inv.total;
      }
      return acc;
    },
    {} as Record<string, number>,
  );

  const totalHoursBilled = invoices.reduce(
    (sum, inv) =>
      sum + (inv.validatedHours || inv.realizedHours || inv.planningHours || 0),
    0,
  );
  const totalHoursRealized = invoices.reduce(
    (sum, inv) => sum + (inv.realizedHours || inv.planningHours || 0),
    0,
  );

  const varianceRate =
    totalHoursRealized > 0
      ? ((totalHoursBilled - totalHoursRealized) / totalHoursRealized) * 100
      : 0;

  const handleExport = () => {
    alert("Export Excel/PDF en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Dashboard & KPI Facturation</h1>
          <p className="text-muted-foreground">
            Indicateurs clés de performance, analyses et graphiques dynamiques
          </p>
        </div>
        <Button variant="outline" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Exporter (Excel/PDF)
        </Button>
      </div>

      {/* KPI Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={DollarSign}
          title="Chiffre d'affaires Total"
          value={`${totalRevenue.toLocaleString("fr-FR")} €`}
          subtext="TTC"
          color="green"
        />

        <InfoCard
          icon={Clock}
          title="Heures Facturées"
          value={`${totalHoursBilled} h`}
          subtext={`vs ${totalHoursRealized} h réalisées`}
          color="blue"
        />

        <InfoCard
          icon={TrendingUp}
          title="Taux d'écart"
          value={`${varianceRate >= 0 ? "+" : ""}${varianceRate.toFixed(1)}%`}
          subtext="Planning / Facturation"
          color="purple"
        />

        <InfoCard
          icon={FileText}
          title="Factures Envoyées"
          value={
            invoices.filter(
              (inv) => inv.status === "Envoyée" || inv.status === "Payée",
            ).length
          }
          subtext={`sur ${invoices.length}`}
          color="orange"
        />
      </InfoCardContainer>

      {/* Revenue by Client */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d&apos;affaires par Client</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(revenueByClient).map(([clientId, revenue]) => {
              const client = clients.find((c) => c.id === clientId);
              return (
                <div
                  key={clientId}
                  className="flex justify-between items-center"
                >
                  <span className="text-sm">{client?.name || clientId}</span>
                  <span className="text-sm font-semibold">
                    {revenue.toLocaleString("fr-FR")} €
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Revenue by Site */}
      {Object.keys(revenueBySite).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Chiffre d&apos;affaires par Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(revenueBySite).map(([siteId, revenue]) => {
                const invoice = invoices.find((inv) => inv.siteId === siteId);
                return (
                  <div
                    key={siteId}
                    className="flex justify-between items-center"
                  >
                    <span className="text-sm">
                      {invoice?.siteName || siteId}
                    </span>
                    <span className="text-sm font-semibold">
                      {revenue.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue by Service Type */}
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d&apos;affaires par Prestation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(
              clients.reduce(
                (acc, client) => {
                  const clientInvoices = invoices.filter(
                    (inv) => inv.clientId === client.id,
                  );
                  const clientRevenue = clientInvoices.reduce(
                    (sum, inv) => sum + inv.total,
                    0,
                  );
                  if (clientRevenue > 0) {
                    // Support multiple service types per client (serviceTypes array).
                    // Fall back to single serviceType for backward compatibility.
                    const types =
                      client.serviceTypes && client.serviceTypes.length > 0
                        ? client.serviceTypes
                        : client.serviceType
                          ? [client.serviceType]
                          : [];
                    types.forEach((t) => {
                      acc[t] = (acc[t] || 0) + clientRevenue;
                    });
                  }
                  return acc;
                },
                {} as Record<string, number>,
              ),
            ).map(([serviceType, revenue]) => (
              <div
                key={serviceType}
                className="flex justify-between items-center"
              >
                <span className="text-sm">{serviceType}</span>
                <span className="text-sm font-semibold">
                  {revenue.toLocaleString("fr-FR")} €
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
