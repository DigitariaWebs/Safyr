"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileText,
  CreditCard,
  Wallet,
  Receipt,
  Building2,
  MoreHorizontal,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { AccountingJournal, mockAccountingJournals } from "@/data/accounting-journals";

export default function AccountingJournalsPage() {
  const router = useRouter();
  const [journals] = useState<AccountingJournal[]>(mockAccountingJournals);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const getJournalIcon = (type: AccountingJournal["type"]) => {
    switch (type) {
      case "Achats":
        return Receipt;
      case "Ventes":
        return FileText;
      case "Banque":
        return CreditCard;
      case "Société":
        return Building2;
      default:
        return Wallet;
    }
  };

  const getJournalColor = (type: AccountingJournal["type"]) => {
    switch (type) {
      case "Achats":
        return "orange";
      case "Ventes":
        return "green";
      case "Banque":
        return "blue";
      case "Société":
        return "purple";
      default:
        return "slate";
    }
  };

  const totalEntries = journals.reduce((sum, j) => sum + j.entriesCount, 0);
  const totalDebit = journals.reduce((sum, j) => sum + j.totalDebit, 0);
  const totalCredit = journals.reduce((sum, j) => sum + j.totalCredit, 0);

  const handleViewEntries = (journal: AccountingJournal) => {
    // Navigate to entries page with journal filter
    router.push(`/dashboard/accounting/entries?journal=${journal.code}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Journaux Comptables</h1>
          <p className="text-muted-foreground">
            Vue d&apos;ensemble des journaux
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Écritures</CardDescription>
            <CardTitle className="text-2xl font-light">{totalEntries}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              écritures dans tous les journaux
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Débit</CardDescription>
            <CardTitle className="text-2xl font-light text-red-400">
              {formatCurrency(totalDebit)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingDown className="h-4 w-4 text-red-400" />
              Somme des débits
            </div>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardDescription>Total Crédit</CardDescription>
            <CardTitle className="text-2xl font-light text-green-400">
              {formatCurrency(totalCredit)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Somme des crédits
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Journals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {journals.map((journal) => {
          const Icon = getJournalIcon(journal.type);
          const color = getJournalColor(journal.type);
          const isBalanced = Math.abs(journal.totalDebit - journal.totalCredit) < 0.01;

          return (
            <Card
              key={journal.id}
              className="glass-card hover:border-cyan-500/50 transition-colors cursor-pointer"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-${color}-500/20`}>
                      <Icon className={`h-5 w-5 text-${color}-400`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{journal.code}</CardTitle>
                      <CardDescription>{journal.label}</CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewEntries(journal)}>
                        Voir les écritures
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Type</span>
                    <Badge variant="outline">{journal.type}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Écritures</span>
                    <span className="font-medium">{journal.entriesCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Dernière date</span>
                    <span className="font-medium">
                      {new Date(journal.lastEntryDate).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Solde: </span>
                      {isBalanced ? (
                        <span className="text-green-400 flex items-center gap-1 inline-flex">
                          <Minus className="h-3 w-3" />
                          Équilibré
                        </span>
                      ) : (
                        <span className="text-red-400">
                          {formatCurrency(journal.totalDebit - journal.totalCredit)}
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-cyan-400 hover:text-cyan-300"
                      onClick={() => handleViewEntries(journal)}
                    >
                      Voir
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
