"use client";

import { useState, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import {
  Building2,
  FileText,
  Download,
  AlertTriangle,
  FileCheck,
  Edit3,
  Save,
  X,
  Upload,
  ArrowLeft,
  Trash2,
  Calendar,
  Gift,
  User,
} from "lucide-react";

interface DirigeantInfo {
  nom: string;
  prenom: string;
  dateNaissance: string;
  lieuNaissance: string;
  nationalite: string;
  adresse: string;
  email: string;
  telephone: string;
  fonction: string;
  dateNomination: string;
  numeroSecuriteSociale: string;
}

interface Client {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  siret?: string;
  sector?: string;
  dirigeant?: DirigeantInfo;
}

interface ClientContract {
  id: string;
  clientId: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  status: "active" | "expired" | "terminated";
}

interface ClientGift {
  id: string;
  clientId: string;
  giftDescription: string;
  date: Date;
  value?: number;
  notes?: string;
}

interface Document {
  id: string;
  clientId: string;
  name: string;
  type: string;
  uploadDate: string;
  expiryDate?: string;
  status: "valid" | "expiring" | "expired";
  required: boolean;
}

const requiredDocuments = [
  { type: "contrat_cadre", name: "Contrat cadre", category: "contrat" },
  {
    type: "conditions_generales",
    name: "Conditions générales",
    category: "contrat",
  },
  { type: "kbis_client", name: "Kbis du client", category: "juridique" },
  {
    type: "attestation_assurance",
    name: "Attestation d'assurance",
    category: "assurance",
  },
  {
    type: "autorisation_cnaps",
    name: "Autorisation CNAPS",
    category: "reglementaire",
  },
];

const optionalDocuments = [
  { type: "avenant", name: "Avenant au contrat", category: "contrat" },
  { type: "cahier_charges", name: "Cahier des charges", category: "technique" },
  {
    type: "plan_intervention",
    name: "Plan d'intervention",
    category: "technique",
  },
];

const mockClients: Client[] = [
  {
    id: "1",
    name: "Société ABC Industries",
    address: "123 Rue de l'Industrie",
    city: "Paris",
    postalCode: "75001",
    country: "France",
    contactPerson: "Jean Dupont",
    phone: "01 23 45 67 89",
    email: "contact@abcindustries.fr",
    siret: "12345678901234",
    sector: "Industrie",
    dirigeant: {
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "1975-05-15",
      lieuNaissance: "Paris, France",
      nationalite: "Française",
      adresse: "15 Avenue Victor Hugo, 75016 Paris",
      email: "jean.dupont@abcindustries.fr",
      telephone: "06 12 34 56 78",
      fonction: "PDG",
      dateNomination: "2010-03-01",
      numeroSecuriteSociale: "1 75 05 75 123 456 78",
    },
  },
  {
    id: "2",
    name: "Entreprise XYZ Services",
    address: "456 Avenue des Services",
    city: "Lyon",
    postalCode: "69000",
    country: "France",
    contactPerson: "Marie Martin",
    phone: "04 56 78 90 12",
    email: "contact@xyzservices.fr",
    siret: "56789012345678",
    sector: "Services",
    dirigeant: {
      nom: "Martin",
      prenom: "Marie",
      dateNaissance: "1980-08-22",
      lieuNaissance: "Lyon, France",
      nationalite: "Française",
      adresse: "78 Cours Gambetta, 69003 Lyon",
      email: "marie.martin@xyzservices.fr",
      telephone: "06 98 76 54 32",
      fonction: "Directrice Générale",
      dateNomination: "2015-06-15",
      numeroSecuriteSociale: "2 80 08 69 234 567 89",
    },
  },
  {
    id: "3",
    name: "Groupe DEF Solutions",
    address: "789 Boulevard des Solutions",
    city: "Marseille",
    postalCode: "13000",
    country: "France",
    contactPerson: "Pierre Durand",
    phone: "04 91 23 45 67",
    email: "contact@defsolutions.fr",
    siret: "90123456789012",
    sector: "Technologie",
    dirigeant: {
      nom: "Durand",
      prenom: "Pierre",
      dateNaissance: "1972-11-30",
      lieuNaissance: "Marseille, France",
      nationalite: "Française",
      adresse: "23 Rue Paradis, 13001 Marseille",
      email: "pierre.durand@defsolutions.fr",
      telephone: "06 45 67 89 01",
      fonction: "Président",
      dateNomination: "2012-09-01",
      numeroSecuriteSociale: "1 72 11 13 345 678 90",
    },
  },
];

const mockContracts: ClientContract[] = [
  {
    id: "1",
    clientId: "1",
    startDate: new Date("2024-01-15"),
    endDate: new Date("2025-01-15"),
    description: "Contrat de surveillance générale",
    status: "active",
  },
  {
    id: "2",
    clientId: "1",
    startDate: new Date("2023-06-01"),
    endDate: new Date("2024-05-31"),
    description: "Contrat événementiel",
    status: "expired",
  },
  {
    id: "3",
    clientId: "2",
    startDate: new Date("2024-03-01"),
    description: "Contrat de gardiennage permanent",
    status: "active",
  },
];

const mockGifts: ClientGift[] = [
  {
    id: "1",
    clientId: "1",
    giftDescription: "Panier de Noël",
    date: new Date("2023-12-20"),
    value: 150,
    notes: "Remis au directeur général",
  },
  {
    id: "2",
    clientId: "2",
    giftDescription: "Bouteille de champagne",
    date: new Date("2024-01-15"),
    value: 80,
    notes: "Nouvel an - équipe dirigeante",
  },
];

const mockDocuments: Document[] = [
  {
    id: "1",
    clientId: "1",
    name: "Contrat cadre ABC Industries",
    type: "contrat_cadre",
    uploadDate: "2024-01-10",
    expiryDate: "2025-01-10",
    status: "valid",
    required: true,
  },
  {
    id: "2",
    clientId: "1",
    name: "Kbis ABC Industries",
    type: "kbis_client",
    uploadDate: "2024-10-15",
    expiryDate: "2025-04-15",
    status: "expiring",
    required: true,
  },
  {
    id: "3",
    clientId: "2",
    name: "Autorisation CNAPS - XYZ",
    type: "autorisation_cnaps",
    uploadDate: "2024-08-20",
    expiryDate: "2025-02-20",
    status: "expiring",
    required: true,
  },
];

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();

  const [client, setClient] = useState<Client | null>(
    mockClients.find((c) => c.id === id) || null,
  );
  const [contracts] = useState<ClientContract[]>(
    mockContracts.filter((c) => c.clientId === id),
  );
  const [gifts] = useState<ClientGift[]>(
    mockGifts.filter((g) => g.clientId === id),
  );
  const [documents] = useState<Document[]>(
    mockDocuments.filter((doc) => doc.clientId === id),
  );
  const [isEditing, setIsEditing] = useState(
    searchParams.get("edit") === "true",
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  if (!client) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Client non trouvé
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.back()}>Retour</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-success text-success-foreground";
      case "expired":
        return "bg-neutral text-neutral-foreground";
      case "terminated":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-neutral text-neutral-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Actif";
      case "expired":
        return "Expiré";
      case "terminated":
        return "Résilié";
      default:
        return status;
    }
  };

  const handleSave = () => {
    console.log("Saving:", client);
    setIsEditing(false);
  };

  const handleCancel = () => {
    const original = mockClients.find((c) => c.id === id);
    if (original) {
      setClient(original);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    console.log("Deleting:", id);
    router.push("/dashboard/hr/entreprise/clients");
  };

  const handleBulkDownload = () => {
    console.log("Downloading documents:", selectedDocuments);
  };

  const contractColumns: ColumnDef<ClientContract>[] = [
    {
      key: "description",
      label: "Description",
      sortable: true,
      render: (contract) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{contract.description}</span>
        </div>
      ),
    },
    {
      key: "startDate",
      label: "Date début",
      sortable: true,
      render: (contract) =>
        new Date(contract.startDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "endDate",
      label: "Date fin",
      sortable: true,
      render: (contract) =>
        contract.endDate
          ? new Date(contract.endDate).toLocaleDateString("fr-FR")
          : "Indéterminée",
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (contract) => (
        <Badge className={getStatusColor(contract.status)}>
          {getStatusText(contract.status)}
        </Badge>
      ),
    },
  ];

  const giftColumns: ColumnDef<ClientGift>[] = [
    {
      key: "giftDescription",
      label: "Description",
      sortable: true,
      render: (gift) => (
        <div className="flex items-center gap-2">
          <Gift className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{gift.giftDescription}</span>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      sortable: true,
      render: (gift) => new Date(gift.date).toLocaleDateString("fr-FR"),
    },
    {
      key: "value",
      label: "Valeur",
      sortable: true,
      render: (gift) => (gift.value ? `${gift.value} €` : "-"),
    },
    {
      key: "notes",
      label: "Notes",
      sortable: false,
      render: (gift) => gift.notes || "-",
    },
  ];

  const documentColumns: ColumnDef<Document>[] = [
    {
      key: "name",
      label: "Document",
      sortable: true,
      render: (doc) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{doc.name}</span>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      sortable: true,
      render: (doc) => {
        const docType = [...requiredDocuments, ...optionalDocuments].find(
          (d) => d.type === doc.type,
        );
        return docType?.name || doc.type;
      },
    },
    {
      key: "uploadDate",
      label: "Date d'upload",
      sortable: true,
      render: (doc) => new Date(doc.uploadDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "expiryDate",
      label: "Date d'expiration",
      sortable: true,
      render: (doc) =>
        doc.expiryDate
          ? new Date(doc.expiryDate).toLocaleDateString("fr-FR")
          : "N/A",
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (doc) => {
        const isExpired =
          doc.expiryDate && new Date(doc.expiryDate) < new Date();
        const isExpiring =
          doc.expiryDate &&
          new Date(doc.expiryDate) <=
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        return (
          <Badge
            variant={
              isExpired ? "destructive" : isExpiring ? "secondary" : "default"
            }
          >
            {isExpired ? "Expiré" : isExpiring ? "Expire bientôt" : "Valide"}
          </Badge>
        );
      },
    },
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.name}</h1>
            <p className="text-muted-foreground flex items-center gap-2 mt-1">
              <Building2 className="h-4 w-4" />
              {client.sector || "Secteur non spécifié"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Enregistrer
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Modifier
              </Button>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Supprimer
              </Button>
            </>
          )}
        </div>
      </div>

      <InfoCardContainer>
        <InfoCard
          icon={FileCheck}
          title="Contrats actifs"
          value={contracts.filter((c) => c.status === "active").length}
          color="green"
        />
        <InfoCard
          icon={Gift}
          title="Cadeaux cette année"
          value={
            gifts.filter(
              (g) =>
                new Date(g.date).getFullYear() === new Date().getFullYear(),
            ).length
          }
          color="purple"
        />
        <InfoCard
          icon={FileText}
          title="Documents"
          value={documents.length}
          color="blue"
        />
        <InfoCard
          icon={AlertTriangle}
          title="Docs expirant"
          value={documents.filter((d) => d.status === "expiring").length}
          color="yellow"
        />
      </InfoCardContainer>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Informations</TabsTrigger>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
          <TabsTrigger value="cadeaux">Cadeaux</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Informations entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom du client</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={client.name}
                      onChange={(e) =>
                        setClient({ ...client, name: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.name}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="siret">SIRET</Label>
                  {isEditing ? (
                    <Input
                      id="siret"
                      value={client.siret || ""}
                      onChange={(e) =>
                        setClient({ ...client, siret: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.siret || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="address">Adresse</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={client.address || ""}
                      onChange={(e) =>
                        setClient({ ...client, address: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.address || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">Ville</Label>
                  {isEditing ? (
                    <Input
                      id="city"
                      value={client.city || ""}
                      onChange={(e) =>
                        setClient({ ...client, city: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.city || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">Code postal</Label>
                  {isEditing ? (
                    <Input
                      id="postalCode"
                      value={client.postalCode || ""}
                      onChange={(e) =>
                        setClient({ ...client, postalCode: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.postalCode || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="country">Pays</Label>
                  {isEditing ? (
                    <Input
                      id="country"
                      value={client.country || ""}
                      onChange={(e) =>
                        setClient({ ...client, country: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.country || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="sector">Secteur</Label>
                  {isEditing ? (
                    <Input
                      id="sector"
                      value={client.sector || ""}
                      onChange={(e) =>
                        setClient({ ...client, sector: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.sector || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="contactPerson">Personne de contact</Label>
                  {isEditing ? (
                    <Input
                      id="contactPerson"
                      value={client.contactPerson || ""}
                      onChange={(e) =>
                        setClient({ ...client, contactPerson: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">
                      {client.contactPerson || "-"}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={client.email || ""}
                      onChange={(e) =>
                        setClient({ ...client, email: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.email || "-"}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={client.phone || ""}
                      onChange={(e) =>
                        setClient({ ...client, phone: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm mt-1">{client.phone || "-"}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {client.dirigeant && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informations du dirigeant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dirigeant-nom">Nom</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-nom"
                        value={client.dirigeant.nom}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              nom: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">{client.dirigeant.nom}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-prenom">Prénom</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-prenom"
                        value={client.dirigeant.prenom}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              prenom: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">{client.dirigeant.prenom}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-fonction">Fonction</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-fonction"
                        value={client.dirigeant.fonction}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              fonction: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {client.dirigeant.fonction}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-dateNomination">
                      Date de nomination
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-dateNomination"
                        type="date"
                        value={client.dirigeant.dateNomination}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              dateNomination: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {new Date(
                          client.dirigeant.dateNomination,
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-dateNaissance">
                      Date de naissance
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-dateNaissance"
                        type="date"
                        value={client.dirigeant.dateNaissance}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              dateNaissance: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {new Date(
                          client.dirigeant.dateNaissance,
                        ).toLocaleDateString("fr-FR")}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-lieuNaissance">
                      Lieu de naissance
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-lieuNaissance"
                        value={client.dirigeant.lieuNaissance}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              lieuNaissance: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {client.dirigeant.lieuNaissance}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-nationalite">Nationalité</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-nationalite"
                        value={client.dirigeant.nationalite}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              nationalite: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {client.dirigeant.nationalite}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-numeroSecuriteSociale">
                      Numéro de sécurité sociale
                    </Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-numeroSecuriteSociale"
                        value={client.dirigeant.numeroSecuriteSociale}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              numeroSecuriteSociale: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {client.dirigeant.numeroSecuriteSociale}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-adresse">Adresse</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-adresse"
                        value={client.dirigeant.adresse}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              adresse: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">{client.dirigeant.adresse}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-email">Email</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-email"
                        type="email"
                        value={client.dirigeant.email}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              email: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">{client.dirigeant.email}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="dirigeant-telephone">Téléphone</Label>
                    {isEditing ? (
                      <Input
                        id="dirigeant-telephone"
                        value={client.dirigeant.telephone}
                        onChange={(e) =>
                          setClient({
                            ...client,
                            dirigeant: {
                              ...client.dirigeant!,
                              telephone: e.target.value,
                            },
                          })
                        }
                      />
                    ) : (
                      <p className="text-sm mt-1">
                        {client.dirigeant.telephone}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="contrats" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Contrats
                </CardTitle>
                <Button size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Nouveau contrat
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={contracts}
                columns={contractColumns}
                searchKey="description"
                searchPlaceholder="Rechercher un contrat..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cadeaux" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Suivi des cadeaux
                </CardTitle>
                <Button size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Nouveau cadeau
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={gifts}
                columns={giftColumns}
                searchKey="giftDescription"
                searchPlaceholder="Rechercher un cadeau..."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documents
                </CardTitle>
                <div className="flex gap-2">
                  {selectedDocuments.length > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBulkDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger ({selectedDocuments.length})
                    </Button>
                  )}
                  <Button size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Ajouter un document
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DataTable
                data={documents}
                columns={documentColumns}
                searchKey="name"
                searchPlaceholder="Rechercher un document..."
                selectable
                onSelectionChange={(selectedDocs) =>
                  setSelectedDocuments(selectedDocs.map((d) => d.id))
                }
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Documents requis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {requiredDocuments.map((docType) => {
                    const existingDoc = documents.find(
                      (d) => d.type === docType.type,
                    );
                    return (
                      <div
                        key={docType.type}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {docType.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {docType.category}
                            </p>
                          </div>
                        </div>
                        {existingDoc ? (
                          <Badge variant="default">Présent</Badge>
                        ) : (
                          <Badge variant="destructive">Manquant</Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Documents optionnels
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {optionalDocuments.map((docType) => {
                    const existingDoc = documents.find(
                      (d) => d.type === docType.type,
                    );
                    return (
                      <div
                        key={docType.type}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              {docType.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {docType.category}
                            </p>
                          </div>
                        </div>
                        {existingDoc ? (
                          <Badge variant="default">Présent</Badge>
                        ) : (
                          <Badge variant="secondary">Non fourni</Badge>
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

      <Modal
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        type="confirmation"
        title="Supprimer le client"
        actions={{
          primary: {
            label: "Supprimer",
            onClick: handleDelete,
            variant: "destructive" as const,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsDeleteModalOpen(false),
            variant: "outline" as const,
          },
        }}
      >
        <p>
          Êtes-vous sûr de vouloir supprimer le client{" "}
          <span className="font-semibold">{client.name}</span> ? Cette action
          est irréversible et supprimera également tous les contrats, cadeaux et
          documents associés.
        </p>
      </Modal>
    </div>
  );
}
