"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, ArrowLeftRight, Wifi } from "lucide-react";
import { mockBankAccounts } from "@/data/banking-accounts";

export default function BankingDashboard() {
  const totalBalance = mockBankAccounts.reduce((acc, a) => acc + a.balance, 0);
  const connectedAccounts = mockBankAccounts.filter((a) => a.apiConnected).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Banque</h1>
        <p className="text-muted-foreground">
          Gestion des comptes bancaires et flux financiers
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comptes Bancaires
            </CardTitle>
            <Building2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockBankAccounts.length}</div>
            <p className="text-xs text-muted-foreground">Comptes configurés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Solde Total
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalBalance.toLocaleString("fr-FR")} €
            </div>
            <p className="text-xs text-muted-foreground">Trésorerie disponible</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Transactions
            </CardTitle>
            <ArrowLeftRight className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Connexion API
            </CardTitle>
            <Wifi className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {connectedAccounts}/{mockBankAccounts.length}
            </div>
            <p className="text-xs text-muted-foreground">Comptes connectés</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

