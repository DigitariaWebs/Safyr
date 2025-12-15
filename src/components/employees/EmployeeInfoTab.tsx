"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import type { Employee } from "@/lib/types";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface EmployeeInfoTabProps {
  employee: Employee;
  isEditMode?: boolean;
}

export function EmployeeInfoTab({
  employee,
  isEditMode = false,
}: EmployeeInfoTabProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [formData, setFormData] = useState(employee);

  useEffect(() => {
    setIsEditing(isEditMode);
  }, [isEditMode]);

  const handleSave = () => {
    // TODO: Implement API call to update employee
    console.log("Saving employee data:", formData);
    router.push(`/admin/employees/${employee.id}`);
  };

  const handleCancel = () => {
    setFormData(employee);
    router.push(`/admin/employees/${employee.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date de naissance</Label>
              <Input
                id="dateOfBirth"
                type="date"
                value={formData.dateOfBirth.toISOString().split("T")[0]}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dateOfBirth: new Date(e.target.value),
                  })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
              <Input
                id="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, placeOfBirth: e.target.value })
                }
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationalité</Label>
              <Input
                id="nationality"
                value={formData.nationality}
                onChange={(e) =>
                  setFormData({ ...formData, nationality: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="civilStatus">État civil</Label>
              <Input
                id="civilStatus"
                value={formData.civilStatus}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialSecurityNumber">N° Sécurité Sociale</Label>
              <Input
                id="socialSecurityNumber"
                value={formData.socialSecurityNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    socialSecurityNumber: e.target.value,
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
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
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Adresse</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, street: e.target.value },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={formData.address.postalCode}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: {
                      ...formData.address,
                      postalCode: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bank Details */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées bancaires</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="iban">IBAN</Label>
              <Input
                id="iban"
                value={formData.bankDetails.iban}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...formData.bankDetails,
                      iban: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bic">BIC</Label>
              <Input
                id="bic"
                value={formData.bankDetails.bic}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...formData.bankDetails,
                      bic: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bankName">Nom de la banque</Label>
              <Input
                id="bankName"
                value={formData.bankDetails.bankName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    bankDetails: {
                      ...formData.bankDetails,
                      bankName: e.target.value,
                    },
                  })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
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
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeNumber">N° Employé</Label>
              <Input
                id="employeeNumber"
                value={formData.employeeNumber}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Date d&apos;embauche</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate.toISOString().split("T")[0]}
                disabled
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Poste</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Département</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) =>
                  setFormData({ ...formData, department: e.target.value })
                }
                disabled={!isEditing}
                readOnly={!isEditing}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save/Cancel Buttons */}
      {isEditing && (
        <div className="flex justify-end gap-4 sticky bottom-0 bg-background py-4 border-t">
          <Button variant="outline" onClick={handleCancel}>
            Annuler
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Enregistrer
          </Button>
        </div>
      )}
    </div>
  );
}
