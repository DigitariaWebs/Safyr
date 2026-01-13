"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  Plus,
  Eye,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import { RecruitmentStats } from "@/lib/types";

// Mock data - replace with API call
const mockStats: RecruitmentStats = {
  totalApplications: 45,
  pendingApplications: 12,
  acceptedApplications: 8,
  rejectedApplications: 25,
  totalVerifications: 30,
  pendingVerifications: 5,
  completedOnboardings: 6,
  inProgressOnboardings: 2,
};

export default function RecruitmentPage() {
  const [stats] = useState<RecruitmentStats>(mockStats);

  const widgets = [
    {
      title: "Candidatures totales",
      value: stats.totalApplications,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "En attente",
      value: stats.pendingApplications,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Acceptées",
      value: stats.acceptedApplications,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Vérifications en cours",
      value: stats.pendingVerifications,
      icon: AlertCircle,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
  ];

  const quickActions = [
    {
      title: "Nouvelle candidature",
      description: "Ajouter une nouvelle candidature",
      icon: Plus,
      href: "/dashboard/hr/recruitment/applications/new",
      variant: "default" as const,
    },
    {
      title: "Voir candidatures",
      description: "Consulter toutes les candidatures",
      icon: Eye,
      href: "/dashboard/hr/recruitment/applications",
      variant: "outline" as const,
    },
    {
      title: "Vérifications",
      description: "Gérer les vérifications réglementaires",
      icon: FileText,
      href: "/dashboard/hr/recruitment/verifications",
      variant: "outline" as const,
    },
    {
      title: "Parcours d&apos;intégration",
      description: "Suivre les intégrations en cours",
      icon: UserCheck,
      href: "/dashboard/hr/recruitment/onboarding",
      variant: "outline" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recrutement</h1>
          <p className="text-muted-foreground">
            Gestion des candidatures et intégrations
          </p>
        </div>
      </div>

      {/* Stats Widgets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {widgets.map((widget, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {widget.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${widget.bgColor}`}>
                <widget.icon className={`h-4 w-4 ${widget.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{widget.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                className="h-auto p-4 flex flex-col items-start space-y-2"
                asChild
              >
                <a href={action.href}>
                  <div className="flex items-center space-x-2">
                    <action.icon className="h-5 w-5" />
                    <span className="font-medium">{action.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-left">
                    {action.description}
                  </p>
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Nouvelle</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Candidature de Marie Dupont pour Agent de sécurité
                </p>
                <p className="text-xs text-muted-foreground">Il y a 2 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">Vérification</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Vérification CNAPS validée pour Jean Martin
                </p>
                <p className="text-xs text-muted-foreground">Il y a 4 heures</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="default">Intégration</Badge>
              <div className="flex-1">
                <p className="text-sm font-medium">
                  Parcours d&apos;intégration terminé pour Sophie Leroy
                </p>
                <p className="text-xs text-muted-foreground">Hier</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
