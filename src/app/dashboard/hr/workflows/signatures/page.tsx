"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Scale,
  Package,
  CheckSquare,
  FileCheck,
  Clock,
  CheckCircle,
  Download,
  PenTool,
} from "lucide-react";
import Link from "next/link";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { SignatureWorkflow, SignatureStatus, SignatureStats } from "@/lib/types";

// Mock data
const mockStats: SignatureStats = {
  totalWorkflows: 89,
  pendingSignatures: 15,
  completedSignatures: 62,
  refusedSignatures: 3,
  expiredSignatures: 9,
  contractSignatures: 34,
  sanctionSignatures: 12,
  equipmentSignatures: 28,
  acknowledgmentSignatures: 11,
  hrValidationSignatures: 4,
  averageCompletionTime: 36.5,
  completionRate: 85.2,
  signaturesThisWeek: 12,
  signaturesThisMonth: 38,
};

const mockSignatureWorkflows: SignatureWorkflow[] = [
  {
    id: "1",
    type: "contract",
    title: "CDI - Marie Dupont",
    description: "Contrat à durée indéterminée",
    status: "signed",
    documents: [{
      id: "doc1",
      name: "CDI_Marie_Dupont.pdf",
      type: "contract",
      documentUrl: "/contracts/cdi-marie.pdf",
      signedDocumentUrl: "/contracts/cdi-marie-signed.pdf",
      createdAt: new Date("2024-12-10"),
    }],
    participants: [
      {
        id: "p1",
        name: "Marie Dupont",
        email: "marie.dupont@example.com",
        role: "signer",
        status: "signed",
        signedAt: new Date("2024-12-11T10:30:00"),
        signatureMethod: "eidas",
      },
      {
        id: "p2",
        name: "Directeur RH",
        email: "rh@example.com",
        role: "signer",
        status: "signed",
        signedAt: new Date("2024-12-10T14:00:00"),
        signatureMethod: "eidas",
      },
    ],
    initiatedBy: "hr-manager",
    initiatedByName: "Alice Dubois",
    employeeId: "1",
    employeeName: "Marie Dupont",
    contractId: "CTR-001",
    requiresEidas: true,
    signatureMethod: "eidas",
    sequentialSigning: false,
    reminderEnabled: true,
    sentAt: new Date("2024-12-10T09:00:00"),
    completedAt: new Date("2024-12-11T10:30:00"),
    auditTrail: [],
    createdAt: new Date("2024-12-10T08:30:00"),
    updatedAt: new Date("2024-12-11T10:30:00"),
  },
  {
    id: "2",
    type: "equipment_delivery",
    title: "Remise EPI - Jean Martin",
    description: "Remise des équipements de protection individuelle",
    status: "sent",
    documents: [{
      id: "doc2",
      name: "Bordereau_EPI_Jean.pdf",
      type: "equipment_delivery",
      documentUrl: "/equipment/epi-jean.pdf",
      createdAt: new Date("2024-12-20"),
    }],
    participants: [
      {
        id: "p3",
        name: "Jean Martin",
        email: "jean.martin@example.com",
        role: "signer",
        status: "pending",
      },
    ],
    initiatedBy: "equipment-manager",
    initiatedByName: "Pierre Durand",
    employeeId: "2",
    employeeName: "Jean Martin",
    equipmentId: "EQ-045",
    requiresEidas: false,
    signatureMethod: "simple",
    sequentialSigning: false,
    reminderEnabled: true,
    reminderFrequency: 3,
    sentAt: new Date("2024-12-20T14:00:00"),
    expiresAt: new Date("2024-12-27T23:59:59"),
    auditTrail: [],
    createdAt: new Date("2024-12-20T13:45:00"),
    updatedAt: new Date("2024-12-20T14:00:00"),
  },
  {
    id: "3",
    type: "disciplinary_sanction",
    title: "Avertissement - Sophie Leroy",
    description: "Notification d'avertissement",
    status: "pending",
    documents: [{
      id: "doc3",
      name: "Avertissement_Sophie.pdf",
      type: "disciplinary_sanction",
      documentUrl: "/sanctions/warning-sophie.pdf",
      createdAt: new Date("2024-12-19"),
    }],
    participants: [
      {
        id: "p4",
        name: "Sophie Leroy",
        email: "sophie.leroy@example.com",
        role: "signer",
        status: "pending",
      },
    ],
    initiatedBy: "hr-manager",
    initiatedByName: "Alice Dubois",
    employeeId: "3",
    employeeName: "Sophie Leroy",
    sanctionId: "SAN-012",
    requiresEidas: true,
    signatureMethod: "eidas",
    sequentialSigning: false,
    reminderEnabled: true,
    expiresAt: new Date("2024-12-26T23:59:59"),
    auditTrail: [],
    createdAt: new Date("2024-12-19T16:00:00"),
    updatedAt: new Date("2024-12-19T16:00:00"),
  },
];

const statusLabels: Record<SignatureStatus, string> = {
  pending: "En attente",
  sent: "Envoyée",
  signed: "Signée",
  refused: "Refusée",
  expired: "Expirée",
  cancelled: "Annulée",
};

const statusColors: Record<SignatureStatus, "default" | "secondary" | "destructive"> = {
  pending: "default",
  sent: "secondary",
  signed: "secondary",
  refused: "destructive",
  expired: "destructive",
  cancelled: "default",
};

const typeLabels = {
  contract: "Contrat",
  disciplinary_sanction: "Sanction",
  equipment_delivery: "Remise EPI",
  equipment_return: "Restitution EPI",
  acknowledgment: "Accusé de réception",
  hr_validation: "Validation RH",
};

const typeIcons = {
  contract: FileText,
  disciplinary_sanction: Scale,
  equipment_delivery: Package,
  equipment_return: Package,
  acknowledgment: CheckSquare,
  hr_validation: FileCheck,
};

export default function SignaturesPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");

  // Apply filters
  let filteredWorkflows = mockSignatureWorkflows;

  if (filterStatus !== "all") {
    filteredWorkflows = filteredWorkflows.filter((w) => w.status === filterStatus);
  }

  if (filterType !== "all") {
    filteredWorkflows = filteredWorkflows.filter((w) => w.type ===filterType);
  }

  const columns: ColumnDef<SignatureWorkflow>[] = [
    {
      key: "id",
      label: "N° Workflow",
      render: (workflow: SignatureWorkflow) => (
        <div className="font-medium">#{workflow.id}</div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (workflow: SignatureWorkflow) => {
        const Icon = typeIcons[workflow.type];
        return (
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span>{typeLabels[workflow.type]}</span>
          </div>
        );
      },
    },
    {
      key: "title",
      label: "Titre",
      render: (workflow: SignatureWorkflow) => (
        <div>
          <div className="font-medium">{workflow.title}</div>
          {workflow.description && (
            <div className="text-sm text-muted-foreground">{workflow.description}</div>
          )}
        </div>
      ),
    },
    {
      key: "participants",
      label: "Signataires",
      render: (workflow: SignatureWorkflow) => {
        const signed = workflow.participants.filter((p) => p.status === "signed").length;
        const total = workflow.participants.length;
        return (
          <div className="text-sm">
            <div className="font-medium">{signed} / {total}</div>
            <div className="text-muted-foreground">signé{signed > 1 ? "s" : ""}</div>
          </div>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date de création",
      render: (workflow: SignatureWorkflow) =>
        workflow.createdAt.toLocaleDateString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (workflow: SignatureWorkflow) => (
        <Badge variant={statusColors[workflow.status]}>
          {statusLabels[workflow.status]}
        </Badge>
      ),
    },
    {
      key: "method",
      label: "Méthode",
      render: (workflow: SignatureWorkflow) => (
        <div className="text-sm">
          {workflow.requiresEidas && (
            <Badge variant="outline" className="text-xs">
              <PenTool className="mr-1 h-3 w-3" />
              eIDAS
            </Badge>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Signatures Électroniques & Dématérialisation</h1>
          <p className="text-muted-foreground">
            Gestion centralisée des signatures électroniques eIDAS et workflows de validation
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => alert("Export PDF...")} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <PenTool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">
              {mockStats.signaturesThisWeek} cette semaine
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.pendingSignatures}</div>
            <p className="text-xs text-muted-foreground">
              À signer
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Signées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedSignatures}</div>
            <p className="text-xs text-muted-foreground">
              Taux: {mockStats.completionRate}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Temps moyen</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.averageCompletionTime}h</div>
            <p className="text-xs text-muted-foreground">
              Temps de signature
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Link href="/dashboard/hr/signatures/contracts">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contrats</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.contractSignatures}</div>
              <p className="text-xs text-muted-foreground">Signatures eIDAS</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/hr/signatures/sanctions">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sanctions</CardTitle>
              <Scale className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.sanctionSignatures}</div>
              <p className="text-xs text-muted-foreground">Notifications</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/hr/signatures/equipment">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Équipements</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.equipmentSignatures}</div>
              <p className="text-xs text-muted-foreground">Remises/Restitutions</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/hr/signatures/acknowledgments">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Accusés</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.acknowledgmentSignatures}</div>
              <p className="text-xs text-muted-foreground">Accusés de réception</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/hr/signatures/validations">
          <Card className="cursor-pointer transition-colors hover:bg-accent">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Validations RH</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.hrValidationSignatures}</div>
              <p className="text-xs text-muted-foreground">Approbations internes</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Workflows Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Workflows de signature récents</CardTitle>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="sent">Envoyées</SelectItem>
                  <SelectItem value="signed">Signées</SelectItem>
                  <SelectItem value="refused">Refusées</SelectItem>
                  <SelectItem value="expired">Expirées</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les types</SelectItem>
                  <SelectItem value="contract">Contrats</SelectItem>
                  <SelectItem value="disciplinary_sanction">Sanctions</SelectItem>
                  <SelectItem value="equipment_delivery">Remise EPI</SelectItem>
                  <SelectItem value="equipment_return">Restitution EPI</SelectItem>
                  <SelectItem value="acknowledgment">Accusés</SelectItem>
                  <SelectItem value="hr_validation">Validations RH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={filteredWorkflows} />
        </CardContent>
      </Card>
    </div>
  );
}
