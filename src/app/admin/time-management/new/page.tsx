"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Calendar } from "lucide-react";
import type { TimeOffRequest } from "@/lib/types";

export default function NewTimeOffRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    employeeId: "",
    type: "vacation" as TimeOffRequest["type"],
    startDate: "",
    endDate: "",
    reason: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newRequest: Partial<TimeOffRequest> = {
      id: `REQ${Date.now()}`,
      employeeId: formData.employeeId,
      type: formData.type,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      totalDays: calculateDays(),
      reason: formData.reason,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database via API
    console.log("New time-off request:", newRequest);

    // Redirect to time management list
    router.push("/admin/time-management");
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
            Nouvelle demande d&apos;absence
          </h1>
          <p className="text-muted-foreground">
            Créer une demande de congé ou d&apos;absence
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        {/* Employee Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Informations de la demande
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">
                Employé <span className="text-red-500">*</span>
              </Label>
              <select
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Sélectionner un employé</option>
                <option value="1">Jean Dupont (EMP001)</option>
                <option value="2">Marie Martin (EMP002)</option>
                <option value="3">Pierre Bernard (EMP003)</option>
                <option value="4">Sophie Dubois (EMP004)</option>
                <option value="5">Luc Moreau (EMP005)</option>
                <option value="6">Claire Petit (EMP006)</option>
                <option value="7">Thomas Roux (EMP007)</option>
                <option value="8">Emma Leroy (EMP008)</option>
                <option value="9">Alexandre Simon (EMP009)</option>
                <option value="10">Julie Laurent (EMP010)</option>
                <option value="11">Michel Blanc (EMP011)</option>
                <option value="12">Céline Garnier (EMP012)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                Type d&apos;absence <span className="text-red-500">*</span>
              </Label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="vacation">Congés payés</option>
                <option value="sick_leave">Arrêt maladie</option>
                <option value="unpaid_leave">Congé sans solde</option>
                <option value="maternity_leave">Congé maternité</option>
                <option value="paternity_leave">Congé paternité</option>
                <option value="family_event">Événement familial</option>
                <option value="training">Formation</option>
                <option value="cse_delegation">Délégation CSE</option>
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">
                  Date de début <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">
                  Date de fin <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate}
                  required
                />
              </div>
            </div>

            {formData.startDate && formData.endDate && (
              <div className="rounded-md bg-muted p-3">
                <p className="text-sm font-medium">
                  Durée: {calculateDays()} jour{calculateDays() > 1 ? "s" : ""}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="reason">Motif (optionnel)</Label>
              <Textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Précisez le motif de votre demande..."
                rows={4}
              />
            </div>

            <div className="rounded-md border border-muted bg-muted/50 p-4">
              <h4 className="font-medium mb-2">📋 Informations importantes</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>
                  • Les demandes de congés doivent être faites au moins 2
                  semaines à l&apos;avance
                </li>
                <li>
                  • Les arrêts maladie nécessitent un justificatif médical
                </li>
                <li>
                  • Les congés maternité/paternité doivent être déclarés dès que
                  possible
                </li>
                <li>
                  • Les heures de délégation CSE sont soumises à validation
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/time-management">Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Soumettre la demande
          </Button>
        </div>
      </form>
    </div>
  );
}
