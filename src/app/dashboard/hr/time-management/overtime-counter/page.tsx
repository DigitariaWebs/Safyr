"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Clock, CheckCircle, AlertTriangle } from "lucide-react";

// Mock data for overtime counter
const mockOvertimeCounters = [
  {
    id: "1",
    employeeId: "1",
    employeeName: "Jean Dupont",
    employeeNumber: "EMP001",
    department: "Sécurité",
    accumulatedHours: 45.5,
    paidHours: 20,
    remainingHours: 25.5,
    lastPaymentDate: new Date("2024-11-15"),
    nextPaymentDate: new Date("2025-01-15"),
  },
  {
    id: "2",
    employeeId: "2",
    employeeName: "Marie Martin",
    employeeNumber: "EMP002",
    department: "Direction",
    accumulatedHours: 32,
    paidHours: 15,
    remainingHours: 17,
    lastPaymentDate: new Date("2024-10-30"),
    nextPaymentDate: new Date("2024-12-30"),
  },
  {
    id: "3",
    employeeId: "5",
    employeeName: "Luc Moreau",
    employeeNumber: "EMP005",
    department: "Sécurité",
    accumulatedHours: 18.5,
    paidHours: 0,
    remainingHours: 18.5,
    lastPaymentDate: null,
    nextPaymentDate: new Date("2025-02-15"),
  },
];

export default function OvertimeCounterPage() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState<
    (typeof mockOvertimeCounters)[0] | null
  >(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  const handleViewPayment = (counter: (typeof mockOvertimeCounters)[0]) => {
    setSelectedCounter(counter);
    setPaymentAmount(counter.remainingHours.toString());
    setIsPaymentModalOpen(true);
  };

  const handlePayment = () => {
    if (!selectedCounter) return;
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0 || amount > selectedCounter.remainingHours)
      return;

    console.log("Processing payment:", {
      counterId: selectedCounter.id,
      amount,
    });

    // Reset modal
    setIsPaymentModalOpen(false);
    setSelectedCounter(null);
    setPaymentAmount("");
  };

  const overtimeCounterColumns: ColumnDef<(typeof mockOvertimeCounters)[0]>[] =
    [
      {
        key: "employee",
        label: "Employé",
        sortable: true,
        render: (counter) => (
          <div className="min-w-0">
            <p className="font-semibold truncate">{counter.employeeName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {counter.employeeNumber} - {counter.department}
            </p>
          </div>
        ),
      },
      {
        key: "accumulatedHours",
        label: "Heures accumulées",
        sortable: true,
        render: (counter) => (
          <span className="font-semibold text-blue-600">
            {counter.accumulatedHours}h
          </span>
        ),
      },
      {
        key: "paidHours",
        label: "Heures payées",
        sortable: true,
        render: (counter) => (
          <span className="font-semibold text-green-600">
            {counter.paidHours}h
          </span>
        ),
      },
      {
        key: "remainingHours",
        label: "Heures restantes",
        sortable: true,
        render: (counter) => (
          <span className="font-semibold text-orange-600">
            {counter.remainingHours}h
          </span>
        ),
      },
      {
        key: "lastPaymentDate",
        label: "Dernier paiement",
        sortable: true,
        render: (counter) => (
          <span className="text-sm">
            {counter.lastPaymentDate
              ? counter.lastPaymentDate.toLocaleDateString("fr-FR")
              : "Aucun"}
          </span>
        ),
      },
      {
        key: "nextPaymentDate",
        label: "Prochain paiement",
        sortable: true,
        render: (counter) => (
          <span className="text-sm">
            {counter.nextPaymentDate.toLocaleDateString("fr-FR")}
          </span>
        ),
      },
      {
        key: "actions",
        label: "Actions",
        render: (counter) => (
          <Button
            size="sm"
            onClick={() => handleViewPayment(counter)}
            disabled={counter.remainingHours === 0}
          >
            Payer
          </Button>
        ),
      },
    ];

  const totalAccumulated = mockOvertimeCounters.reduce(
    (sum, c) => sum + c.accumulatedHours,
    0,
  );
  const totalPaid = mockOvertimeCounters.reduce(
    (sum, c) => sum + c.paidHours,
    0,
  );
  const totalRemaining = mockOvertimeCounters.reduce(
    (sum, c) => sum + c.remainingHours,
    0,
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Compteur Heures Supplémentaires
        </h1>
        <p className="text-muted-foreground">
          Suivi des heures supplémentaires accumulées pour paiement différé
        </p>
      </div>

      {/* Stats Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Clock}
          title="Total Accumulé"
          value={`${totalAccumulated}h`}
          subtext="Heures supplémentaires totales"
          color="blue"
        />

        <InfoCard
          icon={CheckCircle}
          title="Total Payé"
          value={`${totalPaid}h`}
          subtext="Déjà payées cette année"
          color="green"
        />

        <InfoCard
          icon={AlertTriangle}
          title="En Attente de Paiement"
          value={`${totalRemaining}h`}
          subtext="À payer prochainement"
          color="orange"
        />
      </InfoCardContainer>

      {/* Overtime Counter Table */}
      <Card>
        <CardHeader>
          <CardTitle>Compteurs par employé</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockOvertimeCounters}
            columns={overtimeCounterColumns}
            searchKeys={["employeeName", "employeeNumber", "department"]}
            searchPlaceholder="Rechercher par nom, numéro ou département..."
            itemsPerPage={10}
            filters={[
              {
                key: "department",
                label: "Département",
                options: [
                  { value: "all", label: "Tous les départements" },
                  { value: "Sécurité", label: "Sécurité" },
                  { value: "Direction", label: "Direction" },
                  { value: "RH", label: "RH" },
                  { value: "Commercial", label: "Commercial" },
                ],
              },
            ]}
          />
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <Modal
        open={isPaymentModalOpen}
        onOpenChange={(open) => {
          setIsPaymentModalOpen(open);
          if (!open) {
            setSelectedCounter(null);
            setPaymentAmount("");
          }
        }}
        type="form"
        title="Paiement d'heures supplémentaires"
        description={`Paiement pour ${selectedCounter?.employeeName}`}
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsPaymentModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Confirmer le paiement",
            onClick: handlePayment,
            disabled: !paymentAmount || parseFloat(paymentAmount) <= 0,
          },
        }}
      >
        {selectedCounter && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Heures restantes
                </label>
                <p className="mt-1 font-medium">
                  {selectedCounter.remainingHours}h
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Dernier paiement
                </label>
                <p className="mt-1 font-medium">
                  {selectedCounter.lastPaymentDate
                    ? selectedCounter.lastPaymentDate.toLocaleDateString(
                        "fr-FR",
                      )
                    : "Aucun"}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentAmount">
                Nombre d&apos;heures à payer{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                id="paymentAmount"
                type="number"
                min="0"
                max={selectedCounter.remainingHours}
                step="0.5"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Entrez le nombre d'heures"
              />
            </div>

            <div className="rounded-md border border-muted bg-muted/50 p-4">
              <h4 className="font-medium mb-2">💰 Résumé du paiement</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Heures à payer:</span>
                  <span className="font-semibold">{paymentAmount || 0}h</span>
                </div>
                <div className="flex justify-between">
                  <span>Heures restantes après paiement:</span>
                  <span className="font-semibold">
                    {Math.max(
                      0,
                      selectedCounter.remainingHours -
                        (parseFloat(paymentAmount) || 0),
                    )}
                    h
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
