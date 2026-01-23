"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { PeriodSelector, Period } from "@/components/ui/period-selector";
import { DataTable, ColumnDef, FilterDef } from "@/components/ui/DataTable";
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
  Euro,
  Users,
  Building2,
  HandCoins,
  Coins,
  Receipt,
  Calendar,
  ChevronRight,
} from "lucide-react";
import {
  mockCalculationRunWorkflow,
  workflowStepLabels,
  workflowStepDescriptions,
} from "@/data/payroll-calculation-workflow";
import { PayrollCalculationWorkflow } from "@/lib/types.d";

export default function PayrollCalculationPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>({
    id: "2024-12",
    month: 12,
    year: 2024,
    label: "Décembre 2024",
  });
  const [selectedEmployee, setSelectedEmployee] =
    useState<PayrollCalculationWorkflow | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const calculationRun = mockCalculationRunWorkflow;

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

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("fr-FR", { minimumFractionDigits: 2 }) + " €";

  // Filters for DataTable
  const calculationFilters: FilterDef[] = [
    {
      key: "status",
      label: "Statut",
      options: [
        { value: "all", label: "Tous les statuts" },
        { value: "validated", label: "Validés" },
        { value: "calculated", label: "Calculés" },
        { value: "pending", label: "En attente" },
        { value: "error", label: "Erreurs" },
      ],
    },
    {
      key: "contractType",
      label: "Contrat",
      options: [
        { value: "all", label: "Tous les contrats" },
        { value: "CDI", label: "CDI" },
        { value: "CDD", label: "CDD" },
        { value: "Apprentissage", label: "Apprentissage" },
      ],
    },
  ];

  const columns: ColumnDef<PayrollCalculationWorkflow>[] = [
    {
      key: "employeeNumber",
      label: "Matricule",
      sortable: true,
      render: (calc) => (
        <span className="font-medium">{calc.employeeNumber}</span>
      ),
    },
    {
      key: "employeeName",
      label: "Nom",
      sortable: true,
      render: (calc) => (
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
      render: (calc) => getStatusBadge(calc.status),
    },
    {
      key: "bruteSalary",
      label: "Brut",
      sortable: true,
      render: (calc) => (
        <span className="font-medium">{formatCurrency(calc.bruteSalary)}</span>
      ),
    },
    {
      key: "totalEmployeeDeductions",
      label: "Cotis. Salarié",
      sortable: true,
      render: (calc) => (
        <span className="text-red-600">
          -{formatCurrency(calc.totalEmployeeDeductions)}
        </span>
      ),
    },
    {
      key: "totalIndemnites",
      label: "Indemnités",
      sortable: true,
      render: (calc) => (
        <span className="text-green-600">
          +{formatCurrency(calc.totalIndemnites)}
        </span>
      ),
    },
    {
      key: "netToPay",
      label: "Net à Payer",
      sortable: true,
      render: (calc) => (
        <span className="font-semibold text-primary">
          {formatCurrency(calc.netToPay)}
        </span>
      ),
    },
    {
      key: "totalEmployerCost",
      label: "Coût Employeur",
      sortable: true,
      render: (calc) => (
        <span className="text-orange-600">
          {formatCurrency(calc.totalEmployerCost)}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (calc) => (
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
            Calculez et validez les salaires selon le workflow de paie
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

      {/* Status Cards */}
      <InfoCardContainer className="grid-cols-1 md:grid-cols-2 lg:grid-cols-5">
        <InfoCard
          title="Total Employés"
          value={calculationRun.totalEmployees}
          icon={Users}
          color="blue"
        />
        <InfoCard
          title="Calculés"
          value={calculationRun.calculatedEmployees}
          icon={Calculator}
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

      {/* Workflow Overview Cards */}
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
              {formatCurrency(calculationRun.totalBruteSalary)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Base + heures + majorations - absences
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Coins className="w-4 h-4" />
              Indemnités
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatCurrency(calculationRun.totalIndemnites)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Transport, panier, primes...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              Net à Payer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {formatCurrency(calculationRun.totalNetToPay)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Après cotisations et impôts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Coût Employeur Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(calculationRun.totalEmployerCost)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Brut + charges patronales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-blue-800">
                Cotisations Salariales
              </span>
              <span className="font-semibold text-blue-900">
                {formatCurrency(calculationRun.totalEmployeeDeductions)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-800">
                Cotisations Patronales
              </span>
              <span className="font-semibold text-purple-900">
                {formatCurrency(calculationRun.totalEmployerCharges)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-green-800">Aides État</span>
              <span className="font-semibold text-green-900">
                -{formatCurrency(calculationRun.totalStateHelp)}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-800">
                Impôts Salariés (PAS)
              </span>
              <span className="font-semibold text-orange-900">
                {formatCurrency(calculationRun.totalEmployeeTaxes)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
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
            filters={calculationFilters}
            searchPlaceholder="Rechercher un employé..."
            searchKeys={["employeeName", "employeeNumber"]}
          />
        </CardContent>
      </Card>

      {/* Detail Modal */}
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
          <Tabs defaultValue="workflow" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="workflow">Workflow</TabsTrigger>
              <TabsTrigger value="brute">Salaire Brut</TabsTrigger>
              <TabsTrigger value="cotisations">Cotisations</TabsTrigger>
              <TabsTrigger value="indemnites">Indemnités</TabsTrigger>
              <TabsTrigger value="conges">Congés</TabsTrigger>
            </TabsList>

            {/* Workflow Tab */}
            <TabsContent value="workflow" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Employee Info */}
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

                {/* Financial Summary */}
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
                        {formatCurrency(selectedEmployee.bruteSalary)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        - Cotisations salarié
                      </span>
                      <span className="text-red-600">
                        -
                        {formatCurrency(
                          selectedEmployee.totalEmployeeDeductions,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        + Indemnités non imposables
                      </span>
                      <span className="text-green-600">
                        +
                        {formatCurrency(
                          selectedEmployee.totalIndemnitesNonTaxable,
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        - Impôt (PAS)
                      </span>
                      <span className="text-orange-600">
                        -{formatCurrency(selectedEmployee.totalEmployeeTaxes)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Net à Payer</span>
                      <span className="text-green-600">
                        {formatCurrency(selectedEmployee.netToPay)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Workflow Steps */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Étapes du Calcul</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Step 1 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-blue-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                        1
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step1}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step1}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {formatCurrency(selectedEmployee.bruteSalary)}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 2 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-red-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold">
                        2
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step2}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step2}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">
                          -
                          {formatCurrency(
                            selectedEmployee.totalEmployeeDeductions,
                          )}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 3 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-purple-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold">
                        3
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step3}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step3}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-purple-600">
                          {formatCurrency(
                            selectedEmployee.totalEmployerCharges,
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          (charge employeur)
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 4 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-green-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                        4
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step4}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step4}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          -{formatCurrency(selectedEmployee.totalStateHelp)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          (réduction charges)
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 5 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-cyan-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold">
                        5
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step5}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step5}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-cyan-600">
                          +{formatCurrency(selectedEmployee.totalIndemnites)}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 6 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-orange-50">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                        6
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step6}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step6}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-orange-600">
                          -{formatCurrency(selectedEmployee.totalEmployeeTaxes)}
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 mx-auto text-muted-foreground" />

                    {/* Step 7 */}
                    <div className="flex items-center gap-4 p-3 rounded-lg bg-emerald-100 border-2 border-emerald-500">
                      <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                        7
                      </div>
                      <div className="grow">
                        <div className="font-medium">
                          {workflowStepLabels.step7}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {workflowStepDescriptions.step7}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(selectedEmployee.netToPay)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Brute Tab */}
            <TabsContent value="brute" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Heures Travaillées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Heures normales
                      </span>
                      <span>{selectedEmployee.workedHours.normalHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Heures de nuit
                      </span>
                      <span>{selectedEmployee.workedHours.nightHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Heures dimanche
                      </span>
                      <span>{selectedEmployee.workedHours.sundayHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Heures fériées
                      </span>
                      <span>{selectedEmployee.workedHours.holidayHours}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HS 25%</span>
                      <span>{selectedEmployee.workedHours.overtime25}h</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">HS 50%</span>
                      <span>{selectedEmployee.workedHours.overtime50}h</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total heures</span>
                      <span>{selectedEmployee.workedHours.totalHours}h</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Décomposition Brut
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Salaire de base
                      </span>
                      <span>{formatCurrency(selectedEmployee.baseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Heures supplémentaires
                      </span>
                      <span>
                        {formatCurrency(selectedEmployee.overtimeAmount)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Majoration nuit
                      </span>
                      <span>{formatCurrency(selectedEmployee.nightBonus)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Majoration dimanche
                      </span>
                      <span>
                        {formatCurrency(selectedEmployee.sundayBonus)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Majoration fériés
                      </span>
                      <span>
                        {formatCurrency(selectedEmployee.holidayBonus)}
                      </span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span className="text-muted-foreground">Absences</span>
                      <span>
                        {formatCurrency(selectedEmployee.totalTimeOffDeduction)}
                      </span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-2">
                      <span>Total Brut</span>
                      <span>
                        {formatCurrency(selectedEmployee.bruteSalary)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {selectedEmployee.timeOffDeductions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Absences du mois</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-muted-foreground text-sm">
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Jours</th>
                          <th className="pb-2">Taux journalier</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.timeOffDeductions.map(
                          (deduction, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2">{deduction.type}</td>
                              <td className="py-2">{deduction.days}</td>
                              <td className="py-2">
                                {formatCurrency(deduction.dailyRate)}
                              </td>
                              <td className="py-2 text-right text-red-600">
                                {formatCurrency(deduction.amount)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Cotisations Tab */}
            <TabsContent value="cotisations" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Cotisations Salariales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Cotisation</th>
                          <th className="pb-2">Base</th>
                          <th className="pb-2">Taux</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.employeeDeductions.map(
                          (deduction, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2">
                                <div>{deduction.ruleName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {deduction.organism}
                                </div>
                              </td>
                              <td className="py-2">
                                {formatCurrency(deduction.baseAmount)}
                              </td>
                              <td className="py-2">{deduction.rate}%</td>
                              <td className="py-2 text-right text-red-600">
                                {formatCurrency(deduction.amount)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td colSpan={3} className="py-2">
                            Total
                          </td>
                          <td className="py-2 text-right text-red-600">
                            {formatCurrency(
                              selectedEmployee.totalEmployeeDeductions,
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Cotisations Patronales
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Cotisation</th>
                          <th className="pb-2">Base</th>
                          <th className="pb-2">Taux</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.employerCharges.map(
                          (charge, index) => (
                            <tr key={index} className="border-t">
                              <td className="py-2">
                                <div>{charge.ruleName}</div>
                                <div className="text-xs text-muted-foreground">
                                  {charge.organism}
                                </div>
                              </td>
                              <td className="py-2">
                                {formatCurrency(charge.baseAmount)}
                              </td>
                              <td className="py-2">{charge.rate}%</td>
                              <td className="py-2 text-right">
                                {formatCurrency(charge.amount)}
                              </td>
                            </tr>
                          ),
                        )}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td colSpan={3} className="py-2">
                            Total brut
                          </td>
                          <td className="py-2 text-right">
                            {formatCurrency(
                              selectedEmployee.totalEmployerCharges,
                            )}
                          </td>
                        </tr>
                        {selectedEmployee.stateHelps.length > 0 && (
                          <>
                            <tr className="text-green-600">
                              <td colSpan={3} className="py-2">
                                Aides État
                              </td>
                              <td className="py-2 text-right">
                                -
                                {formatCurrency(
                                  selectedEmployee.totalStateHelp,
                                )}
                              </td>
                            </tr>
                            <tr className="font-bold">
                              <td colSpan={3} className="py-2">
                                Total net
                              </td>
                              <td className="py-2 text-right">
                                {formatCurrency(
                                  selectedEmployee.employerNetCharges,
                                )}
                              </td>
                            </tr>
                          </>
                        )}
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              </div>

              {selectedEmployee.stateHelps.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <HandCoins className="w-4 h-4" />
                      Aides de l&apos;État
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Aide</th>
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Base</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.stateHelps.map((help, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2">{help.helpName}</td>
                            <td className="py-2">
                              <Badge variant="outline">{help.type}</Badge>
                            </td>
                            <td className="py-2">
                              {formatCurrency(help.baseAmount)}
                            </td>
                            <td className="py-2 text-right text-green-600">
                              -{formatCurrency(help.appliedAmount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td colSpan={3} className="py-2">
                            Total aides
                          </td>
                          <td className="py-2 text-right text-green-600">
                            -{formatCurrency(selectedEmployee.totalStateHelp)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Indemnités Tab */}
            <TabsContent value="indemnites" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">
                    Indemnités et Primes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedEmployee.indemnites.length > 0 ? (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Indemnité</th>
                          <th className="pb-2">Catégorie</th>
                          <th className="pb-2">Quantité</th>
                          <th className="pb-2">Taux</th>
                          <th className="pb-2">Imposable</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.indemnites.map((ind, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2">{ind.typeName}</td>
                            <td className="py-2">
                              <Badge variant="outline">{ind.category}</Badge>
                            </td>
                            <td className="py-2">{ind.quantity || "-"}</td>
                            <td className="py-2">
                              {ind.rate ? formatCurrency(ind.rate) : "-"}
                            </td>
                            <td className="py-2">
                              <Badge
                                className={
                                  ind.taxable
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                                }
                              >
                                {ind.taxable ? "Oui" : "Non"}
                              </Badge>
                            </td>
                            <td className="py-2 text-right text-green-600">
                              +{formatCurrency(ind.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t">
                          <td
                            colSpan={5}
                            className="py-2 text-muted-foreground"
                          >
                            Imposables
                          </td>
                          <td className="py-2 text-right">
                            {formatCurrency(
                              selectedEmployee.totalIndemnitesTaxable,
                            )}
                          </td>
                        </tr>
                        <tr>
                          <td
                            colSpan={5}
                            className="py-2 text-muted-foreground"
                          >
                            Non imposables
                          </td>
                          <td className="py-2 text-right">
                            {formatCurrency(
                              selectedEmployee.totalIndemnitesNonTaxable,
                            )}
                          </td>
                        </tr>
                        <tr className="font-semibold border-t">
                          <td colSpan={5} className="py-2">
                            Total
                          </td>
                          <td className="py-2 text-right text-green-600">
                            +{formatCurrency(selectedEmployee.totalIndemnites)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">
                      Aucune indemnité ce mois-ci
                    </p>
                  )}
                </CardContent>
              </Card>

              {selectedEmployee.employeeTaxes.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">
                      Impôts sur le Revenu
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-muted-foreground">
                          <th className="pb-2">Type</th>
                          <th className="pb-2">Base imposable</th>
                          <th className="pb-2">Taux</th>
                          <th className="pb-2 text-right">Montant</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEmployee.employeeTaxes.map((tax, index) => (
                          <tr key={index} className="border-t">
                            <td className="py-2">{tax.name}</td>
                            <td className="py-2">
                              {formatCurrency(tax.baseAmount)}
                            </td>
                            <td className="py-2">{tax.rate}%</td>
                            <td className="py-2 text-right text-orange-600">
                              -{formatCurrency(tax.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t font-semibold">
                          <td colSpan={3} className="py-2">
                            Total impôts
                          </td>
                          <td className="py-2 text-right text-orange-600">
                            -
                            {formatCurrency(
                              selectedEmployee.totalEmployeeTaxes,
                            )}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Congés Tab */}
            <TabsContent value="conges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Solde Congés Payés
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Solde N-1
                      </div>
                      <div className="text-2xl font-bold">
                        {
                          selectedEmployee.leaveBalance.congesPayes
                            .previousBalance
                        }
                      </div>
                      <div className="text-xs text-muted-foreground">jours</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Acquis ce mois
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        +{selectedEmployee.leaveBalance.congesPayes.acquired}
                      </div>
                      <div className="text-xs text-muted-foreground">jours</div>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <div className="text-sm text-muted-foreground">
                        Pris ce mois
                      </div>
                      <div className="text-2xl font-bold text-red-600">
                        -{selectedEmployee.leaveBalance.congesPayes.taken}
                      </div>
                      <div className="text-xs text-muted-foreground">jours</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="text-sm text-muted-foreground">
                        Solde restant
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedEmployee.leaveBalance.congesPayes.remaining}
                      </div>
                      <div className="text-xs text-muted-foreground">jours</div>
                    </div>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertCircle className="w-4 h-4" />
                      <span className="text-sm">
                        Acquisition mensuelle:{" "}
                        <strong>
                          {
                            selectedEmployee.leaveBalance.congesPayes
                              .monthlyAccrual
                          }{" "}
                          jours
                        </strong>{" "}
                        par mois travaillé
                      </span>
                    </div>
                  </div>

                  {selectedEmployee.leaveBalance.congesAnciennete && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Congés Ancienneté</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Acquis
                          </div>
                          <div className="font-bold">
                            {
                              selectedEmployee.leaveBalance.congesAnciennete
                                .acquired
                            }
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Pris
                          </div>
                          <div className="font-bold">
                            {
                              selectedEmployee.leaveBalance.congesAnciennete
                                .taken
                            }
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Restant
                          </div>
                          <div className="font-bold">
                            {
                              selectedEmployee.leaveBalance.congesAnciennete
                                .remaining
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedEmployee.leaveBalance.rtt && (
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">RTT</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Acquis
                          </div>
                          <div className="font-bold">
                            {selectedEmployee.leaveBalance.rtt.acquired}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Pris
                          </div>
                          <div className="font-bold">
                            {selectedEmployee.leaveBalance.rtt.taken}
                          </div>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <div className="text-sm text-muted-foreground">
                            Restant
                          </div>
                          <div className="font-bold">
                            {selectedEmployee.leaveBalance.rtt.remaining}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Modal>
    </div>
  );
}
