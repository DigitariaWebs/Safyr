"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Stepper, Step } from "@/components/ui/stepper";
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
  Send,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
} from "lucide-react";
import type { Employee, EmployeeFormData, Contract } from "@/lib/types";
import { mockEmployees, mockStats } from "@/data/employees";
import { useSendEmail } from "@/hooks/useSendEmail";

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmployees, setSelectedEmployees] = useState<Employee[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null,
  );
  const { openEmailModal } = useSendEmail();
  const [isNewEmployeeModalOpen, setIsNewEmployeeModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [newEmployeeData, setNewEmployeeData] = useState<EmployeeFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "Française",
    gender: "male",
    civilStatus: "single",
    children: 0,
    street: "",
    city: "",
    postalCode: "",
    country: "France",
    iban: "",
    bic: "",
    bankName: "",
    socialSecurityNumber: "",
    employeeNumber: "",
    hireDate: "",
    position: "",
    department: "",
    contractType: "CDI",
    workSchedule: "full-time",
    status: "active",
    cnapsNumber: "",
    ssiapNumber: "",
  });

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

  const handleDelete = (employee: Employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (employeeToDelete) {
      setEmployees(employees.filter((emp) => emp.id !== employeeToDelete.id));
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const handleViewProfile = (employee: Employee) => {
    router.push(`/dashboard/hr/employees/${employee.id}`);
  };

  const handleBulkDelete = () => {
    setIsBulkDeleteModalOpen(true);
  };

  const confirmBulkDelete = () => {
    const idsToDelete = new Set(selectedEmployees.map((emp) => emp.id));
    setEmployees(employees.filter((emp) => !idsToDelete.has(emp.id)));
    setSelectedEmployees([]);
    setIsBulkDeleteModalOpen(false);
  };

  const handleBulkEmail = () => {
    openEmailModal(selectedEmployees, () => {
      setSelectedEmployees([]);
    });
  };

  const handleClearSelection = () => {
    setSelectedEmployees([]);
  };

  const steps: Step[] = [
    {
      label: "Informations personnelles",
      description: "Identité et état civil",
    },
    {
      label: "Coordonnées",
      description: "Contact et adresse",
    },
    {
      label: "Emploi",
      description: "Poste et contrat",
    },
    {
      label: "Informations bancaires",
      description: "RIB et banque",
    },
  ];

  const handleNewEmployeeChange = (field: string, value: string | number) => {
    setNewEmployeeData((prev) => ({
      ...prev,
      [field]: field === "children" ? (value as number) : value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleCreateEmployee();
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreateEmployee = () => {
    const newEmployee: Employee = {
      id: `EMP${Date.now()}`,
      firstName: newEmployeeData.firstName,
      lastName: newEmployeeData.lastName,
      email: newEmployeeData.email,
      phone: newEmployeeData.phone,
      photo: "/avatars/default.jpg",
      dateOfBirth: new Date(newEmployeeData.dateOfBirth),
      placeOfBirth: newEmployeeData.placeOfBirth,
      nationality: newEmployeeData.nationality,
      gender: newEmployeeData.gender as Employee["gender"],
      civilStatus: newEmployeeData.civilStatus as Employee["civilStatus"],
      children: newEmployeeData.children,
      address: {
        street: newEmployeeData.street,
        city: newEmployeeData.city,
        postalCode: newEmployeeData.postalCode,
        country: newEmployeeData.country,
      },
      bankDetails: {
        iban: newEmployeeData.iban,
        bic: newEmployeeData.bic,
        bankName: newEmployeeData.bankName,
      },
      socialSecurityNumber: newEmployeeData.socialSecurityNumber,
      employeeNumber: newEmployeeData.employeeNumber,
      hireDate: new Date(newEmployeeData.hireDate),
      position: newEmployeeData.position,
      department: newEmployeeData.department,
      contractType: newEmployeeData.contractType as Contract["type"],
      workSchedule: newEmployeeData.workSchedule,
      status: newEmployeeData.status as Employee["status"],
      documents: {
        proCard: newEmployeeData.cnapsNumber
          ? {
              id: `PROCARD${Date.now()}`,
              name: "Carte professionnelle CNAPS",
              type: "pro-card",
              fileUrl: "",
              uploadedAt: new Date(),
              uploadedBy: "admin",
              verified: false,
              notes: `Numéro: ${newEmployeeData.cnapsNumber}`,
            }
          : undefined,
        ssiap: newEmployeeData.ssiapNumber
          ? {
              id: `SSIAP${Date.now()}`,
              type: "SSIAP1",
              number: newEmployeeData.ssiapNumber,
              issueDate: new Date(),
              expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
              issuer: "CNAPS",
              verified: false,
              status: "valid",
            }
          : undefined,
      },
      contracts: [],
      assignedEquipment: [],
      savingsPlans: {
        pee: {
          contributions: 0,
          balance: 0,
        },
        pereco: {
          contributions: 0,
          balance: 0,
        },
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setEmployees([...employees, newEmployee]);
    setIsNewEmployeeModalOpen(false);
    setCurrentStep(0);
    setNewEmployeeData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dateOfBirth: "",
      placeOfBirth: "",
      nationality: "Française",
      gender: "male",
      civilStatus: "single",
      children: 0,
      street: "",
      city: "",
      postalCode: "",
      country: "France",
      iban: "",
      bic: "",
      bankName: "",
      socialSecurityNumber: "",
      employeeNumber: "",
      hireDate: "",
      position: "",
      department: "",
      contractType: "CDI",
      workSchedule: "full-time",
      status: "active",
      cnapsNumber: "",
      ssiapNumber: "",
    });
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Personal info
        return (
          newEmployeeData.firstName &&
          newEmployeeData.lastName &&
          newEmployeeData.dateOfBirth
        );
      case 1: // Contact
        return (
          newEmployeeData.email &&
          newEmployeeData.phone &&
          newEmployeeData.street &&
          newEmployeeData.city &&
          newEmployeeData.postalCode
        );
      case 2: // Employment
        return (
          newEmployeeData.employeeNumber &&
          newEmployeeData.socialSecurityNumber &&
          newEmployeeData.position &&
          newEmployeeData.department &&
          newEmployeeData.hireDate
        );
      case 3: // Bank
        return (
          newEmployeeData.iban &&
          newEmployeeData.bic &&
          newEmployeeData.bankName
        );
      default:
        return false;
    }
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
        <Button
          onClick={() => setIsNewEmployeeModalOpen(true)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Nouvel employé
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

      {/* Bulk Actions Toolbar */}
      {selectedEmployees.length > 0 && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="font-medium">
                    {selectedEmployees.length} employé(s) sélectionné(s)
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkEmail}
                    className="gap-2"
                  >
                    <Send className="h-4 w-4" />
                    Envoyer un email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDelete}
                    className="gap-2 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Annuler
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employees DataTable */}
      <DataTable
        data={employees}
        columns={columns}
        searchKeys={["firstName", "lastName", "email", "employeeNumber"]}
        getSearchValue={(employee) =>
          `${employee.firstName} ${employee.lastName} ${employee.email} ${employee.employeeNumber}`
        }
        searchPlaceholder="Rechercher par nom, email, ou numéro d'employé..."
        selectable={true}
        onSelectionChange={setSelectedEmployees}
        getRowId={(employee) => employee.id}
        onRowClick={handleViewProfile}
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
                  href={`/dashboard/hr/employees/${employee.id}?edit=true`}
                  className="flex items-center gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Modifier
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDelete(employee)}
                className="gap-2 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="warning"
        title="Supprimer l'employé"
        description="Cette action est irréversible et supprimera toutes les données associées."
        closable={false}
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: "Supprimer",
            onClick: confirmDelete,
            variant: "destructive",
          },
        }}
      >
        {employeeToDelete && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Vous êtes sur le point de supprimer définitivement :
            </p>
            <div className="rounded-lg border bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={employeeToDelete.photo}
                    alt={employeeToDelete.firstName}
                  />
                  <AvatarFallback>
                    {employeeToDelete.firstName[0]}
                    {employeeToDelete.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {employeeToDelete.firstName} {employeeToDelete.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {employeeToDelete.position} -{" "}
                    {employeeToDelete.employeeNumber}
                  </div>
                </div>
              </div>
            </div>
            <p className="text-sm font-medium text-destructive">
              Cette action supprimera également :
            </p>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>{employeeToDelete.contracts.length} contrat(s)</li>
              <li>Tous les documents associés</li>
              <li>L&apos;historique des équipements</li>
              <li>Les données de présence et congés</li>
            </ul>
          </div>
        )}
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        open={isBulkDeleteModalOpen}
        onOpenChange={setIsBulkDeleteModalOpen}
        type="warning"
        title="Suppression multiple"
        description={`Vous allez supprimer ${selectedEmployees.length} employé(s)`}
        closable={false}
        actions={{
          secondary: {
            label: "Annuler",
            onClick: () => setIsBulkDeleteModalOpen(false),
            variant: "outline",
          },
          primary: {
            label: `Supprimer ${selectedEmployees.length} employé(s)`,
            onClick: confirmBulkDelete,
            variant: "destructive",
          },
        }}
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Cette action est irréversible et supprimera toutes les données
            associées pour les employés suivants :
          </p>
          <div className="rounded-lg border bg-muted/30 p-3 max-h-50 overflow-y-auto">
            <div className="space-y-2">
              {selectedEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center gap-3 py-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={employee.photo}
                      alt={employee.firstName}
                    />
                    <AvatarFallback className="text-xs">
                      {employee.firstName[0]}
                      {employee.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <span className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}
                      - {employee.employeeNumber}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-sm font-medium text-destructive">
            Toutes les données associées (contrats, documents, équipements,
            historiques) seront également supprimées.
          </p>
        </div>
      </Modal>

      {/* New Employee Modal with Stepper */}
      <Modal
        open={isNewEmployeeModalOpen}
        onOpenChange={(open) => {
          setIsNewEmployeeModalOpen(open);
          if (!open) {
            setCurrentStep(0);
            setNewEmployeeData({
              firstName: "",
              lastName: "",
              email: "",
              phone: "",
              dateOfBirth: "",
              placeOfBirth: "",
              nationality: "Française",
              gender: "male",
              civilStatus: "single",
              children: 0,
              street: "",
              city: "",
              postalCode: "",
              country: "France",
              iban: "",
              bic: "",
              bankName: "",
              socialSecurityNumber: "",
              employeeNumber: "",
              hireDate: "",
              position: "",
              department: "",
              contractType: "CDI",
              workSchedule: "full-time",
              status: "active",
              cnapsNumber: "",
              ssiapNumber: "",
            });
          }
        }}
        type="form"
        title="Nouvel employé"
        description={`Étape ${currentStep + 1} sur ${steps.length}`}
        size="xl"
        actions={{
          tertiary:
            currentStep > 0
              ? {
                  label: "Précédent",
                  onClick: handlePrevStep,
                  variant: "outline",
                  icon: <ChevronLeft className="h-4 w-4" />,
                }
              : undefined,
          secondary: {
            label: "Annuler",
            onClick: () => {
              setIsNewEmployeeModalOpen(false);
              setCurrentStep(0);
            },
            variant: "outline",
          },
          primary: {
            label: currentStep === steps.length - 1 ? "Créer" : "Suivant",
            onClick: handleNextStep,
            disabled: !isStepValid(),
            icon:
              currentStep === steps.length - 1 ? (
                <Save className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              ),
          },
        }}
      >
        <div className="space-y-6">
          <Stepper steps={steps} currentStep={currentStep} />

          <div className="min-h-100">
            {/* Step 0: Personal Information */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">
                      Prénom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="firstName"
                      value={newEmployeeData.firstName}
                      onChange={(e) =>
                        handleNewEmployeeChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">
                      Nom <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="lastName"
                      value={newEmployeeData.lastName}
                      onChange={(e) =>
                        handleNewEmployeeChange("lastName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">
                      Date de naissance{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newEmployeeData.dateOfBirth}
                      onChange={(e) =>
                        handleNewEmployeeChange("dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placeOfBirth">
                      Lieu de naissance{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="placeOfBirth"
                      value={newEmployeeData.placeOfBirth}
                      onChange={(e) =>
                        handleNewEmployeeChange("placeOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationalité</Label>
                    <Input
                      id="nationality"
                      value={newEmployeeData.nationality}
                      onChange={(e) =>
                        handleNewEmployeeChange("nationality", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select
                      value={newEmployeeData.gender}
                      onValueChange={(value) =>
                        handleNewEmployeeChange("gender", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="civilStatus">Situation familiale</Label>
                    <Select
                      value={newEmployeeData.civilStatus}
                      onValueChange={(value) =>
                        handleNewEmployeeChange("civilStatus", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Célibataire</SelectItem>
                        <SelectItem value="married">Marié(e)</SelectItem>
                        <SelectItem value="divorced">Divorcé(e)</SelectItem>
                        <SelectItem value="widowed">Veuf/Veuve</SelectItem>
                        <SelectItem value="civil-union">
                          Union civile
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="children">Nombre d&apos;enfants</Label>
                    <Input
                      id="children"
                      type="number"
                      min="0"
                      value={newEmployeeData.children}
                      onChange={(e) =>
                        handleNewEmployeeChange(
                          "children",
                          parseInt(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Contact & Address */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployeeData.email}
                      onChange={(e) =>
                        handleNewEmployeeChange("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">
                      Téléphone <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+33 6 12 34 56 78"
                      value={newEmployeeData.phone}
                      onChange={(e) =>
                        handleNewEmployeeChange("phone", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street">
                    Rue <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="street"
                    value={newEmployeeData.street}
                    onChange={(e) =>
                      handleNewEmployeeChange("street", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">
                      Ville <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="city"
                      value={newEmployeeData.city}
                      onChange={(e) =>
                        handleNewEmployeeChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">
                      Code postal <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="postalCode"
                      value={newEmployeeData.postalCode}
                      onChange={(e) =>
                        handleNewEmployeeChange("postalCode", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Pays</Label>
                    <Input
                      id="country"
                      value={newEmployeeData.country}
                      onChange={(e) =>
                        handleNewEmployeeChange("country", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Employment */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employeeNumber">
                      Numéro d&apos;employé{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="employeeNumber"
                      placeholder="EMP013"
                      value={newEmployeeData.employeeNumber}
                      onChange={(e) =>
                        handleNewEmployeeChange(
                          "employeeNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="socialSecurityNumber">
                      Numéro de sécurité sociale{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="socialSecurityNumber"
                      placeholder="1 90 05 75 001 234 56"
                      value={newEmployeeData.socialSecurityNumber}
                      onChange={(e) =>
                        handleNewEmployeeChange(
                          "socialSecurityNumber",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">
                      Poste <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="position"
                      placeholder="Agent de sécurité"
                      value={newEmployeeData.position}
                      onChange={(e) =>
                        handleNewEmployeeChange("position", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">
                      Département <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="department"
                      placeholder="Sécurité"
                      value={newEmployeeData.department}
                      onChange={(e) =>
                        handleNewEmployeeChange("department", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contractType">Type de contrat</Label>
                    <Select
                      value={newEmployeeData.contractType}
                      onValueChange={(value) =>
                        handleNewEmployeeChange("contractType", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CDI">CDI</SelectItem>
                        <SelectItem value="CDD">CDD</SelectItem>
                        <SelectItem value="INTERIM">Intérim</SelectItem>
                        <SelectItem value="APPRENTICESHIP">
                          Apprentissage
                        </SelectItem>
                        <SelectItem value="INTERNSHIP">Stage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="workSchedule">Temps de travail</Label>
                    <Select
                      value={newEmployeeData.workSchedule}
                      onValueChange={(value) =>
                        handleNewEmployeeChange("workSchedule", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Temps complet</SelectItem>
                        <SelectItem value="part-time">Temps partiel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hireDate">
                      Date d&apos;embauche{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="hireDate"
                      type="date"
                      value={newEmployeeData.hireDate}
                      onChange={(e) =>
                        handleNewEmployeeChange("hireDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnapsNumber">N° carte Pro CNAPS</Label>
                    <Input
                      id="cnapsNumber"
                      placeholder="Numéro de carte CNAPS"
                      value={newEmployeeData.cnapsNumber}
                      onChange={(e) =>
                        handleNewEmployeeChange("cnapsNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ssiapNumber">N° Diplôme SSIAP</Label>
                    <Input
                      id="ssiapNumber"
                      placeholder="Numéro de diplôme SSIAP"
                      value={newEmployeeData.ssiapNumber}
                      onChange={(e) =>
                        handleNewEmployeeChange("ssiapNumber", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select
                      value={newEmployeeData.status}
                      onValueChange={(value) =>
                        handleNewEmployeeChange("status", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="suspended">Suspendu</SelectItem>
                        <SelectItem value="terminated">Terminé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Bank Details */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="iban">
                      IBAN <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="iban"
                      placeholder="FR76 1234 5678 9012 3456 7890 123"
                      value={newEmployeeData.iban}
                      onChange={(e) =>
                        handleNewEmployeeChange("iban", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bic">
                      BIC <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bic"
                      placeholder="BNPAFRPP"
                      value={newEmployeeData.bic}
                      onChange={(e) =>
                        handleNewEmployeeChange("bic", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bankName">
                      Nom de la banque{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="bankName"
                      placeholder="BNP Paribas"
                      value={newEmployeeData.bankName}
                      onChange={(e) =>
                        handleNewEmployeeChange("bankName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
