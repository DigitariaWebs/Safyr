"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
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
  FileText,
  Eye,
  Download,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

// Mock DUERP data
interface DUERP {
  id: string;
  position: string;
  department: string;
  lastUpdated: Date;
  status: "valid" | "expired" | "pending-review";
  riskLevel: "low" | "medium" | "high";
  fileUrl?: string;
}

const mockDUERP: DUERP[] = [
  {
    id: "DUERP001",
    position: "Agent de sécurité",
    department: "Sécurité",
    lastUpdated: new Date("2024-01-15"),
    status: "valid",
    riskLevel: "medium",
    fileUrl: "/documents/duerp-agent-securite.pdf",
  },
  {
    id: "DUERP002",
    position: "Chef de poste",
    department: "Sécurité",
    lastUpdated: new Date("2024-02-20"),
    status: "valid",
    riskLevel: "high",
    fileUrl: "/documents/duerp-chef-poste.pdf",
  },
  {
    id: "DUERP003",
    position: "Superviseur",
    department: "Sécurité",
    lastUpdated: new Date("2023-12-10"),
    status: "expired",
    riskLevel: "medium",
    fileUrl: "/documents/duerp-superviseur.pdf",
  },
];

export default function DUERPPage() {
  const [duerpDocuments] = useState<DUERP[]>(mockDUERP);
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all");

  const getStatusBadge = (status: DUERP["status"]) => {
    const variants = {
      valid: {
        variant: "default" as const,
        label: "Valide",
        icon: CheckCircle,
      },
      expired: {
        variant: "destructive" as const,
        label: "Expiré",
        icon: AlertTriangle,
      },
      "pending-review": {
        variant: "secondary" as const,
        label: "En révision",
        icon: AlertTriangle,
      },
    };
    const config = variants[status];
    return (
      <Badge variant={config.variant} className="gap-1">
        <config.icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getRiskBadge = (risk: DUERP["riskLevel"]) => {
    const variants = {
      low: { variant: "outline" as const, label: "Faible" },
      medium: { variant: "secondary" as const, label: "Moyen" },
      high: { variant: "destructive" as const, label: "Élevé" },
    };
    const config = variants[risk];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const columns: ColumnDef<DUERP>[] = [
    {
      key: "position",
      label: "Poste",
      sortable: true,
      render: (duerp) => (
        <div>
          <div className="font-medium">{duerp.position}</div>
          <div className="text-sm text-muted-foreground">
            {duerp.department}
          </div>
        </div>
      ),
    },
    {
      key: "lastUpdated",
      label: "Dernière mise à jour",
      sortable: true,
      render: (duerp) => (
        <span className="text-sm">
          {duerp.lastUpdated.toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (duerp) => getStatusBadge(duerp.status),
    },
    {
      key: "riskLevel",
      label: "Niveau de risque",
      sortable: true,
      render: (duerp) => getRiskBadge(duerp.riskLevel),
    },
  ];

  const filteredDUERP = duerpDocuments.filter((duerp) => {
    const positionMatch =
      selectedPosition === "all" || duerp.position === selectedPosition;
    const departmentMatch =
      selectedDepartment === "all" || duerp.department === selectedDepartment;
    return positionMatch && departmentMatch;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            DUERP
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Document Unique d&apos;Évaluation des Risques Professionnels
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nouveau DUERP
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Select
                value={selectedPosition}
                onValueChange={setSelectedPosition}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les postes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les postes</SelectItem>
                  <SelectItem value="Agent de sécurité">
                    Agent de sécurité
                  </SelectItem>
                  <SelectItem value="Chef de poste">Chef de poste</SelectItem>
                  <SelectItem value="Superviseur">Superviseur</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Select
                value={selectedDepartment}
                onValueChange={setSelectedDepartment}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les départements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les départements</SelectItem>
                  <SelectItem value="Sécurité">Sécurité</SelectItem>
                  <SelectItem value="Direction">Direction</SelectItem>
                  <SelectItem value="RH">RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* DUERP DataTable */}
      <DataTable
        data={filteredDUERP}
        columns={columns}
        searchKeys={["position", "department"]}
        getSearchValue={(duerp) => `${duerp.position} ${duerp.department}`}
        searchPlaceholder="Rechercher par poste ou département..."
        getRowId={(duerp) => duerp.id}
        actions={() => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Voir le document
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Modifier
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total DUERP</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{duerpDocuments.length}</div>
            <p className="text-xs text-muted-foreground">Documents actifs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              À mettre à jour
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {duerpDocuments.filter((d) => d.status === "expired").length}
            </div>
            <p className="text-xs text-muted-foreground">Documents expirés</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Risque élevé</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {duerpDocuments.filter((d) => d.riskLevel === "high").length}
            </div>
            <p className="text-xs text-muted-foreground">Postes à risque</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
