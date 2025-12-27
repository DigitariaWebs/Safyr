"use client";

import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Building2 } from "lucide-react";
import type { Company, Subcontractor, Client } from "@/lib/types";

export default function EntreprisePage() {
  const [isEditing, setIsEditing] = React.useState(false);

  const [company, setCompany] = React.useState<Company>({
    id: "1",
    name: "Safyr SARL",
    legalForm: "SARL",
    siret: "12345678901234",
    vatNumber: "FR12345678901",
    authorizationNumber: "",
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
    legalRepresentative: {
      firstName: "",
      lastName: "",
      status: "GERANT",
      phone: "",
      email: "",
      cnapsCardNumber: "",
    },
    administrativeDocuments: {},
    expirationAlerts: {},
    subcontractors: [
      {
        id: "sub1",
        name: "Sous-traitant Exemple 1",
        contracts: [
          {
            id: "contract1",
            subcontractorId: "sub1",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2024-01-01"),
            description: "Contrat de sous-traitance exemple",
            status: "active",
          },
        ],
      },
    ],
    clients: [
      {
        id: "client1",
        name: "Client Exemple 1",
        contracts: [
          {
            id: "clientcontract1",
            clientId: "client1",
            startDate: new Date("2023-01-01"),
            endDate: new Date("2024-01-01"),
            description: "Contrat client exemple",
            status: "active",
          },
        ],
        gifts: [
          {
            id: "gift1",
            clientId: "client1",
            giftDescription: "Cadeau exemple",
            date: new Date("2023-12-01"),
            value: 50,
            notes: "Notes sur le cadeau",
          },
        ],
      },
    ],
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

  const updateLegalRepresentative = (
    field: keyof Company["legalRepresentative"],
    value: string,
  ) => {
    setCompany((prev: Company) => ({
      ...prev,
      legalRepresentative: { ...prev.legalRepresentative, [field]: value },
    }));
  };

  const updateAdministrativeDocuments = (
    field: keyof Company["administrativeDocuments"],
    value: string,
  ) => {
    setCompany((prev: Company) => ({
      ...prev,
      administrativeDocuments: {
        ...prev.administrativeDocuments,
        [field]: value,
      },
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

      <div className="space-y-6">
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
            <div>
              <Label htmlFor="authorizationNumber">
                N° D&apos;autorisation / Carte CNAPS - CAPITAL
              </Label>
              <Input
                id="authorizationNumber"
                value={company.authorizationNumber || ""}
                onChange={(e) =>
                  updateCompany("authorizationNumber", e.target.value)
                }
                disabled={!isEditing}
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
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
        </div>

        <div className="grid gap-6 md:grid-cols-2">
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
                  onChange={(e) =>
                    updateBankDetails("bankName", e.target.value)
                  }
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

          <Card>
            <CardHeader>
              <CardTitle>Alertes d&apos;Expiration</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Carte pro CNAPS Dirigeant:{" "}
                {company.expirationAlerts.directorCnapsExpiry
                  ? new Date(
                      company.expirationAlerts.directorCnapsExpiry,
                    ).toLocaleDateString()
                  : "Non défini"}
              </p>
              <p>
                Carte pro CNAPS Société:{" "}
                {company.expirationAlerts.companyCnapsExpiry
                  ? new Date(
                      company.expirationAlerts.companyCnapsExpiry,
                    ).toLocaleDateString()
                  : "Non défini"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Représentant Légal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="repFirstName">Prénom</Label>
                <Input
                  id="repFirstName"
                  value={company.legalRepresentative.firstName}
                  onChange={(e) =>
                    updateLegalRepresentative("firstName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="repLastName">Nom</Label>
                <Input
                  id="repLastName"
                  value={company.legalRepresentative.lastName}
                  onChange={(e) =>
                    updateLegalRepresentative("lastName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="repStatus">Statut</Label>
                <select
                  id="repStatus"
                  value={company.legalRepresentative.status}
                  onChange={(e) =>
                    updateLegalRepresentative(
                      "status",
                      e.target.value as "GERANT" | "PRESIDENT",
                    )
                  }
                  disabled={!isEditing}
                  className="w-full p-2 border rounded"
                >
                  <option value="GERANT">Gérant</option>
                  <option value="PRESIDENT">Président</option>
                </select>
              </div>
              <div>
                <Label htmlFor="repPhone">Téléphone</Label>
                <Input
                  id="repPhone"
                  value={company.legalRepresentative.phone}
                  onChange={(e) =>
                    updateLegalRepresentative("phone", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="repEmail">Email</Label>
                <Input
                  id="repEmail"
                  type="email"
                  value={company.legalRepresentative.email}
                  onChange={(e) =>
                    updateLegalRepresentative("email", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="repCnaps">Carte pro CNAPS</Label>
                <Input
                  id="repCnaps"
                  value={company.legalRepresentative.cnapsCardNumber}
                  onChange={(e) =>
                    updateLegalRepresentative("cnapsCardNumber", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documents Administratifs</CardTitle>
            <Button onClick={() => console.log("Export PDF")}>
              Exporter en PDF
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="legalRepCNI">CNI du Représentant Légal</Label>
                <Input
                  id="legalRepCNI"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "legalRepCNI",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="directorCnapsCard">
                  Carte pro CNAPS du Dirigeant
                </Label>
                <Input
                  id="directorCnapsCard"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "directorCnapsCard",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="companyCnapsCard">
                  Carte pro CNAPS de l&apos;Entreprise
                </Label>
                <Input
                  id="companyCnapsCard"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "companyCnapsCard",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="kbis">Kbis</Label>
                <Input
                  id="kbis"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "kbis",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="urssafVigilance">
                  Attestation de Vigilance URSSAF
                </Label>
                <Input
                  id="urssafVigilance"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "urssafVigilance",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="fiscalRegularity">
                  Attestation de Régularité Fiscale
                </Label>
                <Input
                  id="fiscalRegularity"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "fiscalRegularity",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="rcProInsurance">
                  Attestation d&apos;Assurance RC PRO
                </Label>
                <Input
                  id="rcProInsurance"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "rcProInsurance",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="rib">RIB</Label>
                <Input
                  id="rib"
                  type="file"
                  onChange={(e) =>
                    updateAdministrativeDocuments(
                      "rib",
                      e.target.files?.[0]?.name || "",
                    )
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sous-traitance</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={company.subcontractors}
              columns={
                [
                  {
                    key: "name",
                    label: "Nom de l'Entreprise",
                  },
                  {
                    key: "contracts",
                    label: "Contrats",
                    render: (sub) => (
                      <span>{sub.contracts.length} contrats</span>
                    ),
                  },
                ] as ColumnDef<Subcontractor>[]
              }
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={company.clients}
              columns={
                [
                  {
                    key: "name",
                    label: "Nom du Client",
                  },
                  {
                    key: "contracts",
                    label: "Contrats",
                    render: (client) => (
                      <span>{client.contracts.length} contrats</span>
                    ),
                  },
                  {
                    key: "gifts",
                    label: "Cadeaux",
                    render: (client) => (
                      <span>{client.gifts.length} cadeaux</span>
                    ),
                  },
                ] as ColumnDef<Client>[]
              }
            />
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
