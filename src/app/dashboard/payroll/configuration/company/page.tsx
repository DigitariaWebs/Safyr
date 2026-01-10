"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Building2,
  DollarSign,
  FileText,
  Clock,
  ArrowLeftRight,
} from "lucide-react";
import {
  mockCompanyStructures,
  mockCostCenters,
  mockInternalRules,
  mockMonthlyClosings,
  mockAccountingTransfers,
  CompanyStructure,
  CostCenter,
  InternalRule,
  MonthlyClosing,
  AccountingTransfer,
} from "@/data/payroll-company-config";

type EntityType =
  | "structure"
  | "costCenter"
  | "internalRule"
  | "closing"
  | "transfer";
type ModalMode = "view" | "create" | "edit" | null;

export default function CompanyConfigurationPage() {
  const [activeTab, setActiveTab] = useState("structures");
  const [structures, setStructures] = useState<CompanyStructure[]>(
    mockCompanyStructures,
  );
  const [costCenters, setCostCenters] = useState<CostCenter[]>(mockCostCenters);
  const [internalRules, setInternalRules] =
    useState<InternalRule[]>(mockInternalRules);
  const [closings, setClosings] =
    useState<MonthlyClosing[]>(mockMonthlyClosings);
  const [transfers, setTransfers] = useState<AccountingTransfer[]>(
    mockAccountingTransfers,
  );

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [entityType, setEntityType] = useState<EntityType | null>(null);
  const [selectedItem, setSelectedItem] = useState<
    | CompanyStructure
    | CostCenter
    | InternalRule
    | MonthlyClosing
    | AccountingTransfer
    | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [formData, setFormData] = useState<Record<string, any>>({});

  // Columns for Structures
  const structureColumns: ColumnDef<CompanyStructure>[] = [
    {
      key: "code",
      label: "Code",
      sortable: true,
    },
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    {
      key: "siret",
      label: "SIRET",
      render: (item) => item.siret || "-",
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

  // Columns for Cost Centers
  const costCenterColumns: ColumnDef<CostCenter>[] = [
    {
      key: "code",
      label: "Code",
      sortable: true,
    },
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    {
      key: "budget",
      label: "Budget",
      sortable: true,
      render: (item) =>
        item.budget ? `${item.budget.toLocaleString("fr-FR")} €` : "-",
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

  // Columns for Internal Rules
  const internalRuleColumns: ColumnDef<InternalRule>[] = [
    {
      key: "code",
      label: "Code",
      sortable: true,
    },
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.type}</Badge>,
    },
    {
      key: "calculationBasis",
      label: "Base de Calcul",
      sortable: true,
    },
    {
      key: "frequency",
      label: "Fréquence",
      sortable: true,
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

  // Columns for Monthly Closings
  const closingColumns: ColumnDef<MonthlyClosing>[] = [
    {
      key: "month",
      label: "Mois",
      sortable: true,
    },
    {
      key: "year",
      label: "Année",
      sortable: true,
    },
    {
      key: "closingDate",
      label: "Date de Clôture",
      sortable: true,
      render: (item) => new Date(item.closingDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "payrollAmount",
      label: "Montant Paie",
      sortable: true,
      render: (item) => `${item.payrollAmount.toLocaleString("fr-FR")} €`,
    },
    {
      key: "employeeCount",
      label: "Nb Salariés",
      sortable: true,
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (item) => (
        <Badge
          variant={
            item.status === "Validé"
              ? "default"
              : item.status === "Clôturé"
                ? "secondary"
                : "outline"
          }
        >
          {item.status}
        </Badge>
      ),
    },
  ];

  // Columns for Accounting Transfers
  const transferColumns: ColumnDef<AccountingTransfer>[] = [
    {
      key: "name",
      label: "Nom",
      sortable: true,
    },
    {
      key: "transferType",
      label: "Type",
      sortable: true,
      render: (item) => <Badge variant="outline">{item.transferType}</Badge>,
    },
    {
      key: "accountPrefix",
      label: "Préfixe Compte",
      sortable: true,
    },
    {
      key: "analyticalAxis",
      label: "Axe Analytique",
      render: (item) => item.analyticalAxis || "-",
    },
    {
      key: "automaticTransfer",
      label: "Transfert Auto",
      render: (item) => (
        <Badge variant={item.automaticTransfer ? "default" : "secondary"}>
          {item.automaticTransfer ? "Oui" : "Non"}
        </Badge>
      ),
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
      | CompanyStructure
      | CostCenter
      | InternalRule
      | MonthlyClosing
      | AccountingTransfer,
  ) => {
    setModalMode(mode);
    setEntityType(type);
    if (item) {
      setSelectedItem(item);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData(item as Record<string, any>);
    } else {
      setSelectedItem(null);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setFormData(getDefaultFormData(type) as Record<string, any>);
    }
  };

  const getDefaultFormData = (type: EntityType) => {
    switch (type) {
      case "structure":
        return { status: "Actif", type: "établissement" };
      case "costCenter":
        return { status: "Actif", type: "Analytique" };
      case "internalRule":
        return {
          status: "Actif",
          type: "Prime",
          calculationBasis: "Fixe",
          frequency: "Mensuelle",
          eligibleCategories: [],
        };
      case "closing":
        return { status: "Ouvert", employeeCount: 0, payrollAmount: 0 };
      case "transfer":
        return {
          status: "Actif",
          transferType: "Paie",
          automaticTransfer: true,
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
        case "structure":
          setStructures([...structures, newItem as CompanyStructure]);
          break;
        case "costCenter":
          setCostCenters([...costCenters, newItem as CostCenter]);
          break;
        case "internalRule":
          setInternalRules([...internalRules, newItem as InternalRule]);
          break;
        case "closing":
          setClosings([...closings, newItem as MonthlyClosing]);
          break;
        case "transfer":
          setTransfers([...transfers, newItem as AccountingTransfer]);
          break;
      }
    } else if (modalMode === "edit" && selectedItem) {
      switch (entityType) {
        case "structure":
          setStructures(
            structures.map((s) =>
              s.id === selectedItem.id ? { ...s, ...formData } : s,
            ),
          );
          break;
        case "costCenter":
          setCostCenters(
            costCenters.map((c) =>
              c.id === selectedItem.id ? { ...c, ...formData } : c,
            ),
          );
          break;
        case "internalRule":
          setInternalRules(
            internalRules.map((r) =>
              r.id === selectedItem.id ? { ...r, ...formData } : r,
            ),
          );
          break;
        case "closing":
          setClosings(
            closings.map((cl) =>
              cl.id === selectedItem.id ? { ...cl, ...formData } : cl,
            ),
          );
          break;
        case "transfer":
          setTransfers(
            transfers.map((t) =>
              t.id === selectedItem.id ? { ...t, ...formData } : t,
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
      | CompanyStructure
      | CostCenter
      | InternalRule
      | MonthlyClosing
      | AccountingTransfer,
  ) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer cet élément ?`)) {
      switch (type) {
        case "structure":
          setStructures(structures.filter((s) => s.id !== item.id));
          break;
        case "costCenter":
          setCostCenters(costCenters.filter((c) => c.id !== item.id));
          break;
        case "internalRule":
          setInternalRules(internalRules.filter((r) => r.id !== item.id));
          break;
        case "closing":
          setClosings(closings.filter((cl) => cl.id !== item.id));
          break;
        case "transfer":
          setTransfers(transfers.filter((t) => t.id !== item.id));
          break;
      }
    }
  };

  const renderActions = (
    type: EntityType,
    item:
      | CompanyStructure
      | CostCenter
      | InternalRule
      | MonthlyClosing
      | AccountingTransfer,
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
      case "structure":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code *
              </Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                  <SelectItem value="société">Société</SelectItem>
                  <SelectItem value="établissement">Établissement</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="siret" className="text-right">
                SIRET
              </Label>
              <Input
                id="siret"
                value={formData.siret || ""}
                onChange={(e) =>
                  setFormData({ ...formData, siret: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">
                Adresse
              </Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
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
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "costCenter":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code *
              </Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                  <SelectItem value="Analytique">Analytique</SelectItem>
                  <SelectItem value="Opérationnel">Opérationnel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="budget" className="text-right">
                Budget (€)
              </Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: parseFloat(e.target.value),
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
                  <SelectItem value="Inactif">Inactif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "internalRule":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="code" className="text-right">
                Code *
              </Label>
              <Input
                id="code"
                value={formData.code || ""}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
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
                  <SelectItem value="Prime">Prime</SelectItem>
                  <SelectItem value="Indemnité">Indemnité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calculationBasis" className="text-right">
                Base de Calcul *
              </Label>
              <Select
                value={formData.calculationBasis}
                onValueChange={(value) =>
                  setFormData({ ...formData, calculationBasis: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixe">Fixe</SelectItem>
                  <SelectItem value="% Salaire">% Salaire</SelectItem>
                  <SelectItem value="% Heures">% Heures</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Montant / Pourcentage
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                value={formData.amount || formData.percentage || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [formData.calculationBasis === "Fixe"
                      ? "amount"
                      : "percentage"]: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="frequency" className="text-right">
                Fréquence *
              </Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) =>
                  setFormData({ ...formData, frequency: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Mensuelle">Mensuelle</SelectItem>
                  <SelectItem value="Trimestrielle">Trimestrielle</SelectItem>
                  <SelectItem value="Annuelle">Annuelle</SelectItem>
                  <SelectItem value="Ponctuelle">Ponctuelle</SelectItem>
                </SelectContent>
              </Select>
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

      case "closing":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="month" className="text-right">
                Mois *
              </Label>
              <Input
                id="month"
                value={formData.month || ""}
                onChange={(e) =>
                  setFormData({ ...formData, month: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="year" className="text-right">
                Année *
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year || ""}
                onChange={(e) =>
                  setFormData({ ...formData, year: parseInt(e.target.value) })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closingDate" className="text-right">
                Date de Clôture *
              </Label>
              <Input
                id="closingDate"
                type="date"
                value={formData.closingDate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, closingDate: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="closedBy" className="text-right">
                Clôturé par
              </Label>
              <Input
                id="closedBy"
                value={formData.closedBy || ""}
                onChange={(e) =>
                  setFormData({ ...formData, closedBy: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payrollAmount" className="text-right">
                Montant Paie (€)
              </Label>
              <Input
                id="payrollAmount"
                type="number"
                value={formData.payrollAmount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payrollAmount: parseFloat(e.target.value),
                  })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employeeCount" className="text-right">
                Nombre de Salariés
              </Label>
              <Input
                id="employeeCount"
                type="number"
                value={formData.employeeCount || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    employeeCount: parseInt(e.target.value),
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
                  <SelectItem value="Ouvert">Ouvert</SelectItem>
                  <SelectItem value="Clôturé">Clôturé</SelectItem>
                  <SelectItem value="Validé">Validé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "transfer":
        return (
          <>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nom *
              </Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="transferType" className="text-right">
                Type *
              </Label>
              <Select
                value={formData.transferType}
                onValueChange={(value) =>
                  setFormData({ ...formData, transferType: value })
                }
                disabled={isView}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paie">Paie</SelectItem>
                  <SelectItem value="Charges">Charges</SelectItem>
                  <SelectItem value="Provisions">Provisions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountPrefix" className="text-right">
                Préfixe Compte *
              </Label>
              <Input
                id="accountPrefix"
                value={formData.accountPrefix || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountPrefix: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="analyticalAxis" className="text-right">
                Axe Analytique
              </Label>
              <Input
                id="analyticalAxis"
                value={formData.analyticalAxis || ""}
                onChange={(e) =>
                  setFormData({ ...formData, analyticalAxis: e.target.value })
                }
                disabled={isView}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="automaticTransfer" className="text-right">
                Transfert Automatique
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="automaticTransfer"
                  checked={formData.automaticTransfer || false}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, automaticTransfer: checked })
                  }
                  disabled={isView}
                />
              </div>
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

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    const entityName = {
      structure: "Structure",
      costCenter: "Centre de Coûts",
      internalRule: "Règle Interne",
      closing: "Clôture",
      transfer: "Transfert Comptable",
    }[entityType || "structure"];

    return modalMode === "view"
      ? `Détails ${entityName}`
      : modalMode === "edit"
        ? `Modifier ${entityName}`
        : `Nouveau ${entityName}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Configuration Entreprise</h1>
        <p className="text-muted-foreground">
          Structures, centres de coûts, règles internes et paramètres comptables
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="structures">
            <Building2 className="h-4 w-4 mr-2" />
            Structures
          </TabsTrigger>
          <TabsTrigger value="costCenters">
            <DollarSign className="h-4 w-4 mr-2" />
            Centres de Coûts
          </TabsTrigger>
          <TabsTrigger value="internalRules">
            <FileText className="h-4 w-4 mr-2" />
            Règles Internes
          </TabsTrigger>
          <TabsTrigger value="closings">
            <Clock className="h-4 w-4 mr-2" />
            Clôtures
          </TabsTrigger>
          <TabsTrigger value="transfers">
            <ArrowLeftRight className="h-4 w-4 mr-2" />
            Transferts Comptables
          </TabsTrigger>
        </TabsList>

        {/* Structures Tab */}
        <TabsContent value="structures" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Structures Entreprise</h2>
              <p className="text-sm text-muted-foreground">
                Sociétés, établissements et services
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "structure")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Structure
            </Button>
          </div>
          <DataTable
            data={structures}
            columns={structureColumns}
            searchKeys={["code", "name", "type"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("structure", item)}
            onRowClick={(item) => handleOpenModal("view", "structure", item)}
          />
        </TabsContent>

        {/* Cost Centers Tab */}
        <TabsContent value="costCenters" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Centres de Coûts</h2>
              <p className="text-sm text-muted-foreground">
                Sections analytiques et centres opérationnels
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "costCenter")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Centre
            </Button>
          </div>
          <DataTable
            data={costCenters}
            columns={costCenterColumns}
            searchKeys={["code", "name", "type"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("costCenter", item)}
            onRowClick={(item) => handleOpenModal("view", "costCenter", item)}
          />
        </TabsContent>

        {/* Internal Rules Tab */}
        <TabsContent value="internalRules" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Règles Internes</h2>
              <p className="text-sm text-muted-foreground">
                Primes et indemnités entreprise
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "internalRule")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </div>
          <DataTable
            data={internalRules}
            columns={internalRuleColumns}
            searchKeys={["code", "name", "type"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("internalRule", item)}
            onRowClick={(item) => handleOpenModal("view", "internalRule", item)}
          />
        </TabsContent>

        {/* Closings Tab */}
        <TabsContent value="closings" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Clôtures Mensuelles</h2>
              <p className="text-sm text-muted-foreground">
                Gestion des périodes de paie
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "closing")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Clôture
            </Button>
          </div>
          <DataTable
            data={closings}
            columns={closingColumns}
            searchKeys={["month", "year"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("closing", item)}
            onRowClick={(item) => handleOpenModal("view", "closing", item)}
          />
        </TabsContent>

        {/* Accounting Transfers Tab */}
        <TabsContent value="transfers" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold">Transferts Comptables</h2>
              <p className="text-sm text-muted-foreground">
                Configuration des exports vers la comptabilité
              </p>
            </div>
            <Button onClick={() => handleOpenModal("create", "transfer")}>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Transfert
            </Button>
          </div>
          <DataTable
            data={transfers}
            columns={transferColumns}
            searchKeys={["name", "transferType"]}
            searchPlaceholder="Rechercher..."
            actions={(item) => renderActions("transfer", item)}
            onRowClick={(item) => handleOpenModal("view", "transfer", item)}
          />
        </TabsContent>
      </Tabs>

      {/* Modal */}
      <Modal
        open={modalMode !== null}
        onOpenChange={handleCloseModal}
        type={modalMode === "view" ? "details" : "form"}
        title={getModalTitle()}
        description={
          modalMode === "view"
            ? "Informations détaillées"
            : "Renseignez les informations"
        }
        size="lg"
        actions={{
          primary:
            modalMode !== "view"
              ? {
                  label: "Enregistrer",
                  onClick: handleSave,
                }
              : undefined,
          secondary: {
            label: modalMode === "view" ? "Fermer" : "Annuler",
            onClick: handleCloseModal,
            variant: "outline",
          },
        }}
      >
        <div className="grid gap-4 py-4">{renderFormFields()}</div>
      </Modal>
    </div>
  );
}
