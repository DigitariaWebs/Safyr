"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle,
  XCircle,
  MoreVertical,
  Award,
  Clock,
  Calendar,
  Users,
  Eye,
  RotateCcw,
  Plus,
} from "lucide-react";
import type { TrainingCertification } from "@/lib/types";

// Mock data for SST certifications with recycles
const mockSSTCertifications: TrainingCertification[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    type: "SST",
    number: "SST-2024-001",
    issueDate: new Date("2022-03-15"),
    expiryDate: new Date("2024-03-15"),
    issuer: "INRS",
    status: "valid",
    lastRenewalDate: new Date("2022-03-15"),
    nextRenewalDate: new Date("2024-03-15"),
    validated: true,
    validatedBy: "Admin",
    validatedAt: new Date("2022-03-15"),
    createdAt: new Date("2022-03-15"),
    updatedAt: new Date("2022-03-15"),
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    type: "SST",
    number: "SST-2024-002",
    issueDate: new Date("2023-06-01"),
    expiryDate: new Date("2025-06-01"),
    issuer: "INRS",
    status: "valid",
    lastRenewalDate: new Date("2023-06-01"),
    nextRenewalDate: new Date("2025-06-01"),
    validated: true,
    validatedBy: "Admin",
    validatedAt: new Date("2023-06-01"),
    createdAt: new Date("2023-06-01"),
    updatedAt: new Date("2023-06-01"),
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Pierre Durand",
    type: "SST",
    number: "SST-2024-003",
    issueDate: new Date("2021-09-10"),
    expiryDate: new Date("2023-09-10"),
    issuer: "INRS",
    status: "expired",
    lastRenewalDate: new Date("2021-09-10"),
    nextRenewalDate: new Date("2023-09-10"),
    validated: true,
    validatedBy: "Admin",
    validatedAt: new Date("2021-09-10"),
    createdAt: new Date("2021-09-10"),
    updatedAt: new Date("2021-09-10"),
  },
];

export default function SSTPage() {
  const [certifications, setCertifications] = useState<TrainingCertification[]>(
    mockSSTCertifications,
  );
  const [isRecycleModalOpen, setIsRecycleModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] =
    useState(false);
  const [selectedCertification, setSelectedCertification] =
    useState<TrainingCertification | null>(null);
  const [recycleForm, setRecycleForm] = useState({
    recycleDate: "",
    newExpiryDate: "",
    notes: "",
  });
  const [certificationForm, setCertificationForm] = useState({
    employeeId: "",
    employeeName: "",
    number: "",
    issueDate: "",
    expiryDate: "",
    issuer: "INRS",
  });

  const handleAddRecycle = (certification: TrainingCertification) => {
    setSelectedCertification(certification);
    setRecycleForm({
      recycleDate: new Date().toISOString().split("T")[0],
      newExpiryDate: "",
      notes: "",
    });
    setIsRecycleModalOpen(true);
  };

  const handleViewCertification = (certification: TrainingCertification) => {
    setSelectedCertification(certification);
    setIsViewModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setCertificationForm({
      employeeId: "",
      employeeName: "",
      number: "",
      issueDate: "",
      expiryDate: "",
      issuer: "INRS",
    });
    setIsCertificationModalOpen(true);
  };

  const handleCreateCertification = () => {
    const certification: TrainingCertification = {
      id: `SST-${Date.now()}`,
      employeeId: certificationForm.employeeId,
      employeeName: certificationForm.employeeName,
      type: "SST",
      number: certificationForm.number,
      issueDate: new Date(certificationForm.issueDate),
      expiryDate: new Date(certificationForm.expiryDate),
      issuer: certificationForm.issuer,
      status: "valid",
      lastRenewalDate: new Date(certificationForm.issueDate),
      nextRenewalDate: new Date(certificationForm.expiryDate),
      validated: true,
      validatedBy: "Admin",
      validatedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCertifications([...certifications, certification]);
    setIsCertificationModalOpen(false);
  };

  const handleCreateRecycle = () => {
    if (selectedCertification) {
      // Update certification with new recycle
      setCertifications(
        certifications.map((c) =>
          c.id === selectedCertification.id
            ? {
                ...c,
                lastRenewalDate: new Date(recycleForm.recycleDate),
                expiryDate: new Date(recycleForm.newExpiryDate),
                nextRenewalDate: new Date(recycleForm.newExpiryDate),
                status: "valid",
                updatedAt: new Date(),
              }
            : c,
        ),
      );
    }

    setIsRecycleModalOpen(false);
    setRecycleForm({
      recycleDate: "",
      newExpiryDate: "",
      notes: "",
    });
  };

  const columns: ColumnDef<TrainingCertification>[] = [
    {
      key: "employee",
      label: "Employé",
      icon: Users,
      sortable: true,
      sortValue: (certification) => certification.employeeName,
      render: (certification) => (
        <div>
          <div className="font-medium">{certification.employeeName}</div>
          <div className="text-sm text-muted-foreground">
            {certification.employeeId}
          </div>
        </div>
      ),
    },
    {
      key: "initialCertification",
      label: "Certification initiale",
      icon: Calendar,
      sortable: true,
      render: (certification) => (
        <span className="text-sm">
          {certification.issueDate.toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "lastRecycle",
      label: "Dernier recyclage",
      icon: RotateCcw,
      sortable: true,
      render: (certification) => (
        <span className="text-sm">
          {certification.lastRenewalDate?.toLocaleDateString("fr-FR") || "-"}
        </span>
      ),
    },
    {
      key: "nextRecycle",
      label: "Prochain recyclage",
      icon: Clock,
      sortable: true,
      render: (certification) => (
        <span className="text-sm">
          {certification.nextRenewalDate?.toLocaleDateString("fr-FR") || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (certification) => (
        <Badge
          variant={
            certification.status === "valid"
              ? "default"
              : certification.status === "expiring-soon"
                ? "secondary"
                : "destructive"
          }
        >
          {certification.status === "valid"
            ? "Valide"
            : certification.status === "expiring-soon"
              ? "Expire bientôt"
              : "Expiré"}
        </Badge>
      ),
    },
  ];

  const validCount = certifications.filter((c) => c.status === "valid").length;
  const expiringSoonCount = certifications.filter(
    (c) => c.status === "expiring-soon",
  ).length;
  const expiredCount = certifications.filter(
    (c) => c.status === "expired",
  ).length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            SST & Recyclages
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Suivi des certifications SST et gestion des recyclages
          </p>
        </div>
        <Button onClick={handleOpenCreateModal} className="gap-2">
          <Plus className="h-4 w-4" />
          Nouvelle certification
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total SST</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certifications.length}</div>
            <p className="text-xs text-muted-foreground">
              Certifications actives
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valides</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {validCount}
            </div>
            <p className="text-xs text-muted-foreground">
              En cours de validité
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Recyclages dus
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {expiringSoonCount}
            </div>
            <p className="text-xs text-muted-foreground">Dans les 3 mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expirées</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {expiredCount}
            </div>
            <p className="text-xs text-muted-foreground">À recycler</p>
          </CardContent>
        </Card>
      </div>

      {/* Certifications DataTable */}
      <DataTable
        data={certifications}
        columns={columns}
        searchKeys={["employeeName", "number"]}
        getSearchValue={(certification) =>
          `${certification.employeeName} ${certification.number}`
        }
        searchPlaceholder="Rechercher par employé ou numéro..."
        getRowId={(certification) => certification.id}
        filters={[
          {
            key: "status",
            label: "Statut",
            options: [
              { value: "all", label: "Tous" },
              { value: "valid", label: "Valide" },
              { value: "expiring-soon", label: "Expire bientôt" },
              { value: "expired", label: "Expiré" },
            ],
          },
        ]}
        actions={(certification) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewCertification(certification)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleAddRecycle(certification)}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Ajouter recyclage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* View Certification Modal */}
      <Modal
        open={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        type="details"
        title="Détails de la certification SST"
        size="md"
      >
        {selectedCertification && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Employé</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCertification.employeeName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {selectedCertification.employeeId}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Numéro</Label>
                <p className="text-sm font-mono">
                  {selectedCertification.number}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Émetteur</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCertification.issuer}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Statut</Label>
                <div className="mt-1">
                  <Badge
                    variant={
                      selectedCertification.status === "valid"
                        ? "default"
                        : selectedCertification.status === "expiring-soon"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedCertification.status === "valid"
                      ? "Valide"
                      : selectedCertification.status === "expiring-soon"
                        ? "Expire bientôt"
                        : "Expiré"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">
                  Certification initiale
                </Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCertification.issueDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Dernier recyclage</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCertification.lastRenewalDate?.toLocaleDateString(
                    "fr-FR",
                  ) || "-"}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Expiration</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedCertification.expiryDate.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
              <div>
                Créée le{" "}
                {selectedCertification.createdAt.toLocaleDateString("fr-FR")}
              </div>
              <div>
                Modifiée le{" "}
                {selectedCertification.updatedAt.toLocaleDateString("fr-FR")}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Recycle Modal */}
      <Modal
        open={isRecycleModalOpen}
        onOpenChange={setIsRecycleModalOpen}
        type="form"
        title="Ajouter un recyclage SST"
        size="md"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsRecycleModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Ajouter recyclage",
            onClick: handleCreateRecycle,
            disabled: !recycleForm.recycleDate || !recycleForm.newExpiryDate,
          },
        }}
      >
        <div className="space-y-4">
          {selectedCertification && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5" />
                <div>
                  <p className="font-medium">
                    {selectedCertification.employeeName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    SST - {selectedCertification.number}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="recycleDate">
                Date du recyclage <span className="text-destructive">*</span>
              </Label>
              <Input
                id="recycleDate"
                type="date"
                value={recycleForm.recycleDate}
                onChange={(e) =>
                  setRecycleForm((prev) => ({
                    ...prev,
                    recycleDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newExpiryDate">
                Nouvelle date d&apos;expiration{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="newExpiryDate"
                type="date"
                value={recycleForm.newExpiryDate}
                onChange={(e) =>
                  setRecycleForm((prev) => ({
                    ...prev,
                    newExpiryDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input
              id="notes"
              value={recycleForm.notes}
              onChange={(e) =>
                setRecycleForm((prev) => ({
                  ...prev,
                  notes: e.target.value,
                }))
              }
              placeholder="Notes sur le recyclage"
            />
          </div>
        </div>
      </Modal>

      {/* Certification Modal (Create) */}
      <Modal
        open={isCertificationModalOpen}
        onOpenChange={setIsCertificationModalOpen}
        type="form"
        title="Nouvelle certification SST"
        size="md"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsCertificationModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Créer",
            onClick: handleCreateCertification,
            disabled:
              !certificationForm.employeeName || !certificationForm.number,
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employee">
              Employé <span className="text-destructive">*</span>
            </Label>
            <Input
              id="employee"
              value={certificationForm.employeeName}
              onChange={(e) =>
                setCertificationForm((prev) => ({
                  ...prev,
                  employeeName: e.target.value,
                }))
              }
              placeholder="Nom de l'employé"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="number">
              Numéro de certification{" "}
              <span className="text-destructive">*</span>
            </Label>
            <Input
              id="number"
              value={certificationForm.number}
              onChange={(e) =>
                setCertificationForm((prev) => ({
                  ...prev,
                  number: e.target.value,
                }))
              }
              placeholder="SST-2024-001"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issuer">Émetteur</Label>
              <Select
                value={certificationForm.issuer}
                onValueChange={(value) =>
                  setCertificationForm((prev) => ({ ...prev, issuer: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="INRS">INRS</SelectItem>
                  <SelectItem value="SDIS">SDIS</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issueDate">Date d&apos;émission</Label>
              <Input
                id="issueDate"
                type="date"
                value={certificationForm.issueDate}
                onChange={(e) =>
                  setCertificationForm((prev) => ({
                    ...prev,
                    issueDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d&apos;expiration</Label>
              <Input
                id="expiryDate"
                type="date"
                value={certificationForm.expiryDate}
                onChange={(e) =>
                  setCertificationForm((prev) => ({
                    ...prev,
                    expiryDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
