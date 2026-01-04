"use client";

import { useState } from "react";
import {
  Link2,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Building2,
  Mail,
  Share2,
  Briefcase,
  FileText,
  Users,
  ShoppingCart,
  Plane,
  Hotel,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLiensUtiles, UsefulLink } from "@/contexts/LiensUtilesContext";

const iconComponents: Record<string, React.ElementType> = {
  Link2,
  Mail,
  Share2,
  ShoppingCart,
  Plane,
  Hotel,
  Building2,
  Briefcase,
  FileText,
  Users,
};

function renderIcon(iconName: string, className: string) {
  const Icon = iconComponents[iconName] || Link2;
  return <Icon className={className} />;
}

interface LinkCardProps {
  link: UsefulLink;
  onEdit?: (link: UsefulLink) => void;
  onDelete?: (id: string) => void;
}

function LinkCard({ link, onEdit, onDelete }: LinkCardProps) {
  return (
    <Card className="glass-card border-border/40 hover:border-primary/30 transition-all group">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              {renderIcon(link.icon, "h-5 w-5 text-primary")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-medium truncate">{link.name}</h3>
                {link.isCustom && (
                  <Badge variant="secondary" className="text-xs">
                    Personnalisé
                  </Badge>
                )}
              </div>
              {link.description && (
                <p className="text-xs text-muted-foreground mb-2">
                  {link.description}
                </p>
              )}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1"
              >
                Visiter
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
          {link.isCustom && onEdit && onDelete && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onEdit(link)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(link.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface CategorySectionProps {
  title: string;
  icon: React.ElementType;
  links: UsefulLink[];
  onEdit?: (link: UsefulLink) => void;
  onDelete?: (id: string) => void;
}

function CategorySection({
  title,
  icon: Icon,
  links,
  onEdit,
  onDelete,
}: CategorySectionProps) {
  if (links.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-light">{title}</h2>
        <Badge variant="outline" className="ml-2">
          {links.length}
        </Badge>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {links.map((link) => (
          <LinkCard
            key={link.id}
            link={link}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

export function LiensUtilesModal() {
  const { isOpen, closeLiensUtiles, links, addLink, updateLink, deleteLink } =
    useLiensUtiles();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingLink, setEditingLink] = useState<UsefulLink | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    description: "",
    icon: "Link2",
    category: "custom" as const,
  });

  const governmentLinks = links.filter(
    (link) => link.category === "government",
  );
  const businessLinks = links.filter((link) => link.category === "business");
  const customLinks = links.filter((link) => link.category === "custom");

  const handleAddLink = () => {
    if (!formData.name || !formData.url) return;

    addLink({
      name: formData.name,
      url: formData.url.startsWith("http")
        ? formData.url
        : `https://${formData.url}`,
      description: formData.description,
      icon: formData.icon,
      category: "custom",
      isCustom: true,
    });

    resetForm();
    setShowAddForm(false);
  };

  const handleEditLink = () => {
    if (!editingLink || !formData.name || !formData.url) return;

    updateLink(editingLink.id, {
      name: formData.name,
      url: formData.url.startsWith("http")
        ? formData.url
        : `https://${formData.url}`,
      description: formData.description,
      icon: formData.icon,
    });

    resetForm();
    setEditingLink(null);
  };

  const openEditModal = (link: UsefulLink) => {
    setEditingLink(link);
    setFormData({
      name: link.name,
      url: link.url,
      description: link.description || "",
      icon: link.icon,
      category: "custom",
    });
    setShowAddForm(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      url: "",
      description: "",
      icon: "Link2",
      category: "custom",
    });
    setEditingLink(null);
  };

  const handleClose = () => {
    resetForm();
    setShowAddForm(false);
    closeLiensUtiles();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={handleClose}
      type="form"
      title="Liens Utiles"
      description="Accès rapide aux sites et services essentiels"
      size="xl"
      actions={{
        primary: {
          label: "Fermer",
          onClick: handleClose,
          variant: "outline",
        },
      }}
    >
      <div className="space-y-6">
        {/* Add/Edit Form Toggle */}
        <div className="flex justify-end">
          <Button
            onClick={() => {
              if (editingLink) {
                resetForm();
              } else {
                setShowAddForm(!showAddForm);
              }
            }}
            size="sm"
            variant={showAddForm || editingLink ? "secondary" : "default"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {editingLink
              ? "Annuler la modification"
              : showAddForm
                ? "Annuler"
                : "Ajouter un lien"}
          </Button>
        </div>

        {/* Inline Add/Edit Form */}
        {(showAddForm || editingLink) && (
          <Card className="glass-card border-primary/50">
            <CardContent className="p-4">
              <h3 className="text-sm font-medium mb-4">
                {editingLink ? "Modifier le lien" : "Nouveau lien"}
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="link-name" className="text-xs">
                      Nom du lien *
                    </Label>
                    <Input
                      id="link-name"
                      placeholder="Ex: Amazon.fr"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="h-9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="link-icon" className="text-xs">
                      Icône
                    </Label>
                    <select
                      id="link-icon"
                      className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                    >
                      <option value="Link2">Lien</option>
                      <option value="Mail">Email</option>
                      <option value="Share2">Réseaux sociaux</option>
                      <option value="ShoppingCart">E-commerce</option>
                      <option value="Plane">Voyage</option>
                      <option value="Hotel">Hôtel</option>
                      <option value="Building2">Entreprise</option>
                      <option value="Briefcase">Business</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="link-url" className="text-xs">
                    URL *
                  </Label>
                  <Input
                    id="link-url"
                    placeholder="Ex: https://amazon.fr"
                    value={formData.url}
                    onChange={(e) =>
                      setFormData({ ...formData, url: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div>
                  <Label htmlFor="link-desc" className="text-xs">
                    Description
                  </Label>
                  <Input
                    id="link-desc"
                    placeholder="Description courte du lien"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="h-9"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      resetForm();
                      setShowAddForm(false);
                    }}
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={editingLink ? handleEditLink : handleAddLink}
                    disabled={!formData.name || !formData.url}
                  >
                    {editingLink ? "Enregistrer" : "Ajouter"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Links Categories */}
        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
          <CategorySection
            title="Services Gouvernementaux"
            icon={Building2}
            links={governmentLinks}
          />

          <CategorySection
            title="Services Professionnels"
            icon={Briefcase}
            links={businessLinks}
          />

          <CategorySection
            title="Liens Personnalisés"
            icon={Link2}
            links={customLinks}
            onEdit={openEditModal}
            onDelete={deleteLink}
          />
        </div>
      </div>
    </Modal>
  );
}
