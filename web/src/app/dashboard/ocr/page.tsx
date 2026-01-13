"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { mockOCRDocuments } from "@/data/ocr-documents";

export default function OCRDashboard() {
  const totalDocuments = mockOCRDocuments.length;
  const processedDocuments = mockOCRDocuments.filter(
    (d) => d.status === "Traité",
  ).length;
  const pendingDocuments = mockOCRDocuments.filter(
    (d) => d.status === "En attente" || d.status === "En traitement",
  ).length;
  const errorDocuments = mockOCRDocuments.filter(
    (d) => d.status === "Erreur",
  ).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tableau de bord OCR</h1>
        <p className="text-muted-foreground">
          Reconnaissance automatique de documents
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Documents Totaux
            </CardTitle>
            <FileText className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDocuments}</div>
            <p className="text-xs text-muted-foreground">Documents traités</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traités</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{processedDocuments}</div>
            <p className="text-xs text-muted-foreground">Avec succès</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            <Upload className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDocuments}</div>
            <p className="text-xs text-muted-foreground">En traitement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Erreurs</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{errorDocuments}</div>
            <p className="text-xs text-muted-foreground">À corriger</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
