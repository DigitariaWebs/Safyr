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
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [requests] = useState<TimeOffRequest[]>(mockTimeOffRequests);

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

  const filteredRequests = requests.filter((request) => {
    const matchesSearch = searchQuery
      ? request.employeeName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        request.employeeNumber.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
        <Button asChild>
          <Link href="/admin/time-management/new">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Demandes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTimeManagementStats.totalRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockTimeManagementStats.totalAbsenceDays} jours au total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En attente</CardTitle>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTimeManagementStats.pendingRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              Temps moyen: {mockTimeManagementStats.averageResponseTime}h
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approuvées</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTimeManagementStats.approvedRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              {(
                (mockTimeManagementStats.approvedRequests /
                  mockTimeManagementStats.totalRequests) *
                100
              ).toFixed(0)}
              % du total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Employés absents
            </CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockTimeManagementStats.employeesOnLeave}
            </div>
            <p className="text-xs text-muted-foreground">
              Actuellement en congé
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Rechercher une demande</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher par nom ou numéro d'employé..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex h-10 w-45 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="approved">Approuvé</option>
              <option value="rejected">Refusé</option>
              <option value="cancelled">Annulé</option>
            </select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Demandes ({filteredRequests.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">
                  Aucune demande trouvée
                </h3>
                <p className="text-sm text-muted-foreground">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredRequests.map((request) => {
                  const statusConfig = getStatusBadge(request.status);
                  const StatusIcon = statusConfig.icon;

                  return (
                    <Link
                      key={request.id}
                      href={`/admin/time-management/${request.id}`}
                      className="flex items-center gap-4 py-4 transition-colors hover:bg-muted/50 rounded-lg px-4"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage
                          src={`/avatars/employee-${request.employeeId}.jpg`}
                        />
                        <AvatarFallback>
                          {request.employeeName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {request.employeeName}
                          </h3>
                          <Badge
                            variant={statusConfig.variant}
                            className="flex items-center gap-1"
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{getTypeLabel(request.type)}</span>
                          <span>•</span>
                          <span>{request.employeeNumber}</span>
                          <span>•</span>
                          <span>{request.department}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium">
                          {request.startDate.toLocaleDateString("fr-FR")} -{" "}
                          {request.endDate.toLocaleDateString("fr-FR")}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {request.totalDays} jour
                          {request.totalDays > 1 ? "s" : ""}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
