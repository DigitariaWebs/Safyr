"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  FileText,
  Package,
  Users,
  Send,
  Gavel,
  DollarSign,
} from "lucide-react";
import type { Employee } from "@/lib/types";
import { getEmployeeById } from "@/data/employees";
import {
  EmployeeInfoTab,
  EmployeeDocumentsTab,
  EmployeeContractsTab,
  EmployeeEquipmentTab,
  EmployeeCSETab,
  EmployeeDisciplineTab,
  EmployeeSavingsTab,
} from "@/components/employees";
import { useSendEmail } from "@/hooks/useSendEmail";
import { cn } from "@/lib/utils";

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
          <Link href="/dashboard/hr/employees">
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
    { id: "savings" as const, label: "Épargne", icon: DollarSign },
    { id: "discipline" as const, label: "Discipline", icon: Gavel },
    { id: "cse" as const, label: "CSE", icon: Users },
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
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="sticky top-0 z-10 items-center gap-1 px-6 py-2 overflow-x-auto w-full bg-muted rounded-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <TabsTrigger
              className={cn(
                "flex items-center gap-2 p-3 text-sm rounded-lg transition-all whitespace-nowrap font-medium border-0",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
                  : "text-foreground hover:bg-accent hover:text-foreground",
              )}
              key={tab.id}
              value={tab.id}
            >
              <Icon className="h-4 w-4 mr-2" />
              {tab.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-4 flex-wrap">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/hr/employees">
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
                  <Link
                    href={`/dashboard/hr/employees/${employee.id}?edit=true`}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
              </>
            )}
            {isEditMode && (
              <Button asChild variant="outline">
                <Link href={`/dashboard/hr/employees/${employee.id}`}>
                  Annuler
                </Link>
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
                  <div
                    className={`w-2 h-2 rounded-full ${statusConfig.color}`}
                  />
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
                    <p className="text-sm text-muted-foreground">
                      Localisation
                    </p>
                    <p className="font-medium">
                      {employee.address.city}, {employee.address.postalCode}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <TabsContent value="info">
          <EmployeeInfoTab employee={employee} isEditMode={isEditMode} />
        </TabsContent>
        <TabsContent value="documents">
          <EmployeeDocumentsTab employee={employee} />
        </TabsContent>
        <TabsContent value="contracts">
          <EmployeeContractsTab employee={employee} />
        </TabsContent>
        <TabsContent value="equipment">
          <EmployeeEquipmentTab employee={employee} />
        </TabsContent>
        <TabsContent value="savings">
          <EmployeeSavingsTab employee={employee} />
        </TabsContent>
        <TabsContent value="discipline">
          <EmployeeDisciplineTab employee={employee} />
        </TabsContent>
        <TabsContent value="cse">
          <EmployeeCSETab employee={employee} />
        </TabsContent>
      </div>
    </Tabs>
  );
}
