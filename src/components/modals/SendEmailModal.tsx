"use client";

import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Search, FileText, Edit } from "lucide-react";
import type { EmailTemplate, Employee } from "@/lib/types";

interface SendEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedEmployees: Employee[];
  templates: EmailTemplate[];
  onSend: (emailData: { subject: string; body: string }) => void;
}

export function SendEmailModal({
  open,
  onOpenChange,
  selectedEmployees,
  templates,
  onSend,
}: SendEmailModalProps) {
  const [mode, setMode] = useState<"select" | "compose">("select");
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterTag, setFilterTag] = useState<string>("all");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");

  // Get unique categories and tags from templates
  const categories = useMemo(() => {
    const cats = new Set(templates.map((t) => t.category));
    return Array.from(cats);
  }, [templates]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    templates.forEach((t) => t.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [templates]);

  // Filter templates based on search, category, and tag
  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        searchQuery === "" ||
        template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        template.subject.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        filterCategory === "all" || template.category === filterCategory;

      const matchesTag =
        filterTag === "all" || template.tags.includes(filterTag);

      return matchesSearch && matchesCategory && matchesTag;
    });
  }, [templates, searchQuery, filterCategory, filterTag]);

  const handleSelectTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template);
    setSubject(template.subject);
    setBody(template.body);
    setMode("compose");
  };

  const handleStartFromScratch = () => {
    setSelectedTemplate(null);
    setSubject("");
    setBody("");
    setMode("compose");
  };

  const handleBack = () => {
    setMode("select");
    setSelectedTemplate(null);
  };

  const handleSend = () => {
    onSend({ subject, body });
    handleClose();
  };

  const handleClose = () => {
    setMode("select");
    setSelectedTemplate(null);
    setSearchQuery("");
    setFilterCategory("all");
    setFilterTag("all");
    setSubject("");
    setBody("");
    setActiveTab("edit");
    onOpenChange(false);
  };

  const replaceVariables = (text: string) => {
    if (selectedEmployees.length === 0) return text;

    const firstEmployee = selectedEmployees[0];

    // Format dates
    const formatDate = (date: Date | string) => {
      const d = typeof date === "string" ? new Date(date) : date;
      return d.toLocaleDateString("fr-FR");
    };

    return text
      .replace(/\{\{prenom\}\}/g, firstEmployee.firstName || "{{prenom}}")
      .replace(/\{\{nom\}\}/g, firstEmployee.lastName || "{{nom}}")
      .replace(/\{\{email\}\}/g, firstEmployee.email || "{{email}}")
      .replace(/\{\{telephone\}\}/g, firstEmployee.phone || "{{telephone}}")
      .replace(/\{\{poste\}\}/g, firstEmployee.position || "{{poste}}")
      .replace(
        /\{\{departement\}\}/g,
        firstEmployee.department || "{{departement}}",
      )
      .replace(
        /\{\{numero_employe\}\}/g,
        firstEmployee.employeeNumber || "{{numero_employe}}",
      )
      .replace(
        /\{\{date_embauche\}\}/g,
        formatDate(firstEmployee.hireDate) || "{{date_embauche}}",
      )
      .replace(
        /\{\{adresse\}\}/g,
        firstEmployee.address?.street || "{{adresse}}",
      )
      .replace(/\{\{ville\}\}/g, firstEmployee.address?.city || "{{ville}}")
      .replace(
        /\{\{code_postal\}\}/g,
        firstEmployee.address?.postalCode || "{{code_postal}}",
      )
      .replace(/\{\{pays\}\}/g, firstEmployee.address?.country || "{{pays}}");
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      rh: "RH Général",
      recrutement: "Recrutement",
      formation: "Formation",
      discipline: "Discipline",
      conges: "Congés",
      paie: "Paie",
      medical: "Médical",
      autre: "Autre",
    };
    return labels[category] || category;
  };

  return (
    <Modal
      open={open}
      onOpenChange={handleClose}
      type="form"
      title={
        mode === "select"
          ? "Envoyer un email"
          : selectedTemplate
            ? `Modifier : ${selectedTemplate.name}`
            : "Composer un email"
      }
      description={
        mode === "select"
          ? `${selectedEmployees.length} employé(s) sélectionné(s)`
          : `Destinataires : ${selectedEmployees.map((e) => e.firstName + " " + e.lastName).join(", ")}`
      }
      size="lg"
      actions={
        mode === "compose"
          ? {
              tertiary: {
                label: "Retour",
                onClick: handleBack,
                variant: "ghost",
              },
              secondary: {
                label: "Annuler",
                onClick: handleClose,
                variant: "outline",
              },
              primary: {
                label: "Envoyer",
                onClick: handleSend,
                disabled: !subject || !body,
                icon: <Mail className="h-4 w-4" />,
              },
            }
          : {
              secondary: {
                label: "Annuler",
                onClick: handleClose,
                variant: "outline",
              },
              primary: {
                label: "Composer",
                onClick: handleStartFromScratch,
                icon: <Edit className="h-4 w-4" />,
              },
            }
      }
    >
      {mode === "select" ? (
        <div className="space-y-4">
          {/* Search and Filters */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryLabel(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterTag} onValueChange={setFilterTag}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les tags</SelectItem>
                  {allTags.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Templates List */}
          <div className="h-100 overflow-y-auto rounded-md border">
            <div className="space-y-2 p-4">
              {filteredTemplates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Aucun modèle trouvé
                  </p>
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="w-full rounded-lg border bg-card p-4 text-left transition-colors hover:bg-accent"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-medium">{template.name}</h4>
                        <Badge variant="outline" className="ml-2">
                          {getCategoryLabel(template.category)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {template.subject}
                      </p>
                      {template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Recipients */}
          <div className="rounded-lg border bg-muted/30 p-3">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Destinataires ({selectedEmployees.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedEmployees.map((emp) => (
                <Badge key={emp.id} variant="secondary">
                  {emp.firstName} {emp.lastName}
                </Badge>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("edit")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === "edit"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Edit className="h-4 w-4" />
              Éditer
            </button>
            <button
              onClick={() => setActiveTab("preview")}
              className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === "preview"
                  ? "border-primary text-primary font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4" />
              Aperçu
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "edit" ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Objet</Label>
                <Input
                  id="subject"
                  placeholder="Objet de l'email"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="body">Message</Label>
                <Textarea
                  id="body"
                  placeholder="Votre message..."
                  className="min-h-75 font-mono text-sm"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Variables disponibles : {`{{prenom}}`}, {`{{nom}}`},{" "}
                  {`{{email}}`}, {`{{telephone}}`}, {`{{poste}}`},{" "}
                  {`{{departement}}`}, {`{{numero_employe}}`},{" "}
                  {`{{date_embauche}}`}, {`{{adresse}}`}, {`{{ville}}`},{" "}
                  {`{{code_postal}}`}, {`{{pays}}`}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {subject || body ? (
                <div className="rounded-lg border bg-blue-50 dark:bg-blue-950 p-4">
                  <p className="text-xs font-medium text-blue-900 dark:text-blue-100 mb-3">
                    Aperçu avec le premier employé sélectionné
                  </p>
                  <div className="space-y-4 text-sm text-blue-900 dark:text-blue-100">
                    {subject && (
                      <div>
                        <span className="text-xs font-medium">Objet :</span>
                        <p className="mt-1 font-medium">
                          {replaceVariables(subject)}
                        </p>
                      </div>
                    )}
                    {subject && body && (
                      <div className="h-px bg-blue-200 dark:bg-blue-800" />
                    )}
                    {body && (
                      <div>
                        <span className="text-xs font-medium">Message :</span>
                        <p className="mt-2 whitespace-pre-wrap">
                          {replaceVariables(body)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-4 text-sm text-muted-foreground">
                    Rédigez votre message pour voir l&apos;aperçu
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
