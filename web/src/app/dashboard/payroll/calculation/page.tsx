"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { PeriodSelector, Period } from "@/components/ui/period-selector";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calculator,
  CheckCircle,
  AlertCircle,
  Clock,
  Play,
  RotateCcw,
  Lock,
  FileText,
  Send,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Euro,
} from "lucide-react";
import { mockCalculationRun } from "@/data/payroll-calculation";
import { EmployeePayrollCalculation } from "@/lib/types";

export default function PayrollCalculationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    id: "2024-12",
    month: 12,
    year: 2024,
    label: "Décembre 2024",
  });
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeePayrollCalculation | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const calculationRun = mockCalculationRun;

  const periods: Period[] = [
    { id: "2024-12", month: 12, year: 2024, label: "Décembre 2024" },
    { id: "2024-11", month: 11, year: 2024, label: "Novembre 2024" },
    { id: "2024-10", month: 10, year: 2024, label: "Octobre 2024" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "validated":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Validé
          </Badge>
        );
      case "calculated":
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            <Calculator className="w-3 h-3 mr-1" />
            Calculé
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-gray-100 text-gray-800 border-gray-200">
            <Clock className="w-3 h-3 mr-1" />
            En attente
          </Badge>
        );
      case "error":
        return (
          <Badge className="bg-red-100 text-red-800 border-red-200">
            <AlertCircle className="w-3 h-3 mr-1" />
            Erreur
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns: ColumnDef<EmployeePayrollCalculation>[] = [
    {
      key: "employeeNumber",
      label: "Matricule",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <span className="font-medium">{calc.employeeNumber}</span>
      ),
    },
    {
      key: "employeeName",
      label: "Nom",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <div>
          <div className="font-medium">{calc.employeeName}</div>
          <div className="text-sm text-muted-foreground">{calc.position}</div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => getStatusBadge(calc.status),
    },
    {
      key: "grossSalary",
      label: "Brut",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <span className="font-medium">
          {calc.grossSalary.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </span>
      ),
    },
    {
      key: "netSalary",
      label: "Net",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <span className="font-medium">
          {calc.netSalary.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </span>
      ),
    },
    {
      key: "totalEmployerContributions",
      label: "Charges patronales",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <span className="text-sm">
          {calc.totalEmployerContributions.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </span>
      ),
    },
    {
      key: "totalCost",
      label: "Coût total",
      sortable: true,
      render: (calc: EmployeePayrollCalculation) => (
        <span className="font-semibold text-primary">
          {calc.totalCost.toLocaleString("fr-FR", {
            minimumFractionDigits: 2,
          })}{" "}
          €
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (calc: EmployeePayrollCalculation) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedEmployee(calc);
              setDetailModalOpen(true);
            }}
          >
            <Eye className="w-4 h-4" />
          </Button>
          {calc.status === "calculated" && (
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  const handleRunCalculation = () => {
    console.log("Running calculation for period:", selectedPeriod);
  };

  const handleRecalculateAll = () => {
    console.log("Recalculating all employees");
  };

  const handleValidate = () => {
    console.log("Validating calculation");
  };

  const handleExportPaySlips = () => {
    console.log("Exporting pay slips");
  };

  const handleGenerateDSN = () => {
    console.log("Generating DSN");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calcul de Paie</h1>
          <p className="text-muted-foreground">
            Calculez et validez les salaires de vos employés
          </p>
        </div>
        <div className="flex items-center gap-3">
          <PeriodSelector
            periods={periods}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
          />
        </div>
      </div>

      <InfoCardContainer className="grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <InfoCard
          title="Total Employés"
          value={calculationRun.totalEmployees}
          icon={Calculator}
          color="blue"
        />
        <InfoCard
          title="Calculés"
          value={calculationRun.calculatedEmployees}
          icon={CheckCircle}
          color="green"
        />
        <InfoCard
          title="En Attente"
          value={calculationRun.pendingEmployees}
          icon={Clock}
          color="yellow"
        />
        <InfoCard
          title="Erreurs"
          value={calculationRun.errorEmployees}
          icon={AlertCircle}
          color="red"
        />
        <InfoCard
          title="Validés"
          value={calculationRun.validatedEmployees}
          icon={Lock}
          color="blue"
        />
      </InfoCardContainer>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Euro className="w-4 h-4" />
              Masse Salariale Brute
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {calculationRun.totalGrossSalary.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Total Net à Payer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {calculationRun.totalNetSalary.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Charges Patronales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {calculationRun.totalEmployerContributions.toLocaleString(
                "fr-FR",
                {
                  minimumFractionDigits: 2,
                },
              )}{" "}
              €
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Calculator className="w-4 h-4" />
              Coût Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {calculationRun.totalCost.toLocaleString("fr-FR", {
                minimumFractionDigits: 2,
              })}{" "}
              €
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Calculs Paie</CardTitle>
            <div className="flex items-center gap-2">
              {calculationRun.pendingEmployees > 0 && (
                <Button onClick={handleRunCalculation}>
                  <Play className="w-4 h-4 mr-2" />
                  Calculer ({calculationRun.pendingEmployees})
                </Button>
              )}
              <Button variant="outline" onClick={handleRecalculateAll}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Recalculer tout
              </Button>
              {calculationRun.calculatedEmployees > 0 && (
                <Button variant="default" onClick={handleValidate}>
                  <Lock className="w-4 h-4 mr-2" />
                  Valider & Verrouiller
                </Button>
              )}
              {calculationRun.validatedEmployees > 0 && (
                <>
                  <Button variant="outline" onClick={handleExportPaySlips}>
                    <FileText className="w-4 h-4 mr-2" />
                    Bulletins de Paie
                  </Button>
                  <Button variant="outline" onClick={handleGenerateDSN}>
                    <Send className="w-4 h-4 mr-2" />
                    Générer DSN
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={calculationRun.calculations}
            columns={columns}
            searchPlaceholder="Rechercher un employé..."
          />
        </CardContent>
      </Card>

      <Modal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        type="details"
        title={`Détail du Calcul - ${selectedEmployee?.employeeName || ""}`}
        size="full"
        actions={{
          primary: {
            label: "Fermer",
            onClick: () => setDetailModalOpen(false),
            variant: "outline",
          },
        }}
      >
        {selectedEmployee && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
              <TabsTrigger value="earnings">Éléments de Paie</TabsTrigger>
              <TabsTrigger value="employee">Cotisations Salarié</TabsTrigger>
              <TabsTrigger value="employer">Cotisations Patronales</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Informations Employé
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Matricule</span>
                      <span className="font-medium">
                        {selectedEmployee.employeeNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Poste</span>
                      <span className="font-medium">
                        {selectedEmployee.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Contrat</span>
                      <span className="font-medium">
                        {selectedEmployee.contractType}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Période</span>
                      <span className="font-medium">
                        {selectedEmployee.period}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Statut</span>
                      {getStatusBadge(selectedEmployee.status)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Résumé Financier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Salaire Brut
                      </span>
                      <span className="font-semibold">
                        {selectedEmployee.grossSalary.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        - Cotisations salarié
                      </span>
                      <span className="text-red-600">
                        {selectedEmployee.totalEmployeeContributions.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Net à Payer</span>
                      <span className="text-green-600">
                        {selectedEmployee.netToPay.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Net Imposable
                      </span>
                      <span>
                        {selectedEmployee.netTaxable.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Net Imposable Cumulé
                      </span>
                      <span>
                        {selectedEmployee.netTaxableYTD.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}{" "}
                        €
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Coût Employeur</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Salaire Brut</span>
                    <span>
                      {selectedEmployee.grossSalary.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      + Charges patronales
                    </span>
                    <span className="text-orange-600">
                      {selectedEmployee.totalEmployerContributions.toLocaleString(
                        "fr-FR",
                        {
                          minimumFractionDigits: 2,
                        },
                      )}{" "}
                      €
                    </span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg border-t pt-2">
                    <span>Coût Total</span>
                    <span className="text-primary">
                      {selectedEmployee.totalCost.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                </CardContent>
              </Card>

              {selectedEmployee.ijssAmount && (
                <Card className="border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Maintien de Salaire (IJSS)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Montant IJSS
                      </span>
                      <span>
                        {selectedEmployee.ijssAmount.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Maintien de salaire
                      </span>
                      <span>
                        {selectedEmployee.salaryMaintenance?.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}{" "}
                        €
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {(selectedEmployee.errors.length > 0 ||
                selectedEmployee.warnings.length > 0) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Alertes & Erreurs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {selectedEmployee.errors.map((error, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-800"
                      >
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{error}</span>
                      </div>
                    ))}
                    {selectedEmployee.warnings.map((warning, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 p-2 bg-orange-50 border border-orange-300 rounded text-sm text-orange-900"
                      >
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{warning}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="earnings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Gains</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEmployee.salaryElements
                      .filter((el) => el.type === "earning")
                      .map((element) => (
                        <div
                          key={element.id}
                          className="flex items-center justify-between py-2 border-b last:border-0"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{element.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {element.code}
                            </div>
                          </div>
                          {element.quantity && element.rate && (
                            <div className="text-sm text-muted-foreground mr-4">
                              {element.quantity} × {element.rate.toFixed(2)} €
                            </div>
                          )}
                          <div className="font-semibold text-green-600">
                            +{" "}
                            {element.amount.toLocaleString("fr-FR", {
                              minimumFractionDigits: 2,
                            })}{" "}
                            €
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              {selectedEmployee.salaryElements.filter(
                (el) => el.type === "deduction",
              ).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Déductions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedEmployee.salaryElements
                        .filter((el) => el.type === "deduction")
                        .map((element) => (
                          <div
                            key={element.id}
                            className="flex items-center justify-between py-2 border-b last:border-0"
                          >
                            <div className="flex-1">
                              <div className="font-medium">{element.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {element.code}
                              </div>
                            </div>
                            {element.quantity && element.rate && (
                              <div className="text-sm text-muted-foreground mr-4">
                                {element.quantity} × {element.rate.toFixed(2)} €
                              </div>
                            )}
                            <div className="font-semibold text-red-600">
                              {element.amount.toLocaleString("fr-FR", {
                                minimumFractionDigits: 2,
                              })}{" "}
                              €
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>Salaire Brut</span>
                    <span>
                      {selectedEmployee.grossSalary.toLocaleString("fr-FR", {
                        minimumFractionDigits: 2,
                      })}{" "}
                      €
                    </span>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employee" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Cotisations Salariales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEmployee.employeeContributions.map((contrib) => (
                      <div
                        key={contrib.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{contrib.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {contrib.code}
                            {contrib.tranche && ` - Tranche ${contrib.tranche}`}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mr-4">
                          {contrib.baseAmount.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          € × {contrib.rate}%
                        </div>
                        <div className="font-semibold text-red-600 min-w-[100px] text-right">
                          {contrib.amount.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          €
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Salaire Brut</span>
                      <span className="font-semibold">
                        {selectedEmployee.grossSalary.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-red-600">
                      <span>Total Cotisations Salarié</span>
                      <span className="font-semibold">
                        -{" "}
                        {selectedEmployee.totalEmployeeContributions.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                      <span>Net à Payer</span>
                      <span className="text-green-600">
                        {selectedEmployee.netToPay.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="employer" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Cotisations Patronales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedEmployee.employerContributions.map((contrib) => (
                      <div
                        key={contrib.id}
                        className="flex items-center justify-between py-2 border-b last:border-0"
                      >
                        <div className="flex-1">
                          <div className="font-medium">{contrib.label}</div>
                          <div className="text-xs text-muted-foreground">
                            {contrib.code}
                            {contrib.tranche && ` - Tranche ${contrib.tranche}`}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground mr-4">
                          {contrib.baseAmount.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          € × {contrib.rate}%
                        </div>
                        <div className="font-semibold text-orange-600 min-w-[100px] text-right">
                          {contrib.amount.toLocaleString("fr-FR", {
                            minimumFractionDigits: 2,
                          })}{" "}
                          €
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-50">
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Salaire Brut</span>
                      <span className="font-semibold">
                        {selectedEmployee.grossSalary.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-orange-600">
                      <span>Total Charges Patronales</span>
                      <span className="font-semibold">
                        +{" "}
                        {selectedEmployee.totalEmployerContributions.toLocaleString(
                          "fr-FR",
                          {
                            minimumFractionDigits: 2,
                          },
                        )}{" "}
                        €
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-lg font-bold border-t pt-2">
                      <span>Coût Total Employeur</span>
                      <span className="text-primary">
                        {selectedEmployee.totalCost.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Modal>
    </div>
  );
}
