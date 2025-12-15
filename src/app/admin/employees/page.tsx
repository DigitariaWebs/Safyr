"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Plus,
  AlertCircle,
  Users,
  UserCheck,
  FileWarning,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  ExternalLink,
  Calendar,
  Briefcase,
  MapPin,
} from "lucide-react";
import type { Employee } from "@/types/employee";
import { mockEmployees, mockStats } from "@/data/employees";

export default function EmployeesPage() {
  const [employees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const getStatusBadge = (status: Employee["status"]) => {
    const variants = {
      active: { variant: "default" as const, label: "Actif" },
      inactive: { variant: "secondary" as const, label: "Inactif" },
      suspended: { variant: "destructive" as const, label: "Suspendu" },
      terminated: { variant: "outline" as const, label: "Terminé" },
    };
    const config = variants[status];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      console.log("Delete employee:", id);
    }
  };

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const columns: ColumnDef<Employee>[] = [
    {
      key: "employee",
      label: "Employé",
      icon: UserIcon,
      sortable: true,
      sortValue: (employee) => `${employee.firstName} ${employee.lastName}`,
      render: (employee) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={employee.photo} alt={employee.firstName} />
            <AvatarFallback>
              {employee.firstName[0]}
              {employee.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {employee.firstName} {employee.lastName}
            </div>
            <div className="text-sm text-muted-foreground">
              {employee.employeeNumber}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "position",
      label: "Poste",
      sortable: true,
      render: (employee) => (
        <div>
          <div className="font-medium">{employee.position}</div>
          <div className="text-sm text-muted-foreground">
            {employee.department}
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      icon: Mail,
      sortable: true,
      render: (employee) => (
        <div className="text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            {employee.email}
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-3 w-3" />
            {employee.phone}
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (employee) => getStatusBadge(employee.status),
    },
    {
      key: "hireDate",
      label: "Date d&apos;embauche",
      sortable: true,
      render: (employee) => (
        <span className="text-sm">
          {new Date(employee.hireDate).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Personnel
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Gestion administrative du personnel
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/admin/employees/new">
            <Plus className="h-4 w-4" />
            Nouvel employé
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Employés
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.total}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.active} actifs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Actifs</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.active}</div>
            <p className="text-xs text-muted-foreground">
              {((mockStats.active / mockStats.total) * 100).toFixed(1)}% du
              total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertes expiration
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.expiringCertifications}
            </div>
            <p className="text-xs text-muted-foreground">
              Certificats à renouveler
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contrats en attente
            </CardTitle>
            <FileWarning className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockStats.pendingContracts}
            </div>
            <p className="text-xs text-muted-foreground">Signatures requises</p>
          </CardContent>
        </Card>
      </div>

      {/* Employees DataTable */}
      <DataTable
        data={employees}
        columns={columns}
        searchKeys={["firstName", "lastName", "email", "employeeNumber"]}
        getSearchValue={(employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.employeeNumber}`
        }
        searchPlaceholder="Rechercher par nom, email, ou numéro d'employé..."
        filters={[
          {
            key: "status",
            label: "Statut",
            options: [
              { value: "all", label: "Tous" },
              { value: "active", label: "Actif" },
              { value: "inactive", label: "Inactif" },
              { value: "suspended", label: "Suspendu" },
              { value: "terminated", label: "Terminé" },
            ],
          },
          {
            key: "department",
            label: "Département",
            options: [
              { value: "all", label: "Tous" },
              { value: "Sécurité", label: "Sécurité" },
              { value: "Direction", label: "Direction" },
              { value: "RH", label: "RH" },
              { value: "Commercial", label: "Commercial" },
            ],
          },
        ]}
        actions={(employee) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleViewProfile(employee)}
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                Voir le profil
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={`/admin/employees/${employee.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(employee.id)}
                className="gap-2 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Employee Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        type="details"
        title="Profil de l'employé"
        description={
          selectedEmployee
            ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} - ${selectedEmployee.position}`
            : ""
        }
        actions={{
          secondary: {
            label: "Fermer",
            onClick: () => setIsDetailsModalOpen(false),
            variant: "outline",
          },
          primary: selectedEmployee
            ? {
                label: "Voir le profil complet",
                onClick: () => {
                  window.location.href = `/admin/employees/${selectedEmployee.id}`;
                },
                icon: <ExternalLink className="h-4 w-4" />,
              }
            : undefined,
        }}
      >
        {selectedEmployee && (
          <div className="space-y-6">
            {/* Header with Avatar */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={selectedEmployee.photo}
                  alt={selectedEmployee.firstName}
                />
                <AvatarFallback className="text-lg">
                  {selectedEmployee.firstName[0]}
                  {selectedEmployee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {selectedEmployee.employeeNumber}
                </p>
                <div className="mt-2">
                  {getStatusBadge(selectedEmployee.status)}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Informations de contact
              </h4>
              <div className="grid gap-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{selectedEmployee.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedEmployee.address.street},{" "}
                    {selectedEmployee.address.postalCode}{" "}
                    {selectedEmployee.address.city}
                  </span>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm text-muted-foreground">
                Informations professionnelles
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Briefcase className="h-3 w-3" />
                    <span>Poste</span>
                  </div>
                  <p className="text-sm font-medium">
                    {selectedEmployee.position}
                  </p>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Département
                  </div>
                  <p className="text-sm font-medium">
                    {selectedEmployee.department}
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                    <Calendar className="h-3 w-3" />
                    <span>Date d&apos;embauche</span>
                  </div>
                  <p className="text-sm font-medium">
                    {new Date(selectedEmployee.hireDate).toLocaleDateString(
                      "fr-FR",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      },
                    )}
                  </p>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground mb-1">
                    Contrats
                  </div>
                  <p className="text-sm font-medium">
                    {selectedEmployee.contracts.length} contrat(s)
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="rounded-lg bg-muted/30 p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold">
                    {selectedEmployee.documents
                      ? Object.keys(selectedEmployee.documents).length
                      : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {selectedEmployee.assignedEquipment.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Équipements</p>
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {
                      selectedEmployee.contracts.filter(
                        (c) => c.status === "active",
                      ).length
                    }
                  </p>
                  <p className="text-xs text-muted-foreground">Contrat actif</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-center">
              <p className="text-sm text-muted-foreground">
                Consultez le profil complet pour plus de détails sur les
                certifications, contrats, équipements et historique.
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
