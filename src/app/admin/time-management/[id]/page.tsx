"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  User,
  FileText,
  Download,
  Check,
  X,
} from "lucide-react";
import type { TimeOffRequest } from "@/types/time-management";
import { getTimeOffRequestById } from "@/data/time-management";

export default function TimeOffDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const request = getTimeOffRequestById(id);
  const [validationComment, setValidationComment] = useState("");
  const [isValidating, setIsValidating] = useState(false);

  if (!request) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold mb-2">Demande non trouvée</h1>
        <p className="text-muted-foreground mb-4">
          La demande avec l&apos;ID {id} n&apos;existe pas.
        </p>
        <Button asChild>
          <Link href="/admin/time-management">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux demandes
          </Link>
        </Button>
      </div>
    );
  }

  const getStatusBadge = (status: TimeOffRequest["status"]) => {
    const variants = {
      pending: { variant: "secondary" as const, label: "En attente", icon: Clock },
      approved: { variant: "default" as const, label: "Approuvé", icon: CheckCircle },
      rejected: { variant: "destructive" as const, label: "Refusé", icon: XCircle },
      cancelled: { variant: "outline" as const, label: "Annulé", icon: XCircle },
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

  const statusConfig = getStatusBadge(request.status);
  const StatusIcon = statusConfig.icon;

  const handleValidation = (approved: boolean) => {
    setIsValidating(true);
    // TODO: API call to validate/reject request
    console.log("Validation:", { approved, comment: validationComment });
    setTimeout(() => {
      setIsValidating(false);
      // Redirect or show success message
    }, 1000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/time-management">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Demande #{request.id}
          </h1>
          <p className="text-muted-foreground">
            {getTypeLabel(request.type)} - {request.employeeName}
          </p>
        </div>
        <Badge variant={statusConfig.variant} className="flex items-center gap-1">
          <StatusIcon className="h-3 w-3" />
          {statusConfig.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Détails de la demande
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Type de demande
                  </label>
                  <p className="mt-1 font-medium">{getTypeLabel(request.type)}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Durée
                  </label>
                  <p className="mt-1 font-medium">
                    {request.totalDays} jour{request.totalDays > 1 ? "s" : ""}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date de début
                  </label>
                  <p className="mt-1 font-medium">
                    {request.startDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Date de fin
                  </label>
                  <p className="mt-1 font-medium">
                    {request.endDate.toLocaleDateString("fr-FR", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {request.reason && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Motif
                  </label>
                  <p className="mt-1">{request.reason}</p>
                </div>
              )}

              {request.attachments && request.attachments.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Pièces jointes
                  </label>
                  <div className="mt-2 space-y-2">
                    {request.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        asChild
                      >
                        <a href={attachment} download>
                          <Download className="mr-2 h-4 w-4" />
                          Justificatif {index + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Validation Section */}
          {request.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Validation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">
                    Commentaire (optionnel)
                  </label>
                  <Textarea
                    value={validationComment}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValidationComment(e.target.value)}
                    placeholder="Ajouter un commentaire..."
                    className="mt-2"
                    rows={3}
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleValidation(true)}
                    disabled={isValidating}
                    className="flex-1"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Approuver
                  </Button>
                  <Button
                    onClick={() => handleValidation(false)}
                    disabled={isValidating}
                    variant="destructive"
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Refuser
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Validation History */}
          {(request.status === "approved" || request.status === "rejected") && (
            <Card>
              <CardHeader>
                <CardTitle>Historique de validation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <span className="font-medium">
                      {request.status === "approved" ? "Approuvé" : "Refusé"} par{" "}
                      {request.validatedBy}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Le {request.validatedAt?.toLocaleDateString("fr-FR")} à{" "}
                    {request.validatedAt?.toLocaleTimeString("fr-FR")}
                  </p>
                  {request.validationComment && (
                    <div className="mt-3 rounded-md bg-muted p-3">
                      <p className="text-sm">{request.validationComment}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Employee Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Employé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
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
                <div>
                  <p className="font-semibold">{request.employeeName}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.employeeNumber}
                  </p>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Département:</span>
                  <p className="font-medium">{request.department}</p>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                  <Link href={`/admin/employees/${request.employeeId}`}>
                    Voir le profil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Request Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Créée le:</span>
                <p className="font-medium">
                  {request.createdAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Dernière mise à jour:</span>
                <p className="font-medium">
                  {request.updatedAt.toLocaleDateString("fr-FR")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
