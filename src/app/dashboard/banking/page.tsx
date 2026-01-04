"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import {
  TrendingUp,
  ArrowLeftRight,
  DollarSign,
  CreditCard,
  Receipt,
} from "lucide-react";
import { mockBankAccounts } from "@/data/banking-accounts";
import { mockBankingTransactions } from "@/data/banking-transactions";
import { Badge } from "@/components/ui/badge";

export default function BankingDashboard() {
  const totalBalance = mockBankAccounts.reduce((acc, a) => acc + a.balance, 0);

  // Calculate current month transactions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTransactions = mockBankingTransactions.filter((t) => {
    const date = new Date(t.date);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  });

  const totalExpenses = monthlyTransactions
    .filter((t) => t.type === "debit")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalRevenues = monthlyTransactions
    .filter((t) => t.type === "credit")
    .reduce((acc, t) => acc + t.amount, 0);

  const recentTransactions = mockBankingTransactions.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Banque</h1>
        <p className="text-muted-foreground">
          Gestion des comptes bancaires et flux financiers
        </p>
      </div>

      <InfoCardContainer>
        <InfoCard
          icon={DollarSign}
          title="Trésorerie"
          value={`${totalBalance.toLocaleString("fr-FR")} €`}
          subtext="Solde total disponible"
          color="blue"
        />

        <InfoCard
          icon={TrendingUp}
          title="Recettes du mois"
          value={`+${totalRevenues.toLocaleString("fr-FR")} €`}
          subtext="Entrées ce mois"
          color="green"
        />

        <InfoCard
          icon={CreditCard}
          title="Dépenses du mois"
          value={`-${totalExpenses.toLocaleString("fr-FR")} €`}
          subtext="Sorties ce mois"
          color="red"
        />

        <InfoCard
          icon={ArrowLeftRight}
          title="Transactions"
          value={monthlyTransactions.length}
          subtext="Ce mois"
          color="orange"
        />
      </InfoCardContainer>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Dernières transactions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {transaction.description}
                    </span>
                    <Badge
                      variant={
                        transaction.type === "credit" ? "default" : "secondary"
                      }
                    >
                      {transaction.type === "credit" ? "Crédit" : "Débit"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString("fr-FR")}
                    {transaction.reference && ` • ${transaction.reference}`}
                  </p>
                </div>
                <div
                  className={`text-right font-medium ${
                    transaction.type === "credit"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {transaction.type === "credit" ? "+" : "-"}
                  {transaction.amount.toLocaleString("fr-FR")} €
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
