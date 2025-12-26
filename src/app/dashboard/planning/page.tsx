"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { mockPlanningAgents } from "@/data/planning-agents";

export default function PlanningDashboard() {
  const availableAgents = mockPlanningAgents.filter(
    (a) => a.availabilityStatus === "Disponible"
  ).length;
  const onMission = mockPlanningAgents.filter(
    (a) => a.availabilityStatus === "En mission"
  ).length;
  const onLeave = mockPlanningAgents.filter(
    (a) => a.availabilityStatus === "Congé"
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord Planning</h1>
        <p className="text-muted-foreground">
          Gestion des agents, planification et affectations
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agents Disponibles
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableAgents}</div>
            <p className="text-xs text-muted-foreground">
              Prêts pour affectation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Mission</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onMission}</div>
            <p className="text-xs text-muted-foreground">
              Actuellement affectés
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Congé</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onLeave}</div>
            <p className="text-xs text-muted-foreground">Indisponibles</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockPlanningAgents.length}</div>
            <p className="text-xs text-muted-foreground">
              Agents dans le système
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


