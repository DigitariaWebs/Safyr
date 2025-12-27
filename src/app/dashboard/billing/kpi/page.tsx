"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Chiffre d&apos;affaires Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalRevenue.toLocaleString("fr-FR")} €
            </div>
            <p className="text-xs text-muted-foreground">TTC</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heures Facturées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHoursBilled} h</div>
            <p className="text-xs text-muted-foreground">
              vs {totalHoursRealized} h réalisées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux d&apos;écart
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                varianceRate >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {varianceRate >= 0 ? "+" : ""}
              {varianceRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Planning / Facturation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Factures Envoyées
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                invoices.filter(
                  (inv) => inv.status === "Envoyée" || inv.status === "Payée",
                ).length
              }
            </div>
            <p className="text-xs text-muted-foreground">
              sur {invoices.length}
            </p>
          </CardContent>
        </Card>
      </div>

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
