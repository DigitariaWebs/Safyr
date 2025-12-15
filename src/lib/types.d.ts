// Email Template Types
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
  lastModified: string;
}

export interface EmailTemplateFormData {
  name: string;
  subject: string;
  body: string;
  category: EmailTemplateCategory;
}

export type EmailTemplateCategory =
  | "rh"
  | "recrutement"
  | "formation"
  | "discipline"
  | "conges"
  | "paie"
  | "medical"
  | "autre";

export interface EmailTemplateCategoryOption {
  value: EmailTemplateCategory;
  label: string;
}
