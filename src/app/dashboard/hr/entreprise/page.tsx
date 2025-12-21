"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building2 } from "lucide-react";
import type { Company } from "@/lib/types";

export default function EntreprisePage() {
  const [isEditing, setIsEditing] = React.useState(false);

  const [company, setCompany] = React.useState<Company>({
    id: "1",
    name: "Safyr SARL",
    legalForm: "SARL",
    siret: "12345678901234",
    vatNumber: "FR12345678901",
    address: {
      street: "123 Rue de la Paix",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
    contact: {
      phone: "+33 1 23 45 67 89",
      email: "contact@safyr.fr",
      website: "https://www.safyr.fr",
    },
    bankDetails: {
      bankName: "Banque de France",
      iban: "FR1420041010050500013M02606",
      bic: "BDFEFR2L",
    },
  });

  const handleSave = () => {
    // TODO: Save to database
    console.log("Saving company info:", company);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const updateCompany = (
    field: keyof Omit<Company, "address" | "contact" | "bankDetails">,
    value: string,
  ) => {
    setCompany((prev: Company) => ({ ...prev, [field]: value }));
  };

  const updateAddress = (field: keyof Company["address"], value: string) => {
    setCompany((prev: Company) => ({
      ...prev,
      address: { ...prev.address, [field]: value },
    }));
  };

  const updateContact = (field: keyof Company["contact"], value: string) => {
    setCompany((prev: Company) => ({
      ...prev,
      contact: { ...prev.contact, [field]: value },
    }));
  };

  const updateBankDetails = (
    field: keyof Company["bankDetails"],
    value: string,
  ) => {
    setCompany((prev: Company) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Informations société</h1>
        </div>
        {!isEditing ? (
          <Button onClick={handleEdit}>Modifier</Button>
        ) : (
          <Button onClick={handleSave}>Enregistrer</Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nom de l&apos;entreprise</Label>
              <Input
                id="name"
                value={company.name}
                onChange={(e) => updateCompany("name", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="legalForm">Forme juridique</Label>
              <Input
                id="legalForm"
                value={company.legalForm}
                onChange={(e) => updateCompany("legalForm", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="siret">SIRET</Label>
              <Input
                id="siret"
                value={company.siret}
                onChange={(e) => updateCompany("siret", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="vatNumber">Numéro de TVA</Label>
              <Input
                id="vatNumber"
                value={company.vatNumber || ""}
                onChange={(e) => updateCompany("vatNumber", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Adresse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="street">Rue</Label>
              <Input
                id="street"
                value={company.address.street}
                onChange={(e) => updateAddress("street", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={company.address.city}
                onChange={(e) => updateAddress("city", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={company.address.postalCode}
                onChange={(e) => updateAddress("postalCode", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="country">Pays</Label>
              <Input
                id="country"
                value={company.address.country}
                onChange={(e) => updateAddress("country", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={company.contact.phone}
                onChange={(e) => updateContact("phone", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={company.contact.email}
                onChange={(e) => updateContact("email", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="website">Site web</Label>
              <Input
                id="website"
                value={company.contact.website || ""}
                onChange={(e) => updateContact("website", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informations bancaires</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="bankName">Nom de la banque</Label>
              <Input
                id="bankName"
                value={company.bankDetails.bankName}
                onChange={(e) => updateBankDetails("bankName", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={company.bankDetails.iban}
                onChange={(e) => updateBankDetails("iban", e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                value={company.bankDetails.bic}
                onChange={(e) => updateBankDetails("bic", e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {isEditing && (
        <div className="flex justify-end">
          <Button onClick={handleSave}>Enregistrer</Button>
        </div>
      )}
    </div>
  );
}
