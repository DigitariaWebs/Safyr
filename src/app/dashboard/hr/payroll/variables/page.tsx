"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  CheckCircle,
  MoreVertical,
  Euro,
  Clock,
  Calendar,
  Users,
  Eye,
} from "lucide-react";
import type {
  PayrollVariable,
  PayrollVariableType,
  Employee,
} from "@/lib/types";
import { mockEmployees } from "@/data/employees";

// Mock data
const mockVariables: PayrollVariable[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    period: "2024-12-01",
    type: "bonus",
    amount: 500,
    currency: "EUR",
    description: "Majoration de fin d'année",
    validated: true,
    validatedBy: "Admin",
    validatedAt: new Date("2024-12-15"),
    createdAt: new Date("2024-12-10"),
    updatedAt: new Date("2024-12-15"),
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    period: "2024-12-01",
    type: "night_shift",
    amount: 120,
    currency: "EUR",
    description: "Majoration heures de nuit",
    validated: false,
    createdAt: new Date("2024-12-18"),
    updatedAt: new Date("2024-12-18"),
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Pierre Durand",
    period: "2024-12-01",
    type: "travel_allowance",
    amount: 85,
    currency: "EUR",
    description: "Indemnité de déplacement",
    validated: true,
    validatedBy: "Admin",
    validatedAt: new Date("2024-12-16"),
    createdAt: new Date("2024-12-12"),
    updatedAt: new Date("2024-12-16"),
  },
];

const variableTypeLabels: Record<PayrollVariableType, string> = {
  bonus: "Majoration",
  night_shift: "Nuit",
  sunday_shift: "Dimanche",
  holiday_shift: "Jour férié",
  travel_allowance: "Déplacement",
  meal_allowance: "Repas",
  dressing_allowance: "Tenue",
  other_allowance: "Autre indemnité",
};

interface GroupedVariable {
  employeeId: string;
  employeeName: string;
  period: string;
  types: Record<string, number>;
  validated: boolean;
  id: string;
}

export default function PayrollVariablesPage() {
  const [variables, setVariables] = useState<PayrollVariable[]>(mockVariables);
  const [isVariableModalOpen, setIsVariableModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedVariable, setSelectedVariable] =
    useState<PayrollVariable | null>(null);
  const [selectedVariables, setSelectedVariables] = useState<PayrollVariable[]>(
    [],
  );
  const [employeeSearchOpen, setEmployeeSearchOpen] = useState(false);
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState("");
  const employeeSearchRef = useRef<HTMLDivElement>(null);
  const [variableForm, setVariableForm] = useState({
    employeeId: "",
    employeeName: "",
    period: new Date().toISOString().split("T")[0],
    type: "bonus" as PayrollVariableType,
    amount: "",
    description: "",
    bonus: "",
    night_shift: "",
    sunday_shift: "",
    holiday_shift: "",
    travel_allowance: "",
    meal_allowance: "",
    dressing_allowance: "",
    other_allowance: "",
  });

  // Handle click outside to close employee search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        employeeSearchRef.current &&
        !employeeSearchRef.current.contains(event.target as Node)
      ) {
        setEmployeeSearchOpen(false);
        setEmployeeSearchQuery("");
      }
    };

    if (employeeSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [employeeSearchOpen]);

  const handleValidate = (variable: PayrollVariable) => {
    setVariables(
      variables.map((v) =>
        v.id === variable.id
          ? {
              ...v,
              validated: true,
              validatedBy: "Admin",
              validatedAt: new Date(),
            }
          : v,
      ),
    );
  };

  const handleReject = (variable: PayrollVariable) => {
    setVariables(variables.filter((v) => v.id !== variable.id));
  };

  const handleSelectEmployee = (employee: Employee) => {
    setVariableForm((prev) => ({
      ...prev,
      employeeId: employee.employeeNumber,
      employeeName: `${employee.firstName} ${employee.lastName}`,
    }));
    setEmployeeSearchOpen(false);
    setEmployeeSearchQuery("");
  };

  const handleViewGroup = (group: GroupedVariable) => {
    const groupVariables = variables.filter(
      (v) => v.employeeId === group.employeeId && v.period === group.period,
    );
    setSelectedVariables(groupVariables);
    setIsDetailsModalOpen(true);
  };

  const handleEditVariable = (variable: PayrollVariable) => {
    setSelectedVariable(variable);
    setVariableForm({
      employeeId: variable.employeeId,
      employeeName: variable.employeeName,
      period: variable.period,
      type: variable.type,
      amount: variable.amount.toString(),
      description: variable.description || "",
      bonus: "",
      night_shift: "",
      sunday_shift: "",
      holiday_shift: "",
      travel_allowance: "",
      meal_allowance: "",
      dressing_allowance: "",
      other_allowance: "",
    });
    setIsEditMode(true);
    setIsVariableModalOpen(true);
  };

  const handleCreateOrUpdateVariable = () => {
    if (isEditMode && selectedVariable) {
      // Update existing variable
      setVariables(
        variables.map((v) =>
          v.id === selectedVariable.id
            ? {
                ...v,
                employeeId: variableForm.employeeId,
                employeeName: variableForm.employeeName,
                period: variableForm.period,
                type: variableForm.type,
                amount: parseFloat(variableForm.amount),
                description: variableForm.description,
                updatedAt: new Date(),
              }
            : v,
        ),
      );
    } else {
      // Create new variables for each non-empty type
      const newVariables: PayrollVariable[] = [];
      const types = [
        "bonus",
        "night_shift",
        "sunday_shift",
        "holiday_shift",
        "travel_allowance",
        "meal_allowance",
        "dressing_allowance",
        "other_allowance",
      ] as const;
      types.forEach((type) => {
        const amountStr = variableForm[type];
        if (amountStr && parseFloat(amountStr) > 0) {
          const variable: PayrollVariable = {
            id: `VAR${Date.now()}-${type}`,
            employeeId: variableForm.employeeId,
            employeeName: variableForm.employeeName,
            period: variableForm.period,
            type,
            amount: parseFloat(amountStr),
            currency: "EUR",
            description: variableForm.description,
            validated: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          newVariables.push(variable);
        }
      });
      setVariables([...variables, ...newVariables]);
    }

    setIsVariableModalOpen(false);
    setIsEditMode(false);
    setEmployeeSearchOpen(false);
    setEmployeeSearchQuery("");
    setVariableForm({
      employeeId: "",
      employeeName: "",
      period: new Date().toISOString().split("T")[0],
      type: "bonus",
      amount: "",
      description: "",
      bonus: "",
      night_shift: "",
      sunday_shift: "",
      holiday_shift: "",
      travel_allowance: "",
      meal_allowance: "",
      dressing_allowance: "",
      other_allowance: "",
    });
  };

  const filteredEmployees = mockEmployees.filter((employee) =>
    `${employee.firstName} ${employee.lastName} ${employee.employeeNumber}`
      .toLowerCase()
      .includes(employeeSearchQuery.toLowerCase()),
  );

  const handleOpenCreateModal = () => {
    setIsEditMode(false);
    setVariableForm({
      employeeId: "",
      employeeName: "",
      period: new Date().toISOString().split("T")[0],
      type: "bonus",
      amount: "",
      description: "",
      bonus: "",
      night_shift: "",
      sunday_shift: "",
      holiday_shift: "",
      travel_allowance: "",
      meal_allowance: "",
      dressing_allowance: "",
      other_allowance: "",
    });
    setIsVariableModalOpen(true);
  };

  const employeePeriodData = variables.reduce(
    (acc, variable) => {
      const key = `${variable.employeeId}-${variable.period}`;
      if (!acc[key]) {
        acc[key] = {
          employeeId: variable.employeeId,
          employeeName: variable.employeeName,
          period: variable.period,
          types: {} as Record<string, number>,
          validated: true,
          id: key,
        };
      }
      if (!acc[key].types[variable.type]) {
        acc[key].types[variable.type] = 0;
      }
      acc[key].types[variable.type] += variable.amount;
      if (!variable.validated) {
        acc[key].validated = false;
      }
      return acc;
    },
    {} as Record<string, GroupedVariable>,
  );

  const groupedData = Object.values(employeePeriodData);

  const pendingDeclarations = groupedData.filter((g) => !g.validated).length;

  const groupedColumns: ColumnDef<GroupedVariable>[] = [
    {
      key: "employee",
      label: "Employé",
      icon: Users,
      sortable: true,
      sortValue: (item: GroupedVariable) => item.employeeName,
      render: (item: GroupedVariable) => (
        <div>
          <div className="font-medium">
            <Link
              href={`/dashboard/hr/employees/${item.employeeId}`}
              className="text-primary hover:underline"
            >
              {item.employeeName}
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">{item.employeeId}</div>
        </div>
      ),
    },
    {
      key: "period",
      label: "Période",
      icon: Calendar,
      sortable: true,
      render: (item: GroupedVariable) => {
        const date = new Date(item.period);
        return (
          <span className="text-sm">
            {date.toLocaleDateString("fr-FR", {
              year: "numeric",
              month: "long",
            })}
          </span>
        );
      },
    },
    ...Object.entries(variableTypeLabels).map(([type, label]) => ({
      key: type,
      label,
      sortable: true,
      sortValue: (item: GroupedVariable) => item.types[type] || 0,
      render: (item: GroupedVariable) => (
        <span className="font-medium">
          {(item.types[type] || 0).toLocaleString("fr-FR")} €
        </span>
      ),
    })),
    {
      key: "validated",
      label: "Statut",
      sortable: true,
      render: (item: GroupedVariable) => (
        <Badge variant={item.validated ? "default" : "secondary"}>
          {item.validated ? "Validé" : "En attente"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Variables de paie
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Gestion des primes, indemnités et majorations
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle variable
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total déclarations
            </CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groupedData.length}</div>
            <p className="text-xs text-muted-foreground">Déclarations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              En attente de validation
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {pendingDeclarations}
            </div>
            <p className="text-xs text-muted-foreground">À valider</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant total</CardTitle>
            <Euro className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {variables
                .reduce((sum, v) => sum + v.amount, 0)
                .toLocaleString("fr-FR")}{" "}
              €
            </div>
            <p className="text-xs text-muted-foreground">Variables validées</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taux de validation
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {groupedData.length > 0
                ? Math.round(
                    ((groupedData.length - pendingDeclarations) /
                      groupedData.length) *
                      100,
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Variables validées</p>
          </CardContent>
        </Card>
      </div>

      {/* Variables DataTable */}
      <DataTable
        data={groupedData}
        columns={groupedColumns}
        searchKeys={["employeeName"]}
        getSearchValue={(item) => item.employeeName}
        searchPlaceholder="Rechercher par employé..."
        getRowId={(item) => item.id}
        filters={[
          {
            key: "validated",
            label: "Statut",
            options: [
              { value: "all", label: "Tous" },
              { value: "validated", label: "Validé" },
              { value: "pending", label: "En attente" },
            ],
          },
        ]}
        actions={(item: GroupedVariable) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewGroup(item)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir détails
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* View Variable Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la variable de paie"
        size="md"
      >
        {selectedVariable && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Employé</Label>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href={`/dashboard/hr/employees/${selectedVariable.employeeId}`}
                    className="text-primary hover:underline"
                  >
                    {selectedVariable.employeeName}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedVariable.employeeId}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Type</Label>
                <p className="text-sm text-muted-foreground">
                  {variableTypeLabels[selectedVariable.type]}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Période</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedVariable.period).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                    },
                  )}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Montant</Label>
                <p className="text-sm font-medium">
                  {selectedVariable.amount.toLocaleString("fr-FR")} €
                </p>
              </div>
            </div>

            {selectedVariable.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVariable.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedVariable.validated ? "default" : "secondary"
                    }
                  >
                    {selectedVariable.validated ? "Validé" : "En attente"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Validé par</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedVariable.validatedBy || "-"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                Créée le{" "}
                {selectedVariable.createdAt.toLocaleDateString("fr-FR")}
              </div>
              <div>
                Modifiée le{" "}
                {selectedVariable.updatedAt.toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        type="details"
        title="Détails des variables de paie"
        size="lg"
      >
        {selectedVariables.length > 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Employé</Label>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href={`/dashboard/hr/employees/${selectedVariables[0].employeeId}`}
                    className="text-primary hover:underline"
                  >
                    {selectedVariables[0].employeeName}
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedVariables[0].employeeId}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Période</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedVariables[0].period).toLocaleDateString(
                    "fr-FR",
                    {
                      year: "numeric",
                      month: "long",
                    },
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Variables</h4>
              {selectedVariables.map((variable) => (
                <div key={variable.id} className="p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Type</Label>
                      <p className="text-sm text-muted-foreground">
                        {variableTypeLabels[variable.type]}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Montant</Label>
                      <p className="text-sm font-medium">
                        {variable.amount.toLocaleString("fr-FR")} €
                      </p>
                    </div>
                  </div>
                  {variable.description && (
                    <div className="mt-2">
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {variable.description}
                      </p>
                    </div>
                  )}
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleEditVariable(variable)}
                    >
                      Modifier
                    </Button>
                    {!variable.validated && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleValidate(variable)}
                        >
                          Valider
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleReject(variable)}
                        >
                          Rejeter
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Variable Modal (Create/Edit) */}
      <Modal
        open={isVariableModalOpen}
        onOpenChange={(open) => {
          setIsVariableModalOpen(open);
          if (!open) {
            setEmployeeSearchOpen(false);
            setEmployeeSearchQuery("");
          }
        }}
        type="form"
        title={
          isEditMode
            ? "Modifier la variable de paie"
            : "Nouvelle déclaration de variables de paie"
        }
        size="md"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsVariableModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: isEditMode ? "Mettre à jour" : "Créer les variables",
            onClick: handleCreateOrUpdateVariable,
            disabled:
              !variableForm.employeeName ||
              (isEditMode ? !variableForm.amount : false),
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">
              Employé <span className="text-destructive">*</span>
            </Label>
            <div className="relative" ref={employeeSearchRef}>
              <Button
                type="button"
                variant="outline"
                className="w-full justify-between"
                onClick={() => setEmployeeSearchOpen(!employeeSearchOpen)}
              >
                {variableForm.employeeName || "Sélectionner un employé"}
                <Users className="h-4 w-4 opacity-50" />
              </Button>
              {employeeSearchOpen && (
                <div className="absolute z-10 w-full mt-1 bg-popover border rounded-md shadow-lg">
                  <div className="p-2">
                    <Input
                      placeholder="Rechercher un employé..."
                      value={employeeSearchQuery}
                      onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                      className="mb-2"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredEmployees.length > 0 ? (
                      filteredEmployees.map((employee) => (
                        <button
                          key={employee.id}
                          type="button"
                          className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground flex items-center gap-3"
                          onClick={() => handleSelectEmployee(employee)}
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                            {employee.firstName[0]}
                            {employee.lastName[0]}
                          </div>
                          <div>
                            <div className="font-medium">
                              {employee.firstName} {employee.lastName}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {employee.employeeNumber} • {employee.position}
                            </div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Aucun employé trouvé
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Période</Label>
            <Input
              id="period"
              type="date"
              value={variableForm.period}
              onChange={(e) =>
                setVariableForm((prev) => ({
                  ...prev,
                  period: e.target.value,
                }))
              }
            />
          </div>

          {isEditMode ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="type">Type de variable</Label>
                <Select
                  value={variableForm.type}
                  onValueChange={(value: PayrollVariableType) =>
                    setVariableForm((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(variableTypeLabels).map(
                      ([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">
                  Montant (€) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={variableForm.amount}
                  onChange={(e) =>
                    setVariableForm((prev) => ({
                      ...prev,
                      amount: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(variableTypeLabels).map(([type, label]) => (
                <div key={type} className="space-y-2">
                  <Label htmlFor={type}>{label}</Label>
                  <Input
                    id={type}
                    type="number"
                    step="0.01"
                    value={
                      variableForm[type as keyof typeof variableForm] as string
                    }
                    onChange={(e) =>
                      setVariableForm((prev) => ({
                        ...prev,
                        [type]: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={variableForm.description}
              onChange={(e) =>
                setVariableForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Description de la variable"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
