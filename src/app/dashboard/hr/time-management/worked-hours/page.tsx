"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Modal } from "@/components/ui/modal";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Clock,
  Sun,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit3,
  Trash2,
} from "lucide-react";
import { mockWorkedHours } from "@/data/time-management";
import { mockEmployees } from "@/data/employees";

const CategoryTable = ({
  hours,
}: {
  category: "supplementary";
  hours: (typeof mockWorkedHours)[0];
}) => {
  const variants = [
    {
      label: "25%",
      value: hours.supplementaryHours25,
    },
    {
      label: "50%",
      value: hours.supplementaryHours50,
    },
    {
      label: "10%",
      value: hours.complementaryHours10,
    },
  ];

  const bgColor = "bg-green-50 dark:bg-green-950/10";

  const getTextColor = (label: string) => {
    if (label === "25%") return "text-green-600";
    if (label === "50%") return "text-teal-600";
    if (label === "10%") return "text-cyan-600";
    return "";
  };

  return (
    <div className="text-xs flex gap-1">
      {variants.map((variant) => (
        <div
          key={variant.label}
          className={`flex flex-col items-center p-1 rounded ${bgColor} min-w-0 flex-1`}
        >
          <span className="text-xs text-gray-600">{variant.label}</span>
          <span className={`font-semibold ${getTextColor(variant.label)}`}>
            {variant.value}h
          </span>
        </div>
      ))}
    </div>
  );
};

export default function WorkedHoursPage() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedHours, setSelectedHours] = useState<
    (typeof mockWorkedHours)[0] | null
  >(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split("T")[0],
    regularHours: 0,
    supplementaryHours25: 0,
    supplementaryHours50: 0,
    complementaryHours10: 0,
    nightHours: 0,
    sundayHours: 0,
    sundayNightHours: 0,
    holidayHours: 0,
    holidayNightHours: 0,
  });

  const handleViewDetails = (hours: (typeof mockWorkedHours)[0]) => {
    setSelectedHours(hours);
    setIsEditMode(false);
    setIsDetailsModalOpen(true);
  };

  const handleEdit = (hours: (typeof mockWorkedHours)[0]) => {
    setSelectedHours(hours);
    setIsEditMode(true);
    setFormData({
      employeeId: hours.employeeId,
      date: hours.date.toISOString().split("T")[0],
      regularHours: hours.regularHours,
      supplementaryHours25: hours.supplementaryHours25,
      supplementaryHours50: hours.supplementaryHours50,
      complementaryHours10: hours.complementaryHours10,
      nightHours: hours.nightHours,
      sundayHours: hours.sundayHours,
      sundayNightHours: hours.sundayNightHours,
      holidayHours: hours.holidayHours,
      holidayNightHours: hours.holidayNightHours,
    });
    setIsDetailsModalOpen(true);
  };

  const handleDelete = (hours: (typeof mockWorkedHours)[0]) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ces heures ?")) {
      // TODO: Implement delete logic
      console.log("Delete hours:", hours.id);
    }
  };

  const totalRegularHours = mockWorkedHours.reduce(
    (sum, h) => sum + h.regularHours,
    0,
  );

  const totalSupplementaryHours25 = mockWorkedHours.reduce(
    (sum, h) => sum + (h.supplementaryHours25 || 0),
    0,
  );
  const totalSupplementaryHours50 = mockWorkedHours.reduce(
    (sum, h) => sum + (h.supplementaryHours50 || 0),
    0,
  );
  const totalComplementaryHours10 = mockWorkedHours.reduce(
    (sum, h) => sum + (h.complementaryHours10 || 0),
    0,
  );

  const allWorkedHoursColumns: ColumnDef<(typeof mockWorkedHours)[0]>[] = [
    {
      key: "employeeName",
      label: "Employé",
      sortable: true,
      render: (hours) => (
        <span className="font-semibold truncate">{hours.employeeName}</span>
      ),
    },
    {
      key: "period",
      label: "Période",
      sortable: true,
      render: (hours) => (
        <div className="flex items-center gap-2 min-w-0">
          <Calendar className="h-4 w-4 shrink-0" />
          <span className="text-sm truncate">
            {new Date(hours.date).toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      ),
    },
    {
      key: "regularHours",
      label: "H jour",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.regularHours}h</span>
      ),
    },
    {
      key: "sundayHours",
      label: "H Dimanche",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.sundayHours}h</span>
      ),
    },
    {
      key: "holidayHours",
      label: "H Férié",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.holidayHours}h</span>
      ),
    },
    {
      key: "nightHours",
      label: "H Nuit",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.nightHours}h</span>
      ),
    },
    {
      key: "sundayNightHours",
      label: "H Dimanche Nuit",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">{hours.sundayNightHours}h</span>
      ),
    },
    {
      key: "holidayNightHours",
      label: "H Férié Nuit",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">
          {hours.holidayNightHours}h
        </span>
      ),
    },
    {
      key: "supplementaryHours25",
      label: "H Supp 25%",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">
          {hours.supplementaryHours25}h
        </span>
      ),
    },
    {
      key: "supplementaryHours50",
      label: "H Supp 50%",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">
          {hours.supplementaryHours50}h
        </span>
      ),
    },
    {
      key: "complementaryHours10",
      label: "H Compl 10%",
      sortable: true,
      render: (hours) => (
        <span className="text-sm font-semibold">
          {hours.complementaryHours10}h
        </span>
      ),
    },
  ];

  const workedHoursColumns = [
    ...allWorkedHoursColumns,
    {
      key: "actions",
      label: "Actions",
      render: (hours: (typeof mockWorkedHours)[0]) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleViewDetails(hours)}>
              <Eye className="mr-2 h-4 w-4" />
              Voir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEdit(hours)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(hours)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
      </div>

      {/* Statistics Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Sun}
          title="Heures Normales"
          value={`${totalRegularHours}h`}
          subtext="Total du mois"
          color="blue"
        />

        <InfoCard
          icon={Clock}
          title="Heures Supplémentaires"
          value={`${totalSupplementaryHours25 + totalSupplementaryHours50 + totalComplementaryHours10}h`}
          subtext="Toutes majorations"
          color="green"
        />

        <InfoCard
          icon={Clock}
          title="Heures de Nuit"
          value={`${mockWorkedHours.reduce(
            (sum, h) => sum + h.nightHours,
            0,
          )}h`}
          subtext="Base"
          color="purple"
        />

        <InfoCard
          icon={Clock}
          title="Dimanche"
          value={`${mockWorkedHours.reduce(
            (sum, h) => sum + h.sundayHours,
            0,
          )}h`}
          subtext="Base"
          color="orange"
        />

        <InfoCard
          icon={Clock}
          title="Jours Fériés"
          value={`${mockWorkedHours.reduce(
            (sum, h) => sum + h.holidayHours,
            0,
          )}h`}
          subtext="Base"
          color="red"
        />
      </InfoCardContainer>

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
          />
        </CardContent>
      </Card>

      {/* Details/Edit Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={(open) => {
          setIsDetailsModalOpen(open);
          if (!open) {
            setSelectedHours(null);
            setIsEditMode(false);
            setFormData({
              employeeId: "",
              date: new Date().toISOString().split("T")[0],
              regularHours: 0,
              supplementaryHours25: 0,
              supplementaryHours50: 0,
              complementaryHours10: 0,
              nightHours: 0,
              sundayHours: 0,
              sundayNightHours: 0,
              holidayHours: 0,
              holidayNightHours: 0,
            });
          }
        }}
        type={isEditMode ? "form" : "details"}
        title={
          isEditMode
            ? "Modifier les heures travaillées"
            : `Heures travaillées - ${selectedHours?.employeeName}`
        }
        description={
          selectedHours
            ? `Déclaration du ${new Date(selectedHours.date).toLocaleDateString("fr-FR")}`
            : ""
        }
        actions={
          isEditMode
            ? {
                primary: {
                  label: "Sauvegarder",
                  onClick: () => {
                    console.log("Saving edited hours:", formData);
                    setIsDetailsModalOpen(false);
                    setIsEditMode(false);
                  },
                },
                secondary: {
                  label: "Annuler",
                  onClick: () => setIsDetailsModalOpen(false),
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
        {isEditMode ? (
          <div className="space-y-4">
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
                      regularHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplementaryHours25">Heures supp. 25%</Label>
                <Input
                  id="supplementaryHours25"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.supplementaryHours25}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supplementaryHours25: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplementaryHours50">Heures supp. 50%</Label>
                <Input
                  id="supplementaryHours50"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.supplementaryHours50}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      supplementaryHours50: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="complementaryHours10">Heures comp. 10%</Label>
                <Input
                  id="complementaryHours10"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.complementaryHours10}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      complementaryHours10: parseFloat(e.target.value) || 0,
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
                      nightHours: parseFloat(e.target.value) || 0,
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
                      sundayHours: parseFloat(e.target.value) || 0,
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
                      holidayHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sundayNightHours">Heures dimanche nuit</Label>
                <Input
                  id="sundayNightHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.sundayNightHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      sundayNightHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="holidayNightHours">
                  Heures jours fériés nuit
                </Label>
                <Input
                  id="holidayNightHours"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.holidayNightHours}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      holidayNightHours: parseFloat(e.target.value) || 0,
                    })
                  }
                />
              </div>
            </div>
          </div>
        ) : (
          selectedHours && (
            <div className="space-y-6">
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
              </div>

              {/* Hours Breakdown */}
              <div className="space-y-4">
                <h4 className="font-medium">D&eacute;tail des heures</h4>

                {/* Regular & Supplementary Hours */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Heures normales et supplémentaires
                  </h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center rounded bg-muted/30 p-2">
                      <span className="text-gray-600">Normales:</span>
                      <span className="font-semibold">
                        {selectedHours.regularHours}h
                      </span>
                    </div>
                    <CategoryTable
                      category="supplementary"
                      hours={selectedHours}
                    />
                  </div>
                </div>

                {/* Night Hours */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Heures de nuit
                  </h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center p-2 rounded bg-purple-50 dark:bg-purple-950/20">
                      <span className="text-gray-600">Base:</span>
                      <span className="font-semibold text-purple-600">
                        {selectedHours.nightHours}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sunday Hours */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Dimanche
                  </h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center p-2 rounded bg-orange-50 dark:bg-orange-950/20">
                      <span className="text-gray-600">Base:</span>
                      <span className="font-semibold text-orange-600">
                        {selectedHours.sundayHours}h
                      </span>
                    </div>
                  </div>
                </div>

                {/* Holiday Hours */}
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-muted-foreground">
                    Jours fériés
                  </h5>
                  <div className="text-xs space-y-1">
                    <div className="flex justify-between items-center p-2 rounded bg-red-50 dark:bg-red-950/20">
                      <span className="text-gray-600">Base:</span>
                      <span className="font-semibold text-red-600">
                        {selectedHours.holidayHours}h
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Employee Info */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <div className="flex-1">
                  <p className="font-semibold">{selectedHours.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {
                      mockEmployees.find(
                        (e) => e.id === selectedHours.employeeId,
                      )?.employeeNumber
                    }{" "}
                    -{" "}
                    {
                      mockEmployees.find(
                        (e) => e.id === selectedHours.employeeId,
                      )?.department
                    }
                  </p>
                </div>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  );
}
