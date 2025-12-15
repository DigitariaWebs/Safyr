"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  AlertTriangle,
  FileText,
  Package,
  Users,
  Shield,
  Send,
} from "lucide-react";
import type { Employee } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";
import {
  EmployeeInfoTab,
  EmployeeDocumentsTab,
  EmployeeContractsTab,
  EmployeeEquipmentTab,
  EmployeeAlertsTab,
  EmployeeCSETab,
  EmployeeCNAPSTab,
} from "@/components/employees";
import { useSendEmail } from "@/hooks/useSendEmail";

export default function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";
  const [activeTab, setActiveTab] = useState("info");
  const employee = getEmployeeById(id);
  const { openEmailModal } = useSendEmail();

  if (!employee) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h1 className="text-2xl font-bold mb-2">Employé non trouvé</h1>
        <p className="text-muted-foreground mb-4">
          L&apos;employé avec l&apos;ID {id} n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/admin/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>
    );
  }

  const tabs = [
    { id: "info" as const, label: "Informations", icon: FileText },
    { id: "documents" as const, label: "Documents", icon: FileText },
    { id: "contracts" as const, label: "Contrats", icon: FileText },
    { id: "equipment" as const, label: "Équipements", icon: Package },
    { id: "alerts" as const, label: "Alertes", icon: AlertTriangle },
    { id: "cse" as const, label: "CSE", icon: Users },
    { id: "cnaps" as const, label: "CNAPS", icon: Shield },
  ];

  const getStatusBadge = (status: Employee["status"]) => {
    const variants = {
      active: {
        variant: "default" as const,
        label: "Actif",
        color: "bg-green-500",
      },
      inactive: {
        variant: "secondary" as const,
        label: "Inactif",
        color: "bg-gray-500",
      },
      suspended: {
        variant: "destructive" as const,
        label: "Suspendu",
        color: "bg-red-500",
      },
      terminated: {
        variant: "outline" as const,
        label: "Terminé",
        color: "bg-gray-400",
      },
    };
    return variants[status];
  };

  const statusConfig = getStatusBadge(employee.status);

  return (
    <div className="flex flex-col gap-6 p-6 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/employees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            {employee.firstName} {employee.lastName}
          </h1>
          <p className="text-muted-foreground">
            {employee.position} • {employee.employeeNumber}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {!isEditMode && (
            <>
              <Button
                variant="outline"
                onClick={() => openEmailModal([employee])}
              >
                <Send className="mr-2 h-4 w-4" />
                Envoyer un email
              </Button>
              <Button asChild>
                <Link href={`/admin/employees/${employee.id}?edit=true`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier
                </Link>
              </Button>
            </>
          )}
          {isEditMode && (
            <Button asChild variant="outline">
              <Link href={`/admin/employees/${employee.id}`}>Annuler</Link>
            </Button>
          )}
        </div>
      </div>

      {/* Employee Overview Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6 flex-wrap">
            <Avatar className="h-24 w-24">
              <AvatarImage src={employee.photo} alt={employee.firstName} />
              <AvatarFallback className="text-2xl">
                {employee.firstName[0]}
                {employee.lastName[0]}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 grid gap-4 md:grid-cols-2 lg:grid-cols-3 min-w-0">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${statusConfig.color}`} />
                <div>
                  <p className="text-sm text-muted-foreground">Statut</p>
                  <p className="font-medium">{statusConfig.label}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-sm">{employee.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Téléphone</p>
                  <p className="font-medium">{employee.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Département</p>
                  <p className="font-medium">{employee.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">
                    Date d&apos;embauche
                  </p>
                  <p className="font-medium">
                    {employee.hireDate.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Localisation</p>
                  <p className="font-medium">
                    {employee.address.city}, {employee.address.postalCode}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="min-h-100 max-w-full overflow-x-hidden">
        {activeTab === "info" && (
          <EmployeeInfoTab employee={employee} isEditMode={isEditMode} />
        )}
        {activeTab === "documents" && (
          <EmployeeDocumentsTab employee={employee} />
        )}
        {activeTab === "contracts" && (
          <EmployeeContractsTab employee={employee} />
        )}
        {activeTab === "equipment" && (
          <EmployeeEquipmentTab employee={employee} />
        )}
        {activeTab === "alerts" && <EmployeeAlertsTab employee={employee} />}
        {activeTab === "cse" && <EmployeeCSETab employee={employee} />}
        {activeTab === "cnaps" && <EmployeeCNAPSTab employee={employee} />}
      </div>
    </div>
  );
}
