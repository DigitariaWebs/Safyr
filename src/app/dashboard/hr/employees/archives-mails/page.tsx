"use client";

import { Button } from "@/components/ui/button";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mail,
  Eye,
  Download,
  MoreVertical,
  Calendar,
  User,
  Send,
  Inbox,
  Paperclip,
} from "lucide-react";

// Mock archived communications
interface ArchivedCommunication {
  id: string;
  employeeId: string;
  employeeName: string;
  type: "sent" | "received";
  subject: string;
  date: Date;
  from: string;
  to: string[];
  hasAttachments: boolean;
  archivedAt: Date;
  category: "hr" | "payroll" | "training" | "other";
}

const mockArchivedCommunications: ArchivedCommunication[] = [
  {
    id: "comm1",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    type: "sent",
    subject: "Confirmation de votre contrat",
    date: new Date("2024-01-15"),
    from: "rh@safyr.com",
    to: ["jean.dupont@email.com"],
    hasAttachments: true,
    archivedAt: new Date("2024-01-15"),
    category: "hr",
  },
  {
    id: "comm2",
    employeeId: "EMP001",
    employeeName: "Jean Dupont",
    type: "received",
    subject: "Demande de congé",
    date: new Date("2024-01-20"),
    from: "jean.dupont@email.com",
    to: ["rh@safyr.com"],
    hasAttachments: false,
    archivedAt: new Date("2024-01-20"),
    category: "hr",
  },
  {
    id: "comm3",
    employeeId: "EMP002",
    employeeName: "Marie Martin",
    type: "sent",
    subject: "Bulletin de salaire Janvier 2024",
    date: new Date("2024-02-01"),
    from: "payroll@safyr.com",
    to: ["marie.martin@email.com"],
    hasAttachments: true,
    archivedAt: new Date("2024-02-01"),
    category: "payroll",
  },
];

export default function ArchivesMailsPage() {
  const getCategoryBadge = (category: ArchivedCommunication["category"]) => {
    const variants = {
      hr: { variant: "default" as const, label: "RH" },
      payroll: { variant: "secondary" as const, label: "Paie" },
      training: { variant: "outline" as const, label: "Formation" },
      other: { variant: "outline" as const, label: "Autre" },
    };
    const config = variants[category];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTypeIcon = (type: ArchivedCommunication["type"]) => {
    return type === "sent" ? (
      <Send className="h-4 w-4 text-blue-600" />
    ) : (
      <Inbox className="h-4 w-4 text-green-600" />
    );
  };

  const columns: ColumnDef<ArchivedCommunication>[] = [
    {
      key: "employee",
      label: "Employé",
      sortable: true,
      render: (comm) => (
        <div className="flex items-center gap-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div>
            <div className="font-medium">{comm.employeeName}</div>
            <div className="text-sm text-muted-foreground">
              {comm.employeeId}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (comm) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(comm.type)}
          <span className="text-sm capitalize">
            {comm.type === "sent" ? "Envoyé" : "Reçu"}
          </span>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Objet",
      sortable: true,
      render: (comm) => (
        <div>
          <div className="font-medium">{comm.subject}</div>
          <div className="text-sm text-muted-foreground">
            De: {comm.from} • À: {comm.to.join(", ")}
          </div>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (comm) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm">
            {comm.date.toLocaleDateString("fr-FR")}
          </span>
        </div>
      ),
    },
    {
      key: "category",
      label: "Catégorie",
      sortable: true,
      render: (comm) => getCategoryBadge(comm.category),
    },
    {
      key: "attachments",
      label: "PJ",
      render: (comm) =>
        comm.hasAttachments ? <Badge variant="outline">📎</Badge> : null,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light tracking-tight">
            Archives Mails
          </h1>
          <p className="mt-2 text-sm font-light text-muted-foreground">
            Archive des échanges email pour chaque salarié
          </p>
        </div>
      </div>

      {/* Stats */}
      <InfoCardContainer>
        <InfoCard
          icon={Mail}
          title="Total communications"
          value={mockArchivedCommunications.length}
          color="gray"
        />
        <InfoCard
          icon={Send}
          title="Envoyés"
          value={
            mockArchivedCommunications.filter((c) => c.type === "sent").length
          }
          color="blue"
        />
        <InfoCard
          icon={Inbox}
          title="Reçus"
          value={
            mockArchivedCommunications.filter((c) => c.type === "received")
              .length
          }
          color="green"
        />
        <InfoCard
          icon={Paperclip}
          title="Avec PJ"
          value={
            mockArchivedCommunications.filter((c) => c.hasAttachments).length
          }
          color="orange"
        />
      </InfoCardContainer>

      {/* Communications DataTable */}
      <DataTable
        data={mockArchivedCommunications}
        columns={columns}
        searchKeys={["subject", "employeeName", "from"]}
        getSearchValue={(comm) =>
          `${comm.subject} ${comm.employeeName} ${comm.from}`
        }
        searchPlaceholder="Rechercher dans les communications..."
        getRowId={(comm) => comm.id}
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
                Voir le détail
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Télécharger
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Répondre
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      />
    </div>
  );
}
