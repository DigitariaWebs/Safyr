"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, User } from "lucide-react";
import type { Employee } from "@/lib/types";

export default function NewEmployeePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    placeOfBirth: "",
    nationality: "Française",
    civilStatus: "single" as Employee["civilStatus"],
    children: 0,

    // Address
    street: "",
    city: "",
    postalCode: "",
    country: "France",

    // Bank Details
    iban: "",
    bic: "",
    bankName: "",

    // Employment
    socialSecurityNumber: "",
    employeeNumber: "",
    hireDate: "",
    position: "",
    department: "",
    status: "active" as Employee["status"],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "children" ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Create new employee object
    const newEmployee: Employee = {
      id: `EMP${Date.now()}`, // Temporary ID generation
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      photo: "/avatars/default.jpg",
      dateOfBirth: new Date(formData.dateOfBirth),
      placeOfBirth: formData.placeOfBirth,
      nationality: formData.nationality,
      civilStatus: formData.civilStatus,
      children: formData.children,
      address: {
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country,
      },
      bankDetails: {
        iban: formData.iban,
        bic: formData.bic,
        bankName: formData.bankName,
      },
      socialSecurityNumber: formData.socialSecurityNumber,
      employeeNumber: formData.employeeNumber,
      hireDate: new Date(formData.hireDate),
      position: formData.position,
      department: formData.department,
      status: formData.status,
      documents: {},
      contracts: [],
      assignedEquipment: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // TODO: Save to database via API
    console.log("New employee:", newEmployee);

    // Redirect to employees list
    router.push("/admin/employees");
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/employees">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">Nouvel employé</h1>
          <p className="text-muted-foreground">
            Ajouter un nouveau membre du personnel
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations personnelles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="placeOfBirth">
                  Lieu de naissance <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="placeOfBirth"
                  name="placeOfBirth"
                  value={formData.placeOfBirth}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nationality">Nationalité</Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="civilStatus">Situation familiale</Label>
                <select
                  id="civilStatus"
                  name="civilStatus"
                  value={formData.civilStatus}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="single">Célibataire</option>
                  <option value="married">Marié(e)</option>
                  <option value="divorced">Divorcé(e)</option>
                  <option value="widowed">Veuf/Veuve</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="children">Nombre d&apos;enfants</Label>
                <Input
                  id="children"
                  name="children"
                  type="number"
                  min="0"
                  value={formData.children}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Coordonnées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Téléphone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+33 6 12 34 56 78"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">
                Rue <span className="text-red-500">*</span>
              </Label>
              <Input
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="city">
                  Ville <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">
                  Code postal <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Pays</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card>
          <CardHeader>
            <CardTitle>Informations d&apos;emploi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="employeeNumber">
                  Numéro d&apos;employé <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="employeeNumber"
                  name="employeeNumber"
                  placeholder="EMP013"
                  value={formData.employeeNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialSecurityNumber">
                  Numéro de sécurité sociale{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="socialSecurityNumber"
                  name="socialSecurityNumber"
                  placeholder="1 90 05 75 001 234 56"
                  value={formData.socialSecurityNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">
                  Poste <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="position"
                  name="position"
                  placeholder="Agent de sécurité"
                  value={formData.position}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">
                  Département <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="Sécurité"
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hireDate">
                  Date d&apos;embauche <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="hireDate"
                  name="hireDate"
                  type="date"
                  value={formData.hireDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Statut</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                  <option value="terminated">Terminé</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Details */}
        <Card>
          <CardHeader>
            <CardTitle>Informations bancaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="iban">
                  IBAN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="iban"
                  name="iban"
                  placeholder="FR76 1234 5678 9012 3456 7890 123"
                  value={formData.iban}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bic">
                  BIC <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bic"
                  name="bic"
                  placeholder="BNPAFRPP"
                  value={formData.bic}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bankName">
                  Nom de la banque <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="bankName"
                  name="bankName"
                  placeholder="BNP Paribas"
                  value={formData.bankName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/employees">Annuler</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      </form>
    </div>
  );
}
