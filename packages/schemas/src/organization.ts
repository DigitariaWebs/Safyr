import { z } from "zod";

export const UpdateRepresentativeSchema = z.object({
  firstName: z.string().min(1, "Prénom requis").optional(),
  lastName: z.string().min(1, "Nom requis").optional(),
  birthDate: z.iso.date().optional(),
  birthPlace: z.string().optional(),
  nationality: z.string().optional(),
  address: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  position: z.string().optional(),
  appointmentDate: z.iso.date().optional(),
  socialSecurityNumber: z.string().optional(),
});

export const UpdateOrganizationSchema = z.object({
  name: z.string().min(1, "Nom de l'entreprise requis").optional(),
  shareCapital: z.string().optional(),
  authorizationNumber: z.string().optional(),
  email: z.string().email("Email invalide").optional(),
  phone: z.string().optional(),
  siret: z.string().optional(),
  ape: z.string().optional(),
  address: z.string().optional(),
  representative: UpdateRepresentativeSchema.optional(),
});

export const CreateRepresentativeSchema = UpdateRepresentativeSchema.extend({
  firstName: z.string().min(1, "Prénom requis"),
  lastName: z.string().min(1, "Nom requis"),
});

export const UploadDocumentSchema = z.object({
  requirementId: z.string().min(1, "requirementId requis"),
  expiryDate: z.iso.date().optional(),
});

export type UploadDocumentDto = z.infer<typeof UploadDocumentSchema>;
export type UpdateOrganizationDto = z.infer<typeof UpdateOrganizationSchema>;
export type UpdateRepresentativeDto = z.infer<
  typeof UpdateRepresentativeSchema
>;
export type CreateRepresentativeDto = z.infer<
  typeof CreateRepresentativeSchema
>;
