"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Users,
  MapPin,
  Award,
  Download,
  History,
  FileText,
} from "lucide-react";
import {
  mockEmployeeContracts,
  mockEmployeeAssignments,
  mockEmployeeQualifications,
  mockAbsenceImportConfigs,
  mockContractHistory,
  mockEmploymentDeclarations,
  EmployeeContract,
  EmployeeAssignment,
  EmployeeQualification,
  AbsenceImportConfig,
  ContractHistory,
  EmploymentDeclaration,
} from "@/data/payroll-employee-config";

type EntityType =
  | "contract"
  | "assignment"
  | "qualification"
  | "absenceImport"
  | "contractHistory"
  | "declaration";
type ModalMode = "view" | "create" | "edit" | null;

export default function EmployeeConfigurationPage() {
  const [activeTab, setActiveTab] = useState("contracts");
  const [contracts, setContracts] = useState<EmployeeContract[]>(
    mockEmployeeContracts,
  );
  const [assignments, setAssignments] = useState<EmployeeAssignment[]>(
    mockEmployeeAssignments,
  );
  const [qualifications, setQualifications] = useState<EmployeeQualification[]>(
    mockEmployeeQualifications,
  );
  const [absenceConfigs, setAbsenceConfigs] = useState<AbsenceImportConfig[]>(
    mockAbsenceImportConfigs,
  );
  const [contractHistory, setContractHistory] =
    useState<ContractHistory[]>(mockContractHistory);
  const [declarations, setDeclarations] = useState<EmploymentDeclaration[]>(
    mockEmploymentDeclarations,
  );

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    | EmployeeContract
    | EmployeeAssignment
    | EmployeeQualification
    | AbsenceImportConfig
    | ContractHistory
    | EmploymentDeclaration
    | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Columns for Contracts
  const contractColumns: ColumnDef<EmployeeContract>[] = [
    {
      key: "employeeName",
      label: "Salarié",
      sortable: true,
    },
    {
      key: "contractType",
      label: "Type Contrat",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.contractType}</Badge>,
    },
    {
      key: "position",
      label: "Poste",
      sortable: true,
    },
    {
      key: "category",
      label: "Catégorie",
      sortable: true,
    },
    {
      key: "hourlyRate",
      label: "Taux Horaire",
      sortable: true,
      render: (item) => `${item.hourlyRate.toFixed(2)} €`,
    },
    {
      key: "monthlyGrossSalary",
      label: "Salaire Brut",
      sortable: true,
      render: (item) => `${item.monthlyGrossSalary.toLocaleString("fr-FR")} €`,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge variant={item.status === "Actif" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
  ];

  // Columns for Assignments
  const assignmentColumns: ColumnDef<EmployeeAssignment>[] = [
    {
      key: "employeeName",
      label: "Salarié",
      sortable: true,
    },
    {
      key: "siteName",
      label: "Site",
      sortable: true,
    },
    {
      key: "clientName",
      label: "Client",
      sortable: true,
    },
    {
      key: "position",
      label: "Poste",
      sortable: true,
    },
    {
      key: "startDate",
      label: "Date Début",
      sortable: true,
      render: (item) => new Date(item.startDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "weeklyHours",
      label: "Heures/Sem",
      sortable: true,
      render: (item) => `${item.weeklyHours}h`,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge variant={item.status === "Actif" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
  ];

  // Columns for Qualifications
  const qualificationColumns: ColumnDef<EmployeeQualification>[] = [
    {
      key: "employeeName",
      label: "Salarié",
      sortable: true,
    },
    {
      key: "qualificationType",
      label: "Type",
      sortable: true,
      render: (item) => (
        <Badge variant="outline">{item.qualificationType}</Badge>
      ),
    },
    {
      key: "qualificationName",
      label: "Qualification",
      sortable: true,
    },
    {
      key: "number",
      label: "Numéro",
      sortable: true,
    },
    {
      key: "issueDate",
      label: "Date Délivrance",
      sortable: true,
      render: (item) => new Date(item.issueDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "expiryDate",
      label: "Date Expiration",
      sortable: true,
      render: (item) =>
        item.expiryDate
          ? new Date(item.expiryDate).toLocaleDateString("fr-FR")
          : "-",
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge
          variant={
            item.status === "Valide"
              ? "default"
              : item.status === "Expire bientôt"
                ? "outline"
                : "secondary"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  // Columns for Contract History
  const contractHistoryColumns: ColumnDef<ContractHistory>[] = [
    {
      key: "employeeName",
      label: "Salarié",
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    {
      key: "description",
      label: "Description",
      sortable: true,
    },
    {
      key: "previousValue",
      label: "Ancienne Valeur",
      sortable: false,
      render: (item) => item.previousValue || "-",
    },
    {
      key: "newValue",
      label: "Nouvelle Valeur",
      sortable: false,
      render: (item) => item.newValue || "-",
    },
    {
      key: "validatedBy",
      label: "Validé Par",
      sortable: true,
    },
  ];

  // Columns for Employment Declarations (DPAE/DUE)
  const declarationColumns: ColumnDef<EmploymentDeclaration>[] = [
    {
      key: "employeeName",
      label: "Salarié",
      sortable: true,
    },
    {
      key: "declarationType",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.declarationType}</Badge>,
    },
    {
      key: "declarationDate",
      label: "Date Déclaration",
      sortable: true,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge
          variant={
            item.status === "Validée"
              ? "default"
              : item.status === "En attente"
                ? "outline"
                : item.status === "Envoyée"
                  ? "secondary"
                  : "destructive"
          }
        >
          {item.status}
        </Badge>
      ),
    },
    {
      key: "reference",
      label: "Référence",
      sortable: true,
      render: (item) => item.reference || "-",
    },
  ];

  // Columns for Absence Import Config
  const absenceConfigColumns: ColumnDef<AbsenceImportConfig>[] = [
    {
      key: "absenceType",
      label: "Type Absence",
      sortable: true,
    },
    {
      key: "sourceModule",
      label: "Source",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.sourceModule}</Badge>,
    },
    {
      key: "importFrequency",
      label: "Fréquence",
      sortable: true,
    },
    {
      key: "autoImport",
      label: "Import Auto",
      render: (item) => (
        <Badge variant={item.autoImport ? "default" : "secondary"}>
          {item.autoImport ? "Oui" : "Non"}
        </Badge>
      ),
    },
    {
      key: "lastImport",
      label: "Dernier Import",
      render: (item) => item.lastImport || "-",
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge variant={item.status === "Actif" ? "default" : "secondary"}>
          {item.status}
        </Badge>
      ),
    },
  ];

  const handleOpenModal = (
    mode: ModalMode,
    type: EntityType,
    item?:
      | EmployeeContract
      | EmployeeAssignment
      | EmployeeQualification
      | AbsenceImportConfig
      | ContractHistory
      | EmploymentDeclaration,
  ) => {
    setModalMode(mode);
    setEntityType(type);
    if (item) {
      setSelectedItem(item);
      setFormData(item);
    } else {
      setSelectedItem(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData(getDefaultFormData(type) as Record<string, any>);
    }
  };

  const getDefaultFormData = (type: EntityType) => {
    switch (type) {
      case "contract":
        return {
          status: "Actif",
          contractType: "CDI",
          category: "Agent",
          weeklyHours: 35,
        };
      case "assignment":
        return { status: "Actif", weeklyHours: 35 };
      case "qualification":
        return { status: "Valide", qualificationType: "Carte Pro" };
      case "absenceImport":
        return {
          status: "Actif",
          autoImport: false,
          importFrequency: "Manuel",
          sourceModule: "Module RH",
        };
      case "contractHistory":
        return {
          type: "Avenant",
          date: new Date().toISOString().split("T")[0],
        };
      case "declaration":
        return {
          declarationType: "DPAE",
          status: "En attente",
          declarationDate: new Date().toISOString().split("T")[0],
        };
      default:
        return {};
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setEntityType(null);
    setSelectedItem(null);
    setFormData({});
  };

  const handleSave = () => {
    if (modalMode === "create") {
      const newId = `${Date.now()}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const newItem = { id: newId, ...formData } as any;

      switch (entityType) {
        case "contract":
          setContracts([...contracts, newItem as EmployeeContract]);
          break;
        case "assignment":
          setAssignments([...assignments, newItem as EmployeeAssignment]);
          break;
        case "qualification":
          setQualifications([
            ...qualifications,
            newItem as EmployeeQualification,
          ]);
          break;
        case "absenceImport":
          setAbsenceConfigs([
            ...absenceConfigs,
            newItem as AbsenceImportConfig,
          ]);
          break;
        case "contractHistory":
          setContractHistory([...contractHistory, newItem as ContractHistory]);
          break;
        case "declaration":
          setDeclarations([...declarations, newItem as EmploymentDeclaration]);
          break;
      }
    } else if (modalMode === "edit" && selectedItem) {
      switch (entityType) {
        case "contract":
          setContracts(
            contracts.map((c) =>
              c.id === selectedItem.id ? { ...c, ...formData } : c,
            ),
          );
          break;
        case "assignment":
          setAssignments(
            assignments.map((a) =>
              a.id === selectedItem.id ? { ...a, ...formData } : a,
            ),
          );
          break;
        case "qualification":
          setQualifications(
            qualifications.map((q) =>
              q.id === selectedItem.id ? { ...q, ...formData } : q,
            ),
          );
          break;
        case "absenceImport":
          setAbsenceConfigs(
            absenceConfigs.map((ac) =>
              ac.id === selectedItem.id ? { ...ac, ...formData } : ac,
            ),
          );
          break;
        case "contractHistory":
          setContractHistory(
            contractHistory.map((ch) =>
              ch.id === selectedItem.id ? { ...ch, ...formData } : ch,
            ),
          );
          break;
        case "declaration":
          setDeclarations(
            declarations.map((d) =>
              d.id === selectedItem.id ? { ...d, ...formData } : d,
            ),
          );
          break;
      }
    }
    handleCloseModal();
  };

  const handleDelete = (
    type: EntityType,
    item:
      | EmployeeContract
      | EmployeeAssignment
      | EmployeeQualification
      | AbsenceImportConfig
      | ContractHistory
      | EmploymentDeclaration,
  ) => {
    switch (type) {
      case "contract":
        setContracts(contracts.filter((c) => c.id !== item.id));
        break;
      case "assignment":
        setAssignments(assignments.filter((a) => a.id !== item.id));
        break;
      case "qualification":
        setQualifications(qualifications.filter((q) => q.id !== item.id));
        break;
      case "absenceImport":
        setAbsenceConfigs(absenceConfigs.filter((ac) => ac.id !== item.id));
        break;
      case "contractHistory":
        setContractHistory(contractHistory.filter((ch) => ch.id !== item.id));
        break;
      case "declaration":
        setDeclarations(declarations.filter((d) => d.id !== item.id));
        break;
    }
  };

  const renderActions = (
    type: EntityType,
    item:
      | EmployeeContract
      | EmployeeAssignment
      | EmployeeQualification
      | AbsenceImportConfig
      | ContractHistory
      | EmploymentDeclaration,
  ) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleOpenModal("view", type, item)}>
          <Eye className="h-4 w-4 mr-2" />
          Voir
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleOpenModal("edit", type, item)}>
          <Pencil className="h-4 w-4 mr-2" />
          Modifier
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleDelete(type, item)}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Supprimer
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const renderFormFields = () => {
    if (!entityType) return null;

    const isView = modalMode === "view";

    switch (entityType) {
      case "contract":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                ID Salarié *
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Nom Salarié *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="contractType" className="text-right">
                Type Contrat *
              </Label>
              <Select
                value={formData.contractType}
                onValueChange={(value) =>
                  setFormData({ ...formData, contractType: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Intérim">Intérim</SelectItem>
                  <SelectItem value="Apprentissage">Apprentissage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Date Début *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Date Fin
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Poste *
              </Label>
              <Input
                id="position"
                value={formData.position || ""}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="category" className="text-right">
                Catégorie *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Agent">Agent</SelectItem>
                  <SelectItem value="Chef équipe">
                    Chef d&apos;équipe
                  </SelectItem>
                  <SelectItem value="Cadre">Cadre</SelectItem>
                  <SelectItem value="Administratif">Administratif</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="hourlyRate" className="text-right">
                Taux Horaire (€) *
              </Label>
              <Input
                id="hourlyRate"
                type="number"
                step="0.01"
                value={formData.hourlyRate || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hourlyRate: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="monthlyGrossSalary" className="text-right">
                Salaire Brut (€) *
              </Label>
              <Input
                id="monthlyGrossSalary"
                type="number"
                step="0.01"
                value={formData.monthlyGrossSalary || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    monthlyGrossSalary: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weeklyHours" className="text-right">
                Heures/Semaine *
              </Label>
              <Input
                id="weeklyHours"
                type="number"
                value={formData.weeklyHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weeklyHours: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "assignment":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                ID Salarié *
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Nom Salarié *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siteId" className="text-right">
                ID Site *
              </Label>
              <Input
                id="siteId"
                value={formData.siteId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siteName" className="text-right">
                Nom Site *
              </Label>
              <Input
                id="siteName"
                value={formData.siteName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siteName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientName" className="text-right">
                Nom Client *
              </Label>
              <Input
                id="clientName"
                value={formData.clientName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Date Début *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                Date Fin
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="position" className="text-right">
                Poste *
              </Label>
              <Input
                id="position"
                value={formData.position || ""}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weeklyHours" className="text-right">
                Heures/Semaine *
              </Label>
              <Input
                id="weeklyHours"
                type="number"
                value={formData.weeklyHours || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    weeklyHours: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Terminé">Terminé</SelectItem>
                  <SelectItem value="Suspendu">Suspendu</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "qualification":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                ID Salarié *
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Nom Salarié *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qualificationType" className="text-right">
                Type *
              </Label>
              <Select
                value={formData.qualificationType}
                onValueChange={(value) =>
                  setFormData({ ...formData, qualificationType: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CQP">CQP</SelectItem>
                  <SelectItem value="Carte Pro">Carte Pro</SelectItem>
                  <SelectItem value="SST">SST</SelectItem>
                  <SelectItem value="SSIAP">SSIAP</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="qualificationName" className="text-right">
                Nom Qualification *
              </Label>
              <Input
                id="qualificationName"
                value={formData.qualificationName || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualificationName: e.target.value,
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="number" className="text-right">
                Numéro *
              </Label>
              <Input
                id="number"
                value={formData.number || ""}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="issueDate" className="text-right">
                Date Délivrance *
              </Label>
              <Input
                id="issueDate"
                type="date"
                value={formData.issueDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, issueDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="expiryDate" className="text-right">
                Date Expiration
              </Label>
              <Input
                id="expiryDate"
                type="date"
                value={formData.expiryDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, expiryDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Valide">Valide</SelectItem>
                  <SelectItem value="Expire bientôt">Expire bientôt</SelectItem>
                  <SelectItem value="Expiré">Expiré</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "absenceImport":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="absenceType" className="text-right">
                Type Absence *
              </Label>
              <Select
                value={formData.absenceType}
                onValueChange={(value) =>
                  setFormData({ ...formData, absenceType: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Maladie">Maladie</SelectItem>
                  <SelectItem value="AT/MP">AT/MP</SelectItem>
                  <SelectItem value="Congés Payés">Congés Payés</SelectItem>
                  <SelectItem value="Congé Sans Solde">
                    Congé Sans Solde
                  </SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sourceModule" className="text-right">
                Module Source *
              </Label>
              <Select
                value={formData.sourceModule}
                onValueChange={(value) =>
                  setFormData({ ...formData, sourceModule: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Module RH">Module RH</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="Externe">Externe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="importFrequency" className="text-right">
                Fréquence *
              </Label>
              <Select
                value={formData.importFrequency}
                onValueChange={(value) =>
                  setFormData({ ...formData, importFrequency: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Temps réel">Temps réel</SelectItem>
                  <SelectItem value="Quotidien">Quotidien</SelectItem>
                  <SelectItem value="Hebdomadaire">Hebdomadaire</SelectItem>
                  <SelectItem value="Manuel">Manuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="autoImport" className="text-right">
                Import Automatique
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="autoImport"
                  checked={formData.autoImport || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, autoImport: checked })
                  }
                  disabled={isView}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastImport" className="text-right">
                Dernier Import
              </Label>
              <Input
                id="lastImport"
                value={formData.lastImport || ""}
                onChange={(e) =>
                  setFormData({ ...formData, lastImport: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
                placeholder="YYYY-MM-DD HH:MM"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Actif">Actif</SelectItem>
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "contractHistory":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                ID Salarié *
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
                placeholder="EMP001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Nom Salarié *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date || ""}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type *
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Avenant">Avenant</SelectItem>
                  <SelectItem value="Modification">Modification</SelectItem>
                  <SelectItem value="Renouvellement">Renouvellement</SelectItem>
                  <SelectItem value="Rupture">Rupture</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description *
              </Label>
              <Input
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="previousValue" className="text-right">
                Ancienne Valeur
              </Label>
              <Input
                id="previousValue"
                value={formData.previousValue || ""}
                onChange={(e) =>
                  setFormData({ ...formData, previousValue: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="newValue" className="text-right">
                Nouvelle Valeur
              </Label>
              <Input
                id="newValue"
                value={formData.newValue || ""}
                onChange={(e) =>
                  setFormData({ ...formData, newValue: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="validatedBy" className="text-right">
                Validé Par *
              </Label>
              <Input
                id="validatedBy"
                value={formData.validatedBy || ""}
                onChange={(e) =>
                  setFormData({ ...formData, validatedBy: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
          </>
        );

      case "declaration":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeId" className="text-right">
                ID Salarié *
              </Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeId: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
                placeholder="EMP001"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeName" className="text-right">
                Nom Salarié *
              </Label>
              <Input
                id="employeeName"
                value={formData.employeeName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, employeeName: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="declarationType" className="text-right">
                Type Déclaration *
              </Label>
              <Select
                value={formData.declarationType}
                onValueChange={(value) =>
                  setFormData({ ...formData, declarationType: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DPAE">DPAE</SelectItem>
                  <SelectItem value="DUE">DUE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="declarationDate" className="text-right">
                Date Déclaration *
              </Label>
              <Input
                id="declarationDate"
                type="date"
                value={formData.declarationDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, declarationDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Statut *
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="En attente">En attente</SelectItem>
                  <SelectItem value="Envoyée">Envoyée</SelectItem>
                  <SelectItem value="Validée">Validée</SelectItem>
                  <SelectItem value="Rejetée">Rejetée</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reference" className="text-right">
                Référence
              </Label>
              <Input
                id="reference"
                value={formData.reference || ""}
                onChange={(e) =>
                  setFormData({ ...formData, reference: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
                placeholder="DPAE-2024-XX-XXX"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const entityName = {
      contract: "Contrat",
      assignment: "Affectation",
      qualification: "Habilitation",
      absenceImport: "Configuration Import",
      contractHistory: "Historique",
      declaration: "Déclaration",
    }[entityType || "contract"];

    return modalMode === "create"
      ? `Nouveau ${entityName}`
      : modalMode === "edit"
        ? `Modifier ${entityName}`
        : `Détails ${entityName}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuration Salariés</h1>
        <p className="text-muted-foreground">
          Contrats, affectations, habilitations et import des absences
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="contracts">
            <Users className="h-4 w-4 mr-2" />
            Contrats
          </TabsTrigger>
          <TabsTrigger value="contractHistory">
            <History className="h-4 w-4 mr-2" />
            Historique
          </TabsTrigger>
          <TabsTrigger value="declarations">
            <FileText className="h-4 w-4 mr-2" />
            DPAE/DUE
          </TabsTrigger>
          <TabsTrigger value="assignments">
            <MapPin className="h-4 w-4 mr-2" />
            Affectations
          </TabsTrigger>
          <TabsTrigger value="qualifications">
            <Award className="h-4 w-4 mr-2" />
            Habilitations
          </TabsTrigger>
          <TabsTrigger value="absenceImport">
            <Download className="h-4 w-4 mr-2" />
            Import Absences
          </TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Contrats Salariés</h2>
              <p className="text-sm text-muted-foreground">
                Gestion des contrats et conditions d&apos;emploi
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "contract")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Contrat
            </Button>
          </div>
          <DataTable
            data={contracts}
            columns={contractColumns}
            searchKeys={["employeeName", "position", "contractType"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("contract", item)}
            onRowClick={(item) => handleOpenModal("view", "contract", item)}
          />
        </TabsContent>

        {/* Contract History Tab */}
        <TabsContent value="contractHistory" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Historique des Contrats</h2>
              <p className="text-sm text-muted-foreground">
                Avenants, modifications et changements contractuels
              </p>
            </div>
            <Button
              onClick={() => handleOpenModal("create", "contractHistory")}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvel Historique
            </Button>
          </div>
          <DataTable
            data={contractHistory}
            columns={contractHistoryColumns}
            searchKeys={["employeeName", "type", "description"]}
            searchPlaceholder="Rechercher..."
            actions={(item) =>
              renderActions("contractHistory", item as ContractHistory)
            }
            onRowClick={(item) =>
              handleOpenModal(
                "view",
                "contractHistory",
                item as ContractHistory,
              )
            }
          />
        </TabsContent>

        {/* Employment Declarations Tab */}
        <TabsContent value="declarations" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Déclarations DPAE/DUE</h2>
              <p className="text-sm text-muted-foreground">
                Déclarations préalables à l&apos;embauche et déclarations
                uniques
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "declaration")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Déclaration
            </Button>
          </div>
          <DataTable
            data={declarations}
            columns={declarationColumns}
            searchKeys={["employeeName", "declarationType", "reference"]}
            searchPlaceholder="Rechercher..."
            actions={(item) =>
              renderActions("declaration", item as EmploymentDeclaration)
            }
            onRowClick={(item) =>
              handleOpenModal(
                "view",
                "declaration",
                item as EmploymentDeclaration,
              )
            }
          />
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Affectations</h2>
              <p className="text-sm text-muted-foreground">
                Affectations sites et clients
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "assignment")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Affectation
            </Button>
          </div>
          <DataTable
            data={assignments}
            columns={assignmentColumns}
            searchKeys={["employeeName", "siteName", "clientName"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("assignment", item)}
            onRowClick={(item) => handleOpenModal("view", "assignment", item)}
          />
        </TabsContent>

        {/* Qualifications Tab */}
        <TabsContent value="qualifications" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Habilitations</h2>
              <p className="text-sm text-muted-foreground">
                CQP, cartes professionnelles et qualifications
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "qualification")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Habilitation
            </Button>
          </div>
          <DataTable
            data={qualifications}
            columns={qualificationColumns}
            searchKeys={["employeeName", "qualificationName", "number"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("qualification", item)}
            onRowClick={(item) =>
              handleOpenModal("view", "qualification", item)
            }
          />
        </TabsContent>

        {/* Absence Import Config Tab */}
        <TabsContent value="absenceImport" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">
                Configuration Import Absences
              </h2>
              <p className="text-sm text-muted-foreground">
                Paramétrage automatique des imports d&apos;absences
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "absenceImport")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Configuration
            </Button>
          </div>
          <DataTable
            data={absenceConfigs}
            columns={absenceConfigColumns}
            searchKeys={["absenceType", "sourceModule"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("absenceImport", item)}
            onRowClick={(item) =>
              handleOpenModal("view", "absenceImport", item)
            }
          />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Dialog open={modalMode !== null} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getModalTitle()}</DialogTitle>
            <DialogDescription>
              {modalMode === "view"
                ? "Informations détaillées"
                : "Renseignez les informations"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">{renderFormFields()}</div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseModal}>
              {modalMode === "view" ? "Fermer" : "Annuler"}
            </Button>
            {modalMode !== "view" && (
              <Button onClick={handleSave}>Enregistrer</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
