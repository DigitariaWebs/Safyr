"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Calendar,
  Target,
  TrendingUp,
  FileText,
  AlertCircle,
} from "lucide-react";

export default function InterviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Entretiens & Performance</h1>
        <p className="text-muted-foreground">
          Gestion des entretiens annuels, professionnels et suivi des objectifs
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Entretiens Annuels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Gestion des entretiens annuels d&apos;évaluation de la performance et
              fixation des objectifs pour l&apos;année suivante.
            </p>
            <Link href="/dashboard/hr/interviews/annual">
              <Button className="w-full">Accéder</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Entretiens Professionnels
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Entretiens professionnels obligatoires tous les 2 ans pour
              discuter des perspectives d&apos;évolution professionnelle.
            </p>
            <Link href="/dashboard/hr/interviews/professional">
              <Button className="w-full">Accéder</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-purple-600" />
              Objectifs & Évolution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Suivi des objectifs individuels, perspectives d&apos;évolution interne
              et développement des compétences.
            </p>
            <Link href="/dashboard/hr/interviews/objectives">
              <Button className="w-full">Accéder</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informations importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Entretien annuel</p>
              <p className="text-sm text-muted-foreground">
                L&apos;entretien annuel permet d&apos;évaluer la performance de l&apos;employé
                sur l&apos;année écoulée et de fixer les objectifs pour l&apos;année
                suivante. C&apos;est un moment d&apos;échange entre le manager et
                l&apos;employé.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Entretien professionnel (obligatoire)
              </p>
              <p className="text-sm text-muted-foreground">
                L&apos;entretien professionnel est une obligation légale qui doit
                avoir lieu tous les 2 ans. Il porte sur les perspectives
                d&apos;évolution professionnelle du salarié, notamment en termes de
                qualifications et d&apos;emploi.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">
                Suivi des objectifs et évolution
              </p>
              <p className="text-sm text-muted-foreground">
                Le suivi des objectifs permet de mesurer la progression de
                chaque employé sur ses objectifs personnels et professionnels,
                et d&apos;identifier les opportunités d&apos;évolution interne.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-linear-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            Bonnes pratiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Planifier les entretiens annuels au moins 2 semaines à l&apos;avance
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Préparer les entretiens professionnels avec le parcours et les
                formations de l&apos;employé
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Définir des objectifs SMART (Spécifiques, Mesurables,
                Atteignables, Réalistes, Temporels)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Faire un suivi régulier des objectifs (trimestriel ou
                semestriel)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>
                Conserver tous les documents signés pour la conformité légale
              </span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
