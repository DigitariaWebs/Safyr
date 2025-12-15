"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import {
  Clock,
  Sun,
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Plus,
} from "lucide-react";
import { mockWorkedHours } from "@/data/time-management";
import { mockEmployees } from "@/data/employees";

export default function WorkedHoursPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "validated" | "pending"
  >("all");
  const [isDeclareModalOpen, setIsDeclareModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    regularHours: 0,
    overtimeHours: 0,
    nightHours: 0,
    sundayHours: 0,
    holidayHours: 0,
  });

  const filteredHours = mockWorkedHours.filter((hours) => {
    const matchesSearch = hours.employeeName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "validated" && hours.validated) ||
      (statusFilter === "pending" && !hours.validated);
    return matchesSearch && matchesStatus;
  });

  const totalPending = mockWorkedHours.filter((h) => !h.validated).length;
  const totalRegularHours = mockWorkedHours.reduce(
    (sum, h) => sum + h.regularHours,
    0,
  );
  const totalOvertimeHours = mockWorkedHours.reduce(
    (sum, h) => sum + h.overtimeHours,
    0,
  );

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
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

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom d'employé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={statusFilter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("all")}
              >
                Tous
              </Button>
              <Button
                variant={statusFilter === "validated" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("validated")}
              >
                Validées
              </Button>
              <Button
                variant={statusFilter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter("pending")}
              >
                En attente
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            {filteredHours.map((hours) => (
              <Card key={hours.id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold">{hours.employeeName}</h3>
                        {hours.validated ? (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Validé
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-600">
                            <Clock className="mr-1 h-3 w-3" />
                            En attente
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(hours.date).toLocaleDateString("fr-FR", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-5">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Heures normales
                      </p>
                      <p className="text-lg font-semibold">
                        {hours.regularHours}h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Heures supp.
                      </p>
                      <p className="text-lg font-semibold text-blue-600">
                        {hours.overtimeHours}h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Heures nuit
                      </p>
                      <p className="text-lg font-semibold text-purple-600">
                        {hours.nightHours}h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">Dimanche</p>
                      <p className="text-lg font-semibold text-orange-600">
                        {hours.sundayHours}h
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Jours fériés
                      </p>
                      <p className="text-lg font-semibold text-red-600">
                        {hours.holidayHours}h
                      </p>
                    </div>
                  </div>

                  {hours.validated && hours.validatedBy && (
                    <div className="mt-4 rounded-md bg-green-50 p-3">
                      <p className="text-sm text-green-800">
                        Validé par <strong>{hours.validatedBy}</strong> le{" "}
                        {new Date(hours.validatedAt!).toLocaleDateString(
                          "fr-FR",
                        )}
                      </p>
                    </div>
                  )}

                  {!hours.validated && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600"
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Valider
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600"
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Rejeter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {filteredHours.length === 0 && (
              <div className="py-12 text-center">
                <Clock className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Aucune déclaration d&apos;heures trouvée
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Declare Hours Modal */}
      <Modal
        open={isDeclareModalOpen}
        onOpenChange={setIsDeclareModalOpen}
        type="form"
        title="Déclarer des heures travaillées"
        description="Saisissez les heures travaillées pour un employé"
        actions={{
          primary: {
            label: "Déclarer",
            onClick: () => {
              // Here you would normally save to database
              console.log("Declaring hours:", formData);
              setIsDeclareModalOpen(false);
              setFormData({
                employeeId: "",
                date: new Date().toISOString().split("T")[0],
                regularHours: 0,
                overtimeHours: 0,
                nightHours: 0,
                sundayHours: 0,
                holidayHours: 0,
              });
            },
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeclareModalOpen(false),
          },
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <Select
                value={formData.employeeId}
                onValueChange={(value) =>
                  setFormData({ ...formData, employeeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un employé" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName} -{" "}
                      {employee.employeeNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="regularHours" className="flex items-center gap-2">
                <Sun className="h-4 w-4" />
                Heures normales
              </Label>
              <Input
                id="regularHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.regularHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    regularHours: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="overtimeHours"
                className="flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-blue-600" />
                Heures supplémentaires
              </Label>
              <Input
                id="overtimeHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.overtimeHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    overtimeHours: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nightHours" className="flex items-center gap-2">
                <span className="text-purple-600">🌙</span>
                Heures nuit
              </Label>
              <Input
                id="nightHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.nightHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    nightHours: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sundayHours" className="flex items-center gap-2">
                <span className="text-orange-600">☀️</span>
                Dimanche
              </Label>
              <Input
                id="sundayHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.sundayHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sundayHours: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="holidayHours" className="flex items-center gap-2">
                <span className="text-red-600">🎄</span>
                Jours fériés
              </Label>
              <Input
                id="holidayHours"
                type="number"
                min="0"
                step="0.5"
                value={formData.holidayHours}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    holidayHours: parseFloat(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">Récapitulatif</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                Total heures:{" "}
                <strong>
                  {formData.regularHours +
                    formData.overtimeHours +
                    formData.nightHours +
                    formData.sundayHours +
                    formData.holidayHours}
                  h
                </strong>
              </div>
              <div>
                À majorer:{" "}
                <strong className="text-blue-600">
                  {formData.overtimeHours +
                    formData.nightHours +
                    formData.sundayHours +
                    formData.holidayHours}
                  h
                </strong>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
