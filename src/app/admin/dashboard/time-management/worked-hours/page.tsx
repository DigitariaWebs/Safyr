"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { Modal } from "@/components/ui/modal";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Clock, Sun, Calendar, CheckCircle, XCircle, Plus } from "lucide-react";
import { mockWorkedHours } from "@/data/time-management";
import { mockEmployees } from "@/data/employees";

export default function WorkedHoursPage() {
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState<
    (typeof mockWorkedHours)[0] | null
  >(null);
  const [validationComment, setValidationComment] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    regularHours: 0,
    overtimeHours: 0,
    nightHours: 0,
    sundayHours: 0,
    holidayHours: 0,
  });

  // Filter employees based on search
  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.firstName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.employeeNumber
        .toLowerCase()
        .includes(employeeSearch.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const handleEmployeeSelect = (employee: (typeof mockEmployees)[0]) => {
    setFormData({ ...formData, employeeId: employee.id });
    setEmployeeSearch(
      `${employee.firstName} ${employee.lastName} (${employee.employeeNumber})`,
    );
    setIsEmployeeDropdownOpen(false);
  };

  const handleViewDetails = (hours: (typeof mockWorkedHours)[0]) => {
    setSelectedHours(hours);
    setValidationComment("");
    setIsDetailsModalOpen(true);
  };

  const handleValidation = (approved: boolean) => {
    if (!selectedHours) return;

    // TODO: API call to validate/reject hours
    console.log("Validation:", {
      approved,
      comment: validationComment,
      hoursId: selectedHours.id,
    });

    // Update hours status
    // For now, just close modal
    setIsDetailsModalOpen(false);
    setSelectedHours(null);
    setValidationComment("");
  };

  const totalPending = mockWorkedHours.filter((h) => !h.validated).length;
  const totalRegularHours = mockWorkedHours.reduce(
    (sum, h) => sum + h.regularHours,
    0,
  );
  const totalOvertimeHours = mockWorkedHours.reduce(
    (sum, h) => sum + h.overtimeHours,
    0,
  );

  const workedHoursColumns: ColumnDef<(typeof mockWorkedHours)[0]>[] = [
    {
      key: "employeeName",
      label: "Employé",
      sortable: true,
      render: (hours) => (
        <span className="font-semibold truncate">{hours.employeeName}</span>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (hours) => (
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="text-sm truncate">
            {new Date(hours.date).toLocaleDateString("fr-FR", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "regularHours",
      label: "Heures normales",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.regularHours}h</span>
      ),
    },
    {
      key: "overtimeHours",
      label: "Heures supp.",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold text-blue-600">
          {hours.overtimeHours}h
        </span>
      ),
    },
    {
      key: "nightHours",
      label: "Heures nuit",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold text-purple-600">
          {hours.nightHours}h
        </span>
      ),
    },
    {
      key: "sundayHours",
      label: "Dimanche",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold text-orange-600">
          {hours.sundayHours}h
        </span>
      ),
    },
    {
      key: "holidayHours",
      label: "Jours fériés",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold text-red-600">
          {hours.holidayHours}h
        </span>
      ),
    },
    {
      key: "validated",
      label: "Statut",
      sortable: true,
      render: (hours) =>
        hours.validated ? (
          <Badge variant="outline" className="text-green-600">
            <CheckCircle className="mr-1 h-3 w-3" />
            Validé
          </Badge>
        ) : (
          <Badge variant="outline" className="text-orange-600">
            <Clock className="mr-1 h-3 w-3" />
            En attente
          </Badge>
        ),
    },
  ];

  return (
    <div className="flex-1 space-y-6 p-8 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Heures Travaillées
          </h1>
          <p className="text-muted-foreground">
            Suivi des heures pour la préparation de la paie
          </p>
        </div>
        <Button onClick={() => setIsDeclareModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Déclarer des heures
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Déclarations
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockWorkedHours.length}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heures Normales
            </CardTitle>
            <Sun className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegularHours}h</div>
            <p className="text-xs text-muted-foreground">Total du mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Heures Supplémentaires
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOvertimeHours}h</div>
            <p className="text-xs text-muted-foreground">À majorer</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPending}</div>
            <p className="text-xs text-muted-foreground">À valider</p>
          </CardContent>
        </Card>
      </div>

      {/* Worked Hours Table */}
      <Card>
        <CardHeader>
          <CardTitle>Déclarations d&apos;heures</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={mockWorkedHours}
            columns={workedHoursColumns}
            searchKeys={["employeeName"]}
            searchPlaceholder="Rechercher par nom d'employé..."
            itemsPerPage={10}
            filters={[
              {
                key: "validated",
                label: "Statut",
                options: [
                  { value: "all", label: "Tous" },
                  { value: "true", label: "Validées" },
                  { value: "false", label: "En attente" },
                ],
              },
            ]}
            onRowClick={handleViewDetails}
          />
        </CardContent>
      </Card>

      {/* Declare Hours Modal */}
      <Modal
        open={isDeclareModalOpen}
        onOpenChange={(open) => {
          setIsDeclareModalOpen(open);
          if (!open) {
            setFormData({
              employeeId: "",
              date: new Date().toISOString().split("T")[0],
              regularHours: 0,
              overtimeHours: 0,
              nightHours: 0,
              sundayHours: 0,
              holidayHours: 0,
            });
            setEmployeeSearch("");
            setIsEmployeeDropdownOpen(false);
          }
        }}
        type="form"
        title="Déclarer des heures travaillées"
        description="Saisissez les heures travaillées pour un employé"
        actions={{
          primary: {
            label: "Déclarer",
            onClick: () => {
              console.log("Declaring hours:", formData);
              setFormData({
                employeeId: "",
                date: new Date().toISOString().split("T")[0],
                regularHours: 0,
                overtimeHours: 0,
                nightHours: 0,
                sundayHours: 0,
                holidayHours: 0,
              });
              setEmployeeSearch("");
              setIsEmployeeDropdownOpen(false);
              setIsDeclareModalOpen(false);
            },
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeclareModalOpen(false),
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeSearch">Employé</Label>
            <div className="relative">
              <Input
                id="employeeSearch"
                type="text"
                placeholder="Rechercher et sélectionner un employé..."
                value={employeeSearch}
                onChange={(e) => {
                  setEmployeeSearch(e.target.value);
                  setIsEmployeeDropdownOpen(true);
                }}
                onFocus={() => setIsEmployeeDropdownOpen(true)}
                onBlur={() => {
                  // Delay closing to allow click on options
                  setTimeout(() => setIsEmployeeDropdownOpen(false), 200);
                }}
              />
              {isEmployeeDropdownOpen && (
                <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.employeeNumber} - {employee.department}
                        </div>
                      </button>
                    ))
                  ) : employeeSearch ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">
                      Aucun employé trouvé
                    </div>
                  ) : (
                    mockEmployees.slice(0, 5).map((employee) => (
                      <button
                        key={employee.id}
                        type="button"
                        className="w-full px-3 py-2 text-left hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                        onClick={() => handleEmployeeSelect(employee)}
                      >
                        <div className="font-medium">
                          {employee.firstName} {employee.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {employee.employeeNumber} - {employee.department}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regularHours">Heures normales</Label>
              <Input
                id="regularHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.regularHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regularHours: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overtimeHours">Heures supplémentaires</Label>
              <Input
                id="overtimeHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.overtimeHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overtimeHours: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nightHours">Heures de nuit</Label>
              <Input
                id="nightHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.nightHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nightHours: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sundayHours">Heures dimanche</Label>
              <Input
                id="sundayHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.sundayHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sundayHours: parseFloat(e.target.value),
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="holidayHours">Heures jours fériés</Label>
              <Input
                id="holidayHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.holidayHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    holidayHours: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={(open) => {
          setIsDetailsModalOpen(open);
          if (!open) {
            setSelectedHours(null);
            setValidationComment("");
          }
        }}
        type="details"
        title={`Heures travaillées - ${selectedHours?.employeeName}`}
        description={
          selectedHours
            ? `Déclaration du ${new Date(selectedHours.date).toLocaleDateString("fr-FR")}`
            : ""
        }
        actions={
          selectedHours?.validated === false
            ? {
                secondary: {
                  label: "Fermer",
                  onClick: () => setIsDetailsModalOpen(false),
                  variant: "outline",
                },
                primary: {
                  label: "Approuver",
                  onClick: () => handleValidation(true),
                },
                tertiary: {
                  label: "Refuser",
                  onClick: () => handleValidation(false),
                  variant: "destructive",
                },
              }
            : {
                secondary: {
                  label: "Fermer",
                  onClick: () => setIsDetailsModalOpen(false),
                  variant: "outline",
                },
              }
        }
      >
        {selectedHours && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              {selectedHours.validated ? (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Validé
                </Badge>
              ) : (
                <Badge variant="outline" className="text-orange-600">
                  <Clock className="mr-1 h-4 w-4" />
                  En attente
                </Badge>
              )}
            </div>

            {/* Hours Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date
                </label>
                <p className="mt-1 font-medium">
                  {new Date(selectedHours.date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Total d&apos;heures
                </label>
                <p className="mt-1 font-medium">{selectedHours.totalHours}h</p>
              </div>
            </div>

            {/* Hours Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium">D&eacute;tail des heures</h4>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                  <span className="text-sm">Heures normales</span>
                  <span className="font-semibold">
                    {selectedHours.regularHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                  <span className="text-sm">Heures supplémentaires</span>
                  <span className="font-semibold text-blue-600">
                    {selectedHours.overtimeHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-purple-50 dark:bg-purple-950/20">
                  <span className="text-sm">Heures de nuit</span>
                  <span className="font-semibold text-purple-600">
                    {selectedHours.nightHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-orange-50 dark:bg-orange-950/20">
                  <span className="text-sm">Dimanche</span>
                  <span className="font-semibold text-orange-600">
                    {selectedHours.sundayHours}h
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-red-50 dark:bg-red-950/20 md:col-span-2">
                  <span className="text-sm">Jours fériés</span>
                  <span className="font-semibold text-red-600">
                    {selectedHours.holidayHours}h
                  </span>
                </div>
              </div>
            </div>

            {/* Employee Info */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
              <div className="flex-1">
                <p className="font-semibold">{selectedHours.employeeName}</p>
                <p className="text-sm text-muted-foreground">
                  {
                    mockEmployees.find((e) => e.id === selectedHours.employeeId)
                      ?.employeeNumber
                  }{" "}
                  -{" "}
                  {
                    mockEmployees.find((e) => e.id === selectedHours.employeeId)
                      ?.department
                  }
                </p>
              </div>
            </div>

            {/* Validation Section */}
            {selectedHours.validated === false && (
              <>
                <div className="space-y-3">
                  <Label className="text-sm font-medium">
                    Commentaire (optionnel)
                  </Label>
                  <Textarea
                    value={validationComment}
                    onChange={(e) => setValidationComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    rows={3}
                  />
                </div>
              </>
            )}

            {/* Validation History */}
            {selectedHours.validated && selectedHours.validatedBy && (
              <>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">
                      Validé par {selectedHours.validatedBy}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le{" "}
                    {new Date(selectedHours.validatedAt!).toLocaleDateString(
                      "fr-FR",
                    )}{" "}
                    à{" "}
                    {new Date(selectedHours.validatedAt!).toLocaleTimeString(
                      "fr-FR",
                    )}
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
