"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import {
  Building2,
  Upload,
  Download,
  AlertTriangle,
  ExternalLink,
  FileCheck,
  CheckCircle2,
  Calendar,
  Loader2,
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { ApiError, type UpdateOrganizationPayload } from "@safyr/api-client";
import {
  useOrganization,
  useOrganizationCompliance,
  useUpdateOrganization,
  useCreateRepresentative,
  useUploadOrganizationDocument,
} from "@/hooks/organization";
import { getSignedUrl } from "@safyr/api-client";
import {
  UpdateOrganizationDto,
  UpdateOrganizationSchema,
} from "@safyr/schemas/organization";
import { EditableFormField } from "@/components/ui/editable-form-field";
import { PhoneField } from "@/components/ui/phone-field";
import { formatDate, formatDateForInput } from "@/lib/date-utils";

export default function InformationEntreprisePage() {
  const { data: organization, isLoading: isOrgLoading } = useOrganization();
  const { data: compliance, isLoading: isComplianceLoading } =
    useOrganizationCompliance();

  if (isOrgLoading || isComplianceLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!organization)
    return <div>Erreur lors du chargement de l&apos;entreprise</div>;

  return (
    <EntrepriseContent
      key={organization.id}
      organization={organization}
      compliance={compliance ?? []}
    />
  );
}

type EntrepriseContentProps = {
  organization: NonNullable<ReturnType<typeof useOrganization>["data"]>;
  compliance: NonNullable<ReturnType<typeof useOrganizationCompliance>["data"]>;
};

function EntrepriseContent({
  organization,
  compliance,
}: EntrepriseContentProps) {
  const updateOrgMutation = useUpdateOrganization();
  const createRepMutation = useCreateRepresentative();

  const defaultValues = useMemo<UpdateOrganizationDto>(() => {
    const rep = organization.representative;
    return {
      ...organization,
      representative: rep
        ? {
            ...rep,
            birthDate: rep.birthDate
              ? formatDateForInput(rep.birthDate)
              : rep.birthDate,
            appointmentDate: rep.appointmentDate
              ? formatDateForInput(rep.appointmentDate)
              : rep.appointmentDate,
          }
        : rep,
    };
  }, [organization]);

  const form = useForm({
    defaultValues,
    validators: {
      onChange: UpdateOrganizationSchema,
    },
  });

  const handleSave = async (
    payload: UpdateOrganizationPayload,
    path: string,
  ) => {
    try {
      await updateOrgMutation.mutateAsync(payload);
    } catch (error) {
      if (error instanceof ApiError && error.code === "VALIDATION_ERROR") {
        const details = error.details as { path: string; message: string }[];
        let relevantMessage: string | undefined;
        for (const detail of details) {
          form.setFieldMeta(detail.path as never, (prev) => ({
            ...prev,
            errors: [detail.message],
          }));
          if (detail.path === path) relevantMessage = detail.message;
        }
        if (relevantMessage) {
          throw new Error(relevantMessage);
        }
      }
      throw error;
    }
  };

  const handleCreateRepresentative = () => {
    createRepMutation.mutate({
      firstName: "Prénom",
      lastName: "Nom",
    });
  };

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({});

  const uploadMutation = useUploadOrganizationDocument();

  const handleUpload = async (requirementId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setUploadingId(requirementId);
        setUploadErrors((prev) => {
          const next = { ...prev };
          delete next[requirementId];
          return next;
        });
        uploadMutation.mutate(
          { file, requirementId },
          {
            onError: (error: unknown) => {
              const message =
                error instanceof ApiError
                  ? error.message
                  : "Échec du téléversement";
              setUploadErrors((prev) => ({
                ...prev,
                [requirementId]: message,
              }));
            },
            onSettled: () => {
              setUploadingId(null);
            },
          },
        );
      }
    };
    input.click();
  };

  const handleDownload = async (key: string) => {
    const url = await getSignedUrl(key);
    window.open(url, "_blank");
  };

  const representative = organization.representative;
  const totalDocs = compliance.length;
  let validDocs = 0;
  let expiringDocs = 0;
  for (const c of compliance) {
    if (c.status === "valid") validDocs++;
    else if (c.status === "expiring") expiringDocs++;
  }

  const STATUS_META = {
    valid: { variant: "default", label: "Valide", dot: "bg-green-500" },
    expired: {
      variant: "destructive",
      label: "Expiré",
      dot: "bg-destructive",
    },
    expiring: {
      variant: "secondary",
      label: "Expire bientôt",
      dot: "bg-warning",
    },
    missing: { variant: "outline", label: "Manquant", dot: "bg-neutral-300" },
    optional: {
      variant: "outline",
      label: "Optionnel",
      dot: "bg-neutral-300",
    },
  } as const;
  type ComplianceStatus = keyof typeof STATUS_META;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Information Entreprise</h1>
          <p className="text-muted-foreground">
            Gestion des informations et documents administratifs de
            l&apos;entreprise
          </p>
        </div>
      </div>

      <InfoCardContainer>
        <InfoCard
          icon={Building2}
          title="Entreprise"
          value={organization.name}
          subtext={`SIRET: ${organization.siret || "Non renseigné"}`}
          color="blue"
        />
        <InfoCard
          icon={CheckCircle2}
          title="Documents valides"
          value={validDocs}
          subtext={`sur ${totalDocs} documents requis`}
          color="green"
        />
        <InfoCard
          icon={AlertTriangle}
          title="Expire bientôt"
          value={expiringDocs}
          subtext={expiringDocs > 0 ? "nécessite renouvellement" : "aucun"}
          color="orange"
        />
        <InfoCard
          icon={Calendar}
          title="Capital social"
          value={`${organization.shareCapital ? Number(organization.shareCapital).toLocaleString() : "0"} €`}
          subtext="capital déclaré"
          color="purple"
        />
      </InfoCardContainer>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                <CardTitle>Informations de l&apos;entreprise</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="name">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="Nom de l'entreprise"
                      onSave={(val) =>
                        handleSave({ name: val as string }, "name")
                      }
                    >
                      <Input placeholder="Nom" />
                    </EditableFormField>
                  )}
                </form.Field>
                <form.Field name="siret">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="SIRET"
                      onSave={(val) =>
                        handleSave({ siret: val as string }, "siret")
                      }
                    >
                      <Input placeholder="Numéro SIRET" />
                    </EditableFormField>
                  )}
                </form.Field>
              </div>

              <form.Field name="address">
                {(field) => (
                  <EditableFormField
                    field={field}
                    label="Adresse"
                    onSave={(val) =>
                      handleSave({ address: val as string }, "address")
                    }
                  >
                    <Textarea placeholder="Adresse complète" />
                  </EditableFormField>
                )}
              </form.Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="shareCapital">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="Capital Social (€)"
                      className="flex-1"
                      onSave={(val) =>
                        handleSave(
                          { shareCapital: val as string },
                          "shareCapital",
                        )
                      }
                    >
                      <Input placeholder="0" />
                    </EditableFormField>
                  )}
                </form.Field>
                <form.Field name="authorizationNumber">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="N° Autorisation CNAPS"
                      className="flex-1"
                      onSave={(val) =>
                        handleSave(
                          { authorizationNumber: val as string },
                          "authorizationNumber",
                        )
                      }
                    >
                      <Input placeholder="AUT-..." />
                    </EditableFormField>
                  )}
                </form.Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <form.Field name="email">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="Email de l'entreprise"
                      onSave={(val) =>
                        handleSave({ email: val as string }, "email")
                      }
                    >
                      <Input type="email" placeholder="email@entreprise.com" />
                    </EditableFormField>
                  )}
                </form.Field>
                <form.Field name="phone">
                  {(field) => (
                    <EditableFormField
                      field={field}
                      label="Téléphone de l'entreprise"
                      onSave={(val) =>
                        handleSave({ phone: val as string }, "phone")
                      }
                    >
                      <PhoneField placeholder="01 23 45 67 89" />
                    </EditableFormField>
                  )}
                </form.Field>
              </div>

              <div className="border-t pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations du dirigeant
                  </h3>
                  {!representative && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={handleCreateRepresentative}
                      disabled={createRepMutation.isPending}
                    >
                      {createRepMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Ajouter un dirigeant
                    </Button>
                  )}
                </div>

                {representative ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="representative.lastName">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Nom"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: { lastName: val as string },
                                },
                                "representative.lastName",
                              )
                            }
                          >
                            <Input placeholder="Nom" />
                          </EditableFormField>
                        )}
                      </form.Field>
                      <form.Field name="representative.firstName">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Prénom"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: { firstName: val as string },
                                },
                                "representative.firstName",
                              )
                            }
                          >
                            <Input placeholder="Prénom" />
                          </EditableFormField>
                        )}
                      </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="representative.position">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Fonction"
                            onSave={(val) =>
                              handleSave(
                                { representative: { position: val as string } },
                                "representative.position",
                              )
                            }
                          >
                            <Input placeholder="Fonction" />
                          </EditableFormField>
                        )}
                      </form.Field>
                      <form.Field name="representative.appointmentDate">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Date de nomination"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    appointmentDate: val as string,
                                  },
                                },
                                "representative.appointmentDate",
                              )
                            }
                          >
                            <Input type="date" />
                          </EditableFormField>
                        )}
                      </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="representative.birthDate">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Date de naissance"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    birthDate: val as string,
                                  },
                                },
                                "representative.birthDate",
                              )
                            }
                          >
                            <Input type="date" />
                          </EditableFormField>
                        )}
                      </form.Field>
                      <form.Field name="representative.birthPlace">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Lieu de naissance"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    birthPlace: val as string,
                                  },
                                },
                                "representative.birthPlace",
                              )
                            }
                          >
                            <Input placeholder="Ville, Pays" />
                          </EditableFormField>
                        )}
                      </form.Field>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="representative.nationality">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Nationalité"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    nationality: val as string,
                                  },
                                },
                                "representative.nationality",
                              )
                            }
                          >
                            <Input placeholder="Nationalité" />
                          </EditableFormField>
                        )}
                      </form.Field>
                      <form.Field name="representative.socialSecurityNumber">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Numéro de sécurité sociale"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    socialSecurityNumber: val as string,
                                  },
                                },
                                "representative.socialSecurityNumber",
                              )
                            }
                          >
                            <Input placeholder="1 00..." />
                          </EditableFormField>
                        )}
                      </form.Field>
                    </div>

                    <form.Field name="representative.address">
                      {(field) => (
                        <EditableFormField
                          field={field}
                          label="Adresse personnelle"
                          onSave={(val) =>
                            handleSave(
                              {
                                representative: {
                                  address: val as string,
                                },
                              },
                              "representative.address",
                            )
                          }
                        >
                          <Textarea placeholder="Adresse complète" />
                        </EditableFormField>
                      )}
                    </form.Field>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <form.Field name="representative.email">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Email personnel"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    email: val as string,
                                  },
                                },
                                "representative.email",
                              )
                            }
                          >
                            <Input type="email" placeholder="email@perso.com" />
                          </EditableFormField>
                        )}
                      </form.Field>
                      <form.Field name="representative.phone">
                        {(field) => (
                          <EditableFormField
                            field={field}
                            label="Téléphone personnel"
                            onSave={(val) =>
                              handleSave(
                                {
                                  representative: {
                                    phone: val as string,
                                  },
                                },
                                "representative.phone",
                              )
                            }
                          >
                            <PhoneField placeholder="06 12 34 56 78" />
                          </EditableFormField>
                        )}
                      </form.Field>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Aucun dirigeant configuré pour cette entreprise.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <ExternalLink className="h-4 w-4" />
                  Liens Rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  {[
                    { name: "URSSAF", url: "https://urssaf.fr" },
                    { name: "Impôts", url: "https://impots.gouv.fr" },
                    { name: "Infogreffe", url: "https://infogreffe.fr" },
                  ].map((link) => (
                    <Button
                      key={link.name}
                      variant="outline"
                      size="sm"
                      className="flex-1 h-8 text-xs"
                      onClick={() => window.open(link.url, "_blank")}
                    >
                      {link.name}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileCheck className="h-5 w-5" />
                    Documents Administratifs
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {compliance.map((item) => {
                    const meta =
                      STATUS_META[item.status as ComplianceStatus] ??
                      STATUS_META.missing;
                    const containerCls =
                      item.status === "expired"
                        ? "border-destructive/20 bg-destructive/10"
                        : item.status === "expiring"
                          ? "border-warning/20 bg-warning/10"
                          : "hover:bg-accent";
                    return (
                      <div
                        key={item.requirement.id}
                        className={`flex flex-col py-3 px-3 border rounded-md ${containerCls}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-2 h-2 rounded-full ${meta.dot}`}
                            ></div>
                            <div>
                              <p className="font-medium text-sm">
                                {item.requirement.name}
                                {item.requirement.isRequired && (
                                  <span className="text-destructive ml-1">
                                    *
                                  </span>
                                )}
                              </p>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Badge
                                  variant={meta.variant}
                                  className="text-xs h-5"
                                >
                                  {meta.label}
                                </Badge>
                                {item.document?.expiryDate && (
                                  <span className="text-xs text-muted-foreground">
                                    Expire le{" "}
                                    {formatDate(item.document.expiryDate)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {item.document && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() =>
                                  handleDownload(item.document!.storageKey)
                                }
                              >
                                <Download className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 p-0"
                              onClick={() => handleUpload(item.requirement.id)}
                              disabled={uploadingId === item.requirement.id}
                            >
                              {uploadingId === item.requirement.id ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <Upload className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        {uploadErrors[item.requirement.id] && (
                          <p className="text-xs text-destructive mt-2">
                            {uploadErrors[item.requirement.id]}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
