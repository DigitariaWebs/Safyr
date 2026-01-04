"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Download,
} from "lucide-react";
import type { TimeOffRequest } from "@/lib/types";
import {
  mockTimeOffRequests,
  mockTimeManagementStats,
} from "@/data/time-management";

export default function TimeManagementPage() {
  const [requests] = useState<TimeOffRequest[]>(mockTimeOffRequests);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TimeOffRequest | null>(
    null,
  );
  const [newRequestData, setNewRequestData] = useState({
    employeeId: "",
    type: "vacation" as TimeOffRequest["type"],
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [validationComment, setValidationComment] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);

  // Mock employee data for selection
  const mockEmployees = [
    { id: "1", name: "Jean Dupont", number: "EMP001", department: "Sécurité" },
    {
      id: "2",
      name: "Marie Martin",
      number: "EMP002",
      department: "Direction",
    },
    { id: "3", name: "Pierre Bernard", number: "EMP003", department: "RH" },
    {
      id: "4",
      name: "Sophie Dubois",
      number: "EMP004",
      department: "Commercial",
    },
    { id: "5", name: "Luc Moreau", number: "EMP005", department: "Sécurité" },
    {
      id: "6",
      name: "Claire Petit",
      number: "EMP006",
      department: "Direction",
    },
    { id: "7", name: "Thomas Roux", number: "EMP007", department: "RH" },
    { id: "8", name: "Emma Leroy", number: "EMP008", department: "Commercial" },
    {
      id: "9",
      name: "Alexandre Simon",
      number: "EMP009",
      department: "Sécurité",
    },
    {
      id: "10",
      name: "Julie Laurent",
      number: "EMP010",
      department: "Direction",
    },
    { id: "11", name: "Michel Blanc", number: "EMP011", department: "RH" },
    {
      id: "12",
      name: "Céline Garnier",
      number: "EMP012",
      department: "Commercial",
    },
  ];

  const filteredEmployees = mockEmployees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.number.toLowerCase().includes(employeeSearch.toLowerCase()) ||
      employee.department.toLowerCase().includes(employeeSearch.toLowerCase()),
  );

  const getStatusBadge = (status: TimeOffRequest["status"]) => {
    const variants = {
      pending: {
        variant: "secondary" as const,
        label: "En attente",
        icon: Clock,
      },
      approved: {
        variant: "default" as const,
        label: "Approuvé",
        icon: CheckCircle,
      },
      rejected: {
        variant: "destructive" as const,
        label: "Refusé",
        icon: XCircle,
      },
      cancelled: {
        variant: "outline" as const,
        label: "Annulé",
        icon: XCircle,
      },
    };
    return variants[status];
  };

  const getTypeLabel = (type: TimeOffRequest["type"]) => {
    const labels = {
      vacation: "Congés",
      sick_leave: "Arrêt maladie",
      unpaid_leave: "Congé sans solde",
      maternity_leave: "Congé maternité",
      paternity_leave: "Congé paternité",
      family_event: "Événement familial",
      training: "Formation",
      cse_delegation: "Délégation CSE",
    };
    return labels[type];
  };

  const handleNewRequestChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setNewRequestData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDays = () => {
    if (!newRequestData.startDate || !newRequestData.endDate) return 0;
    const start = new Date(newRequestData.startDate);
    const end = new Date(newRequestData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleCreateRequest = () => {
    const selectedEmployee = mockEmployees.find(
      (emp) => emp.id === newRequestData.employeeId,
    );

    const newRequest: TimeOffRequest = {
      id: `REQ${Date.now()}`,
      employeeId: newRequestData.employeeId,
      employeeName: selectedEmployee?.name || "Unknown Employee",
      employeeNumber: selectedEmployee?.number || "Unknown",
      department: selectedEmployee?.department || "Unknown",
      type: newRequestData.type,
      startDate: new Date(newRequestData.startDate),
      endDate: new Date(newRequestData.endDate),
      totalDays: calculateDays(),
      reason: newRequestData.reason,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database via API
    console.log("New time-off request:", newRequest);

    // Reset form and close modal
    setNewRequestData({
      employeeId: "",
      type: "vacation",
      startDate: "",
      endDate: "",
      reason: "",
    });
    setEmployeeSearch("");
    setIsEmployeeDropdownOpen(false);
    setIsNewRequestModalOpen(false);
  };

  const handleEmployeeSelect = (employee: (typeof mockEmployees)[0]) => {
    setNewRequestData((prev) => ({ ...prev, employeeId: employee.id }));
    setEmployeeSearch(`${employee.name} (${employee.number})`);
    setIsEmployeeDropdownOpen(false);
  };

  const handleViewDetails = (request: TimeOffRequest) => {
    setSelectedRequest(request);
    setValidationComment("");
    setIsDetailsModalOpen(true);
  };

  const handleValidation = (approved: boolean) => {
    if (!selectedRequest) return;

    // TODO: API call to validate/reject request
    console.log("Validation:", {
      approved,
      comment: validationComment,
      requestId: selectedRequest.id,
    });

    // Update request status
    // For now, just close modal
    setIsDetailsModalOpen(false);
    setSelectedRequest(null);
    setValidationComment("");
  };

  const requestColumns: ColumnDef<TimeOffRequest>[] = [
    {
      key: "employee",
      label: "Employé",
      sortable: true,
      render: (request) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={`/avatars/employee-${request.employeeId}.jpg`} />
            <AvatarFallback>
              {request.employeeName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="font-semibold truncate">{request.employeeName}</p>
            <p className="text-sm text-muted-foreground truncate">
              {request.employeeNumber}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (request) => (
        <span className="text-sm">{getTypeLabel(request.type)}</span>
      ),
    },
    {
      key: "department",
      label: "Département",
      sortable: true,
      render: (request) => (
        <span className="text-sm truncate">{request.department}</span>
      ),
    },
    {
      key: "period",
      label: "Période",
      sortable: true,
      sortValue: (request) => request.startDate.getTime(),
      render: (request) => (
        <div className="space-y-1">
          <div className="text-sm">
            {request.startDate.toLocaleDateString("fr-FR")} -{" "}
            {request.endDate.toLocaleDateString("fr-FR")}
          </div>
          <div className="text-xs text-muted-foreground">
            {request.totalDays} jour{request.totalDays > 1 ? "s" : ""}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (request) => {
        const statusConfig = getStatusBadge(request.status);
        const StatusIcon = statusConfig.icon;
        return (
          <Badge
            variant={statusConfig.variant}
            className="flex items-center gap-1 w-fit"
          >
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Temps & Absences
          </h1>
          <p className="text-muted-foreground">
            Gestion des congés, absences et heures travaillées
          </p>
        </div>
        <Button onClick={() => setIsNewRequestModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle demande
        </Button>
      </div>

      {/* Stats Cards */}
      <InfoCardContainer>
        <InfoCard
          icon={Calendar}
          title="Total Demandes"
          value={mockTimeManagementStats.totalRequests}
          subtext={`${mockTimeManagementStats.totalAbsenceDays} jours au total`}
          color="gray"
        />

        <InfoCard
          icon={Clock}
          title="En attente"
          value={mockTimeManagementStats.pendingRequests}
          subtext={`Temps moyen: ${mockTimeManagementStats.averageResponseTime}h`}
          color="orange"
        />

        <InfoCard
          icon={CheckCircle}
          title="Approuvées"
          value={mockTimeManagementStats.approvedRequests}
          subtext={`${(
            (mockTimeManagementStats.approvedRequests /
              mockTimeManagementStats.totalRequests) *
            100
          ).toFixed(0)}% du total`}
          color="green"
        />

        <InfoCard
          icon={Users}
          title="Employés absents"
          value={mockTimeManagementStats.employeesOnLeave}
          subtext="Actuellement en congé"
          color="blue"
        />
      </InfoCardContainer>

      {/* Requests Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Demandes de congés</CardTitle>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </CardHeader>
        <CardContent>
          <DataTable
            data={requests}
            columns={requestColumns}
            searchKeys={["employeeName", "employeeNumber", "department"]}
            searchPlaceholder="Rechercher par nom, numéro ou département..."
            itemsPerPage={10}
            filters={[
              {
                key: "status",
                label: "Statut",
                options: [
                  { value: "all", label: "Tous les statuts" },
                  { value: "pending", label: "En attente" },
                  { value: "approved", label: "Approuvé" },
                  { value: "rejected", label: "Refusé" },
                  { value: "cancelled", label: "Annulé" },
                ],
              },
              {
                key: "type",
                label: "Type",
                options: [
                  { value: "all", label: "Tous les types" },
                  { value: "vacation", label: "Congés" },
                  { value: "sick_leave", label: "Arrêt maladie" },
                  { value: "unpaid_leave", label: "Congé sans solde" },
                  { value: "maternity_leave", label: "Congé maternité" },
                  { value: "paternity_leave", label: "Congé paternité" },
                  { value: "family_event", label: "Événement familial" },
                  { value: "training", label: "Formation" },
                  { value: "cse_delegation", label: "Délégation CSE" },
                ],
              },
            ]}
            onRowClick={handleViewDetails}
          />
        </CardContent>
      </Card>

      {/* New Request Modal */}
      <Modal
        open={isNewRequestModalOpen}
        onOpenChange={(open) => {
          setIsNewRequestModalOpen(open);
          if (!open) {
            setNewRequestData({
              employeeId: "",
              type: "vacation",
              startDate: "",
              endDate: "",
              reason: "",
            });
            setEmployeeSearch("");
            setIsEmployeeDropdownOpen(false);
          }
        }}
        type="form"
        title="Nouvelle demande d'absence"
        description="Créer une demande de congé ou d'absence"
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewRequestModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Soumettre la demande",
            onClick: handleCreateRequest,
            disabled:
              !newRequestData.employeeId ||
              !newRequestData.startDate ||
              !newRequestData.endDate,
          },
        }}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeSearch">
              Employé <span className="text-red-500">*</span>
            </Label>
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
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {employee.number} - {employee.department}
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
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {employee.number} - {employee.department}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Type d&apos;absence <span className="text-red-500">*</span>
            </Label>
            <Select
              value={newRequestData.type}
              onValueChange={(value: TimeOffRequest["type"]) =>
                setNewRequestData((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vacation">Congés payés</SelectItem>
                <SelectItem value="sick_leave">Arrêt maladie</SelectItem>
                <SelectItem value="unpaid_leave">Congé sans solde</SelectItem>
                <SelectItem value="maternity_leave">Congé maternité</SelectItem>
                <SelectItem value="paternity_leave">Congé paternité</SelectItem>
                <SelectItem value="family_event">Événement familial</SelectItem>
                <SelectItem value="training">Formation</SelectItem>
                <SelectItem value="cse_delegation">Délégation CSE</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Date de début <span className="text-red-500">*</span>
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={newRequestData.startDate}
                onChange={handleNewRequestChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">
                Date de fin <span className="text-red-500">*</span>
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={newRequestData.endDate}
                onChange={handleNewRequestChange}
                min={newRequestData.startDate}
                required
              />
            </div>
          </div>

          {newRequestData.startDate && newRequestData.endDate && (
            <div className="rounded-md bg-muted p-3">
              <p className="text-sm font-medium">
                Durée: {calculateDays()} jour{calculateDays() > 1 ? "s" : ""}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Motif (optionnel)</Label>
            <Textarea
              id="reason"
              name="reason"
              value={newRequestData.reason}
              onChange={handleNewRequestChange}
              placeholder="Précisez le motif de votre demande..."
              rows={4}
            />
          </div>

          <div className="rounded-md border border-muted bg-muted/50 p-4">
            <h4 className="font-medium mb-2">📋 Informations importantes</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                • Les demandes de congés doivent être faites au moins 2 mois à
                l&apos;avance
              </li>
              <li>
                • Les arrêts maladie doivent être déclarés dans moins de 48h
              </li>
              <li>
                • Les congés maternité/paternité doivent être déclarés au moins
                2 mois à l&apos;avance
              </li>
              <li>• Les heures de délégation CSE sont soumises à validation</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        type="details"
        title={`Demande #${selectedRequest?.id}`}
        description={
          selectedRequest
            ? `${getTypeLabel(selectedRequest.type)} - ${selectedRequest.employeeName}`
            : ""
        }
        actions={
          selectedRequest?.status === "pending"
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
        {selectedRequest && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex justify-center">
              {(() => {
                const statusConfig = getStatusBadge(selectedRequest.status);
                const StatusIcon = statusConfig.icon;
                return (
                  <Badge
                    variant={statusConfig.variant}
                    className="flex items-center gap-1 px-3 py-1"
                  >
                    <StatusIcon className="h-4 w-4" />
                    {statusConfig.label}
                  </Badge>
                );
              })()}
            </div>

            {/* Request Details */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Type de demande
                </label>
                <p className="mt-1 font-medium">
                  {getTypeLabel(selectedRequest.type)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Durée
                </label>
                <p className="mt-1 font-medium">
                  {selectedRequest.totalDays} jour
                  {selectedRequest.totalDays > 1 ? "s" : ""}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date de début
                </label>
                <p className="mt-1 font-medium">
                  {selectedRequest.startDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Date de fin
                </label>
                <p className="mt-1 font-medium">
                  {selectedRequest.endDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {selectedRequest.reason && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Motif
                </label>
                <p className="mt-1">{selectedRequest.reason}</p>
              </div>
            )}

            {/* Employee Info */}
            <Separator />
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`/avatars/employee-${selectedRequest.employeeId}.jpg`}
                />
                <AvatarFallback>
                  {selectedRequest.employeeName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold">{selectedRequest.employeeName}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedRequest.employeeNumber} -{" "}
                  {selectedRequest.department}
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/dashboard/hr/employees/${selectedRequest.employeeId}`}
                >
                  Voir le profil
                </Link>
              </Button>
            </div>

            {/* Validation Section */}
            {selectedRequest.status === "pending" && (
              <>
                <Separator />
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
            {(selectedRequest.status === "approved" ||
              selectedRequest.status === "rejected") && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const StatusIcon = getStatusBadge(
                        selectedRequest.status,
                      ).icon;
                      return <StatusIcon className="h-4 w-4" />;
                    })()}
                    <span className="font-medium">
                      {selectedRequest.status === "approved"
                        ? "Approuvé"
                        : "Refusé"}{" "}
                      par {selectedRequest.validatedBy}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le{" "}
                    {selectedRequest.validatedAt?.toLocaleDateString("fr-FR")} à{" "}
                    {selectedRequest.validatedAt?.toLocaleTimeString("fr-FR")}
                  </p>
                  {selectedRequest.validationComment && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <p className="text-sm">
                        {selectedRequest.validationComment}
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
