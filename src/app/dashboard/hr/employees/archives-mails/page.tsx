"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
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
  Mail,
  Eye,
  Download,
  MoreVertical,
  Calendar,
  User,
  Send,
  Inbox,
} from "lucide-react";
import { mockEmployees } from "@/data/employees";

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
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredCommunications = mockArchivedCommunications.filter((comm) => {
    const employeeMatch =
      selectedEmployee === "all" || comm.employeeId === selectedEmployee;
    const categoryMatch =
      selectedCategory === "all" || comm.category === selectedCategory;
    const searchMatch =
      searchTerm === "" ||
      comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.from.toLowerCase().includes(searchTerm.toLowerCase());
    return employeeMatch && categoryMatch && searchMatch;
  });

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

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="employee">Employé</Label>
              <Select
                value={selectedEmployee}
                onValueChange={setSelectedEmployee}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous les employés" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les employés</SelectItem>
                  {mockEmployees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.firstName} {employee.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie</Label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="hr">RH</SelectItem>
                  <SelectItem value="payroll">Paie</SelectItem>
                  <SelectItem value="training">Formation</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="search">Recherche</Label>
              <Input
                id="search"
                placeholder="Rechercher par objet, employé..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communications DataTable */}
      <DataTable
        data={filteredCommunications}
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

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total communications
            </CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCommunications.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Envoyés</CardTitle>
            <Send className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCommunications.filter((c) => c.type === "sent").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reçus</CardTitle>
            <Inbox className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {
                filteredCommunications.filter((c) => c.type === "received")
                  .length
              }
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avec PJ</CardTitle>
            <Badge variant="outline" className="h-4 w-4 p-0">
              📎
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredCommunications.filter((c) => c.hasAttachments).length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
