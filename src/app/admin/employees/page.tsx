"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Plus,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  FileWarning,
  Download,
} from "lucide-react";
import type { Employee, EmployeeFilters } from "@/types/employee";
import { mockEmployees, mockStats } from "@/data/employees";

export default function EmployeesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<EmployeeFilters>({});
  const [employees] = useState<Employee[]>(mockEmployees);

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

  const filteredEmployees = employees.filter((employee) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        employee.firstName.toLowerCase().includes(query) ||
        employee.lastName.toLowerCase().includes(query) ||
        employee.email.toLowerCase().includes(query) ||
        employee.employeeNumber.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personnel</h1>
          <p className="text-muted-foreground">
            Gestion administrative du personnel
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/employees/new">
            <Plus className="mr-2 h-4 w-4" />
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
              {((mockStats.active / mockStats.total) * 100).toFixed(1)}% du total
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
            <div className="text-2xl font-bold">{mockStats.pendingContracts}</div>
            <p className="text-xs text-muted-foreground">
              Signatures requises
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher un employé</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom, email, ou numéro d'employé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des employés ({filteredEmployees.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredEmployees.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <UserX className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">Aucun employé trouvé</h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier votre recherche
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredEmployees.map((employee) => (
                  <Link
                    key={employee.id}
                    href={`/admin/employees/${employee.id}`}
                    className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/50 rounded-lg px-4"
                  >
                    <Avatar>
                      <AvatarImage src={employee.photo} alt={employee.firstName} />
                      <AvatarFallback>
                        {employee.firstName[0]}
                        {employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">
                          {employee.firstName} {employee.lastName}
                        </h3>
                        {getStatusBadge(employee.status)}
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>{employee.position}</span>
                        <span>•</span>
                        <span>{employee.department}</span>
                        <span>•</span>
                        <span>{employee.employeeNumber}</span>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <div>{employee.email}</div>
                      <div>{employee.phone}</div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
