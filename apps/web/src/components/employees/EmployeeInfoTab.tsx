"use client";

import { useMemo, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneField } from "@/components/ui/phone-field";
import { EditableFormField } from "@/components/ui/editable-form-field";
import { EditableSelect } from "@/components/ui/editable-select";
import { Edit, Loader2, Save, X } from "lucide-react";
import type { Employee } from "@/lib/types";
import { useUpdateEmployee } from "@/hooks/employees";
import { ApiError, type UpdateEmployeePayload } from "@safyr/api-client";
import type { AnyFieldApi } from "@tanstack/react-form";

interface Props {
  employee: Employee;
}

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  placeOfBirth: string;
  nationality: string;
  gender: "male" | "female" | "other";
  civilStatus: "single" | "married" | "divorced" | "widowed" | "civil-union";
  children: number;
  socialSecurityNumber: string;
  position: string;
  employeeNumber: string;
  hireDate: string;
  contractType?: "CDI" | "CDD" | "INTERIM" | "APPRENTICESHIP" | "INTERNSHIP";
  workSchedule: "full-time" | "part-time";
  status: "active" | "inactive" | "suspended" | "terminated";
  role: "owner" | "agent";
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  bankDetails: {
    iban: string;
    bic: string;
    bankName: string;
  };
};

const toIso = (d: Date | undefined): string => {
  if (!d) return "";
  const t = d.getTime();
  if (!t || Number.isNaN(t)) return "";
  return d.toISOString().split("T")[0];
};

export function EmployeeInfoTab({ employee }: Props) {
  const updateMutation = useUpdateEmployee(employee.id);

  const defaultValues = useMemo<FormValues>(
    () => ({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      dateOfBirth: toIso(employee.dateOfBirth),
      placeOfBirth: employee.placeOfBirth,
      nationality: employee.nationality,
      gender: employee.gender,
      civilStatus: employee.civilStatus,
      children: employee.children ?? 0,
      socialSecurityNumber: employee.socialSecurityNumber,
      position: employee.position,
      employeeNumber: employee.employeeNumber,
      hireDate: toIso(employee.hireDate),
      contractType: employee.contractType,
      workSchedule: employee.workSchedule,
      status: employee.status,
      role: employee.role ?? "agent",
      address: { ...employee.address },
      bankDetails: { ...employee.bankDetails },
    }),
    [employee],
  );

  const form = useForm({
    defaultValues,
  });

  const applyServerErrors = (err: unknown, primaryPath?: string) => {
    if (err instanceof ApiError && err.code === "VALIDATION_ERROR") {
      const details = err.details as
        | { path: string; message: string }[]
        | undefined;
      if (Array.isArray(details)) {
        let relevant: string | undefined;
        for (const d of details) {
          form.setFieldMeta(d.path as never, (prev) => ({
            ...prev,
            errors: [d.message],
            isTouched: true,
          }));
          if (d.path === primaryPath) relevant = d.message;
        }
        if (relevant) throw new Error(relevant);
      }
    }
    throw err;
  };

  const handleFieldSave = async (
    payload: UpdateEmployeePayload,
    path: string,
  ) => {
    try {
      await updateMutation.mutateAsync(payload);
    } catch (err) {
      applyServerErrors(err, path);
    }
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
            <form.Field name="firstName">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Prénom"
                  onSave={(v) =>
                    handleFieldSave({ firstName: v as string }, "firstName")
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="lastName">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Nom"
                  onSave={(v) =>
                    handleFieldSave({ lastName: v as string }, "lastName")
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="dateOfBirth">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Date de naissance"
                  onSave={(v) =>
                    handleFieldSave(
                      { dateOfBirth: (v as string) || undefined },
                      "dateOfBirth",
                    )
                  }
                >
                  <Input type="date" />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="placeOfBirth">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Lieu de naissance"
                  onSave={(v) =>
                    handleFieldSave(
                      { placeOfBirth: v as string },
                      "placeOfBirth",
                    )
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="nationality">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Nationalité"
                  onSave={(v) =>
                    handleFieldSave({ nationality: v as string }, "nationality")
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="socialSecurityNumber">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="N° Sécurité sociale"
                  onSave={(v) =>
                    handleFieldSave(
                      { socialSecurityNumber: v as string },
                      "socialSecurityNumber",
                    )
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Employment */}
      <Card>
        <CardHeader>
          <CardTitle>Informations d&apos;emploi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="employeeNumber">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="N° Employé"
                  onSave={(v) =>
                    handleFieldSave(
                      { employeeNumber: v as string },
                      "employeeNumber",
                    )
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="hireDate">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Date d'embauche"
                  onSave={(v) =>
                    handleFieldSave(
                      { hireDate: (v as string) || undefined },
                      "hireDate",
                    )
                  }
                >
                  <Input type="date" />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="position">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Poste"
                  onSave={(v) =>
                    handleFieldSave({ position: v as string }, "position")
                  }
                >
                  <Input />
                </EditableFormField>
              )}
            </form.Field>
            <EditableSelect
              label="Rôle"
              value={employee.role ?? "agent"}
              options={[
                { value: "agent", label: "Agent" },
                { value: "owner", label: "Propriétaire" },
              ]}
              onSave={(v) =>
                handleFieldSave({ role: v as FormValues["role"] }, "role")
              }
            />
            <EditableSelect
              label="Type de contrat"
              value={employee.contractType ?? "CDI"}
              options={[
                { value: "CDI", label: "CDI" },
                { value: "CDD", label: "CDD" },
                { value: "INTERIM", label: "Intérim" },
                { value: "APPRENTICESHIP", label: "Apprentissage" },
                { value: "INTERNSHIP", label: "Stage" },
              ]}
              onSave={(v) =>
                handleFieldSave(
                  { contractType: v as FormValues["contractType"] },
                  "contractType",
                )
              }
            />
            <EditableSelect
              label="Temps de travail"
              value={employee.workSchedule}
              options={[
                { value: "full-time", label: "Temps complet" },
                { value: "part-time", label: "Temps partiel" },
              ]}
              onSave={(v) =>
                handleFieldSave(
                  { workSchedule: v as FormValues["workSchedule"] },
                  "workSchedule",
                )
              }
            />
            <EditableSelect
              label="Statut"
              value={employee.status}
              options={[
                { value: "active", label: "Actif" },
                { value: "inactive", label: "Inactif" },
                { value: "suspended", label: "Suspendu" },
                { value: "terminated", label: "Terminé" },
              ]}
              onSave={(v) =>
                handleFieldSave({ status: v as FormValues["status"] }, "status")
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <form.Field name="email">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Email"
                  onSave={(v) =>
                    handleFieldSave({ email: v as string }, "email")
                  }
                >
                  <Input type="email" />
                </EditableFormField>
              )}
            </form.Field>
            <form.Field name="phone">
              {(field) => (
                <EditableFormField
                  field={field}
                  label="Téléphone"
                  onSave={(v) =>
                    handleFieldSave({ phone: v as string }, "phone")
                  }
                >
                  <PhoneField />
                </EditableFormField>
              )}
            </form.Field>
          </div>
        </CardContent>
      </Card>

      {/* Address + Bank side-by-side */}
      <div className="grid gap-6 md:grid-cols-2">
        <AddressCard form={form} onSaveGroup={handleFieldSave} />
        <BankCard form={form} onSaveGroup={handleFieldSave} />
      </div>
    </div>
  );
}

// narrow form API shape so sub-components don't need the full 10-generic type
type FormApi = {
  Field: (props: {
    name: string;
    children: (field: AnyFieldApi) => React.ReactNode;
  }) => React.ReactNode | Promise<React.ReactNode>;
  state: { values: FormValues };
  resetField: (name: never) => void;
};

function GroupedEditCard({
  title,
  onSave,
  onCancel,
  children,
}: {
  title: string;
  onSave: () => Promise<void>;
  onCancel: () => void;
  children: (isEditing: boolean) => React.ReactNode;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await onSave();
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    onCancel();
    setIsEditing(false);
    setError(null);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {!isEditing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Modifier
          </Button>
        ) : (
          <div className="flex gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={cancel}
              disabled={saving}
            >
              <X className="h-4 w-4" />
            </Button>
            <Button type="button" size="sm" onClick={save} disabled={saving}>
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Enregistrer
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {children(isEditing)}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}

function AddressCard({
  form,
  onSaveGroup,
}: {
  form: FormApi;
  onSaveGroup: (payload: UpdateEmployeePayload, path: string) => Promise<void>;
}) {
  return (
    <GroupedEditCard
      title="Adresse"
      onSave={() =>
        onSaveGroup({ address: form.state.values.address }, "address")
      }
      onCancel={() => form.resetField("address" as never)}
    >
      {(isEditing) => (
        <>
          <form.Field name="address.street">
            {(field) => (
              <FieldGroup field={field} label="Rue" disabled={!isEditing} />
            )}
          </form.Field>
          <div className="grid gap-4 md:grid-cols-3">
            <form.Field name="address.city">
              {(field) => (
                <FieldGroup field={field} label="Ville" disabled={!isEditing} />
              )}
            </form.Field>
            <form.Field name="address.postalCode">
              {(field) => (
                <FieldGroup
                  field={field}
                  label="Code postal"
                  disabled={!isEditing}
                />
              )}
            </form.Field>
            <form.Field name="address.country">
              {(field) => (
                <FieldGroup field={field} label="Pays" disabled={!isEditing} />
              )}
            </form.Field>
          </div>
        </>
      )}
    </GroupedEditCard>
  );
}

function BankCard({
  form,
  onSaveGroup,
}: {
  form: FormApi;
  onSaveGroup: (payload: UpdateEmployeePayload, path: string) => Promise<void>;
}) {
  return (
    <GroupedEditCard
      title="Coordonnées bancaires"
      onSave={() =>
        onSaveGroup(
          { bankDetails: form.state.values.bankDetails },
          "bankDetails",
        )
      }
      onCancel={() => form.resetField("bankDetails" as never)}
    >
      {(isEditing) => (
        <>
          <form.Field name="bankDetails.iban">
            {(field) => (
              <FieldGroup field={field} label="IBAN" disabled={!isEditing} />
            )}
          </form.Field>
          <div className="grid gap-4 md:grid-cols-2">
            <form.Field name="bankDetails.bic">
              {(field) => (
                <FieldGroup field={field} label="BIC" disabled={!isEditing} />
              )}
            </form.Field>
            <form.Field name="bankDetails.bankName">
              {(field) => (
                <FieldGroup
                  field={field}
                  label="Nom de la banque"
                  disabled={!isEditing}
                />
              )}
            </form.Field>
          </div>
        </>
      )}
    </GroupedEditCard>
  );
}

function FieldGroup({
  field,
  label,
  disabled,
}: {
  // relaxed type — inline field from tanstack-form nested path
  field: {
    name: string;
    state: { value: unknown; meta: { errors: unknown[]; isTouched: boolean } };
    handleChange: (v: string) => void;
    handleBlur: () => void;
  };
  label: string;
  disabled?: boolean;
}) {
  const errors = field.state.meta.errors;
  const isInvalid = field.state.meta.isTouched && errors.length > 0;
  const msg = errors
    .map((e) =>
      typeof e === "string" ? e : ((e as { message?: string })?.message ?? ""),
    )
    .filter(Boolean)
    .join(", ");
  return (
    <div className="space-y-1.5">
      <Label className={isInvalid ? "text-destructive" : ""}>{label}</Label>
      <Input
        value={String(field.state.value ?? "")}
        onChange={(e) => field.handleChange(e.target.value)}
        onBlur={field.handleBlur}
        disabled={disabled}
        className={
          isInvalid
            ? "border-destructive ring-destructive/20 text-destructive"
            : ""
        }
      />
      {isInvalid && msg && <p className="text-xs text-destructive">{msg}</p>}
    </div>
  );
}
