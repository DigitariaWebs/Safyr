"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const modules = [
    {
      title: "Ressources Humaines",
      description:
        "Gestion complète du personnel, paie, formations et conformité",
      icon: Users,
      href: "/dashboard/hr",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Main Courante Digitale",
      description:
        "Suivi des événements, incidents et validation en temps réel",
      icon: BookOpen,
      href: "/dashboard/logbook",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="flex h-screen items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl font-light tracking-tight mb-4">
            Tableau de bord
          </h1>
          <p className="text-lg font-light text-muted-foreground">
            Sélectionnez un module pour commencer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="glass-card border-border/40 hover:border-primary/50 transition-all h-full group cursor-pointer">
                  <CardHeader>
                    <div
                      className={`${module.bgColor} w-16 h-16 rounded-lg flex items-center justify-center mb-4`}
                    >
                      <Icon className={`h-8 w-8 ${module.color}`} />
                    </div>
                    <CardTitle className="text-2xl font-light">
                      {module.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">
                      {module.description}
                    </p>
                    <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">
                        Accéder au module
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
