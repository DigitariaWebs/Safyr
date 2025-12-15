"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Modal } from "@/components/ui/modal";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Search,
  Plus,
  AlertCircle,
} from "lucide-react";
import { mockCSEDelegationHours } from "@/data/time-management";
import { mockEmployees } from "@/data/employees";

export default function CSEHoursPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [sessionFormData, setSessionFormData] = useState({
    employeeId: "",
    date: new Date().toISOString().split('T')[0],
    duration: 0,
    type: "meeting" as "meeting" | "employee_reception" | "inquiry" | "training",
    description: "",
  });

  const filteredMembers = mockCSEDelegationHours.filter((member) =>
    member.employeeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAllocated = mockCSEDelegationHours.reduce(
    (sum, m) => sum + m.allocatedHours,
    0
  );
  const totalUsed = mockCSEDelegationHours.reduce((sum, m) => sum + m.usedHours, 0);
  const totalSessions = mockCSEDelegationHours.reduce(
    (sum, m) => sum + m.sessions.length,
    0
  );

  const getSessionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      meeting: "Réunion",
      employee_reception: "Réception salariés",
      inquiry: "Enquête",
      training: "Formation",
    };
    return types[type] || type;
  };

  const getSessionTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      meeting: "bg-blue-100 text-blue-800",
      employee_reception: "bg-green-100 text-green-800",
      inquiry: "bg-orange-100 text-orange-800",
      training: "bg-purple-100 text-purple-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Heures de Délégation CSE</h1>
          <p className="text-muted-foreground">
            Suivi complet des heures des élus et délégués du personnel
          </p>
        </div>
        <Button onClick={() => setIsNewSessionModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle séance
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Élus CSE</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCSEDelegationHours.length}</div>
            <p className="text-xs text-muted-foreground">Actifs ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Allouées</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAllocated}h</div>
            <p className="text-xs text-muted-foreground">Total du mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Heures Utilisées</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsed}h</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((totalUsed / totalAllocated) * 100)}% du crédit
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Séances</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un élu CSE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
      </Card>

      {/* CSE Members List */}
      <div className="space-y-6">
        {filteredMembers.map((member) => {
          const usagePercentage = (member.usedHours / member.allocatedHours) * 100;
          const isNearLimit = usagePercentage >= 80;

          return (
            <Card key={member.id} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">
                        {member.employeeName}
                      </h3>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 text-blue-700"
                      >
                        {member.cseRole}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Période : {member.period}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Hours Overview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Utilisation du crédit d&apos;heures
                    </span>
                    <span className="font-medium">
                      {member.usedHours}h / {member.allocatedHours}h
                    </span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  {isNearLimit && (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <AlertCircle className="h-4 w-4" />
                      <span>Crédit d&apos;heures bientôt épuisé</span>
                    </div>
                  )}
                </div>

                {/* Hours Breakdown */}
                <div className="grid grid-cols-3 gap-4 rounded-lg bg-muted/50 p-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Allouées</p>
                    <p className="text-2xl font-bold">
                      {member.allocatedHours}h
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Utilisées</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {member.usedHours}h
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Restantes</p>
                    <p className="text-2xl font-bold text-green-600">
                      {member.remainingHours}h
                    </p>
                  </div>
                </div>

                {/* Sessions List */}
                <div className="space-y-3">
                  <h4 className="font-semibold">
                    Séances ({member.sessions.length})
                  </h4>
                  <div className="space-y-2">
                    {member.sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-start justify-between rounded-lg border p-3"
                      >
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="secondary"
                              className={getSessionTypeBadge(session.type)}
                            >
                              {getSessionTypeLabel(session.type)}
                            </Badge>
                            {session.validated && (
                              <Badge
                                variant="outline"
                                className="text-green-600"
                              >
                                <CheckCircle className="mr-1 h-3 w-3" />
                                Validé
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm font-medium">
                            {session.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(session.date).toLocaleDateString(
                                "fr-FR"
                              )}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.duration}h
                            </span>
                          </div>
                          {session.validated && session.validatedBy && (
                            <p className="text-xs text-green-700">
                              Validé par {session.validatedBy} le{" "}
                              {new Date(
                                session.validatedAt!
                              ).toLocaleDateString("fr-FR")}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-lg font-bold text-blue-600">
                            {session.duration}h
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredMembers.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-2 text-sm text-muted-foreground">
                Aucun élu CSE trouvé
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Session Modal */}
      <Modal
        open={isNewSessionModalOpen}
        onOpenChange={setIsNewSessionModalOpen}
        type="form"
        title="Nouvelle séance CSE"
        description="Créer une nouvelle séance pour un élu CSE"
        actions={{
          primary: {
            label: "Créer la séance",
            onClick: () => {
              // Here you would normally save to database
              console.log("Creating new CSE session:", sessionFormData);
              setIsNewSessionModalOpen(false);
              setSessionFormData({
                employeeId: "",
                date: new Date().toISOString().split('T')[0],
                duration: 0,
                type: "meeting",
                description: "",
              });
            },
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewSessionModalOpen(false),
          },
        }}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cse-employee">Élu CSE</Label>
              <Select
                value={sessionFormData.employeeId}
                onValueChange={(value) =>
                  setSessionFormData({ ...sessionFormData, employeeId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un élu CSE" />
                </SelectTrigger>
                <SelectContent>
                  {mockEmployees
                    .filter(employee => employee.department === "Management" || employee.position.includes("CSE"))
                    .map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName} - {employee.employeeNumber}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-date">Date</Label>
              <Input
                id="session-date"
                type="date"
                value={sessionFormData.date}
                onChange={(e) =>
                  setSessionFormData({ ...sessionFormData, date: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="session-type">Type de séance</Label>
              <Select
                value={sessionFormData.type}
                onValueChange={(value: "meeting" | "employee_reception" | "inquiry" | "training") =>
                  setSessionFormData({ ...sessionFormData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meeting">Réunion</SelectItem>
                  <SelectItem value="employee_reception">Réception salariés</SelectItem>
                  <SelectItem value="inquiry">Enquête</SelectItem>
                  <SelectItem value="training">Formation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Durée (heures)
              </Label>
              <Input
                id="duration"
                type="number"
                min="0"
                step="0.5"
                value={sessionFormData.duration}
                onChange={(e) =>
                  setSessionFormData({ ...sessionFormData, duration: parseFloat(e.target.value) || 0 })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Décrivez l'objet de la séance..."
              value={sessionFormData.description}
              onChange={(e) =>
                setSessionFormData({ ...sessionFormData, description: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="rounded-lg bg-muted p-4">
            <h4 className="font-medium mb-2">Récapitulatif</h4>
            <div className="text-sm space-y-1">
              <div>Élu CSE: <strong>{sessionFormData.employeeId ? mockEmployees.find(e => e.id === sessionFormData.employeeId)?.firstName + " " + mockEmployees.find(e => e.id === sessionFormData.employeeId)?.lastName : "Non sélectionné"}</strong></div>
              <div>Date: <strong>{new Date(sessionFormData.date).toLocaleDateString("fr-FR")}</strong></div>
              <div>Type: <strong>{getSessionTypeLabel(sessionFormData.type)}</strong></div>
              <div>Durée: <strong>{sessionFormData.duration}h</strong></div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
