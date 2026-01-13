"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  Plus,
  Edit,
  Download,
} from "lucide-react";
import type { Employee } from "@/lib/types";

interface EmployeeSavingsTabProps {
  employee: Employee;
}

export function EmployeeSavingsTab({ employee }: EmployeeSavingsTabProps) {
  const [savings] = useState(employee.savingsPlans);

  return (
    <div className="space-y-6">
      {/* Savings Overview Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Suivi des épargnes</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              PEE et PERECO de {employee.firstName} {employee.lastName}
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle contribution
          </Button>
        </CardHeader>
      </Card>

      {/* PEE Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Plan d&apos;Épargne Entreprise (PEE)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Solde actuel</p>
                <p className="text-2xl font-bold text-green-600">
                  {savings.pee.balance.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contributions totales</p>
                <p className="text-lg font-semibold">
                  {savings.pee.contributions.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Dernière contribution</p>
                <p className="text-sm text-muted-foreground">
                  {savings.pee.lastContributionDate
                    ? savings.pee.lastContributionDate.toLocaleDateString(
                        "fr-FR",
                      )
                    : "Aucune"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Télécharger relevé
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* PERECO Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Plan d&apos;Épargne Retraite Collectif (PERECO)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-3">
              <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Solde actuel</p>
                <p className="text-2xl font-bold text-green-600">
                  {savings.pereco.balance.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contributions totales</p>
                <p className="text-lg font-semibold">
                  {savings.pereco.contributions.toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">Dernière contribution</p>
                <p className="text-sm text-muted-foreground">
                  {savings.pereco.lastContributionDate
                    ? savings.pereco.lastContributionDate.toLocaleDateString(
                        "fr-FR",
                      )
                    : "Aucune"}
                </p>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Modifier
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Télécharger relevé
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
