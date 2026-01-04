"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InfoCard, InfoCardContainer } from "@/components/ui/info-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Modal } from "@/components/ui/modal";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import {
  Users,
  FileText,
  Download,
  AlertTriangle,
  FileCheck,
  Plus,
  Building2,
  Upload,
  Gift,
  Calendar,
  Euro,
} from "lucide-react";
import { Client, ClientContract, ClientGift } from "@/lib/types";
import { useState } from "react";

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

export default function ClientsPage() {
  const [clients] = useState<Client[]>([
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
      contracts: [],
      gifts: [],
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
      contracts: [],
      gifts: [],
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
      contracts: [],
      gifts: [],
    },
  ]);

  const [contracts] = useState<ClientContract[]>([
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
  ]);

  const [gifts] = useState<ClientGift[]>([
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
  ]);

  const [documents] = useState<Document[]>([
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
  ]);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dossier");
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [isNewContractModalOpen, setIsNewContractModalOpen] = useState(false);
  const [isNewGiftModalOpen, setIsNewGiftModalOpen] = useState(false);

  const [newClient, setNewClient] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    contactPerson: "",
    phone: "",
    email: "",
    siret: "",
    sector: "",
  });
  const [newContract, setNewContract] = useState<Omit<ClientContract, "id">>({
    clientId: "",
    startDate: new Date(),
    description: "",
    status: "active",
  });
  const [newGift, setNewGift] = useState<Omit<ClientGift, "id">>({
    clientId: "",
    giftDescription: "",
    date: new Date(),
    notes: "",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "expired":
        return "bg-red-100 text-red-800";
      case "terminated":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
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

  const handleRowClick = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
    setActiveTab("dossier");
  };

  const getClientDocuments = (clientId: string) => {
    return documents.filter((doc) => doc.clientId === clientId);
  };

  const getClientContracts = (clientId: string) => {
    return contracts.filter((contract) => contract.clientId === clientId);
  };

  const getClientGifts = (clientId: string) => {
    return gifts.filter((gift) => gift.clientId === clientId);
  };

  const handleNewClient = () => {
    console.log("Nouveau client:", newClient);
    setIsNewClientModalOpen(false);
    setNewClient({
      name: "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
      contactPerson: "",
      phone: "",
      email: "",
      siret: "",
      sector: "",
    });
  };

  const handleNewContract = () => {
    const contractData = {
      ...newContract,
      clientId: selectedClient?.id || "",
    };
    console.log("Nouveau contrat:", contractData);
    setIsNewContractModalOpen(false);
    setNewContract({
      clientId: "",
      startDate: new Date(),
      description: "",
      status: "active",
    });
  };

  const handleNewGift = () => {
    const giftData = {
      ...newGift,
      clientId: selectedClient?.id || "",
    };
    console.log("Nouveau cadeau:", giftData);
    setIsNewGiftModalOpen(false);
    setNewGift({
      clientId: "",
      giftDescription: "",
      date: new Date(),
      notes: "",
    });
  };

  const clientColumns: ColumnDef<Client>[] = [
    {
      key: "name",
      label: "Nom du client",
      icon: Building2,
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "contactPerson",
      label: "Contact",
      icon: Users,
      defaultVisible: true,
      sortable: true,
      render: (client) => client.contactPerson || "-",
    },
    {
      key: "phone",
      label: "Téléphone",
      icon: FileText,
      defaultVisible: true,
      sortable: false,
      render: (client) => client.phone || "-",
    },
    {
      key: "email",
      label: "Email",
      icon: FileText,
      defaultVisible: true,
      sortable: false,
      render: (client) => client.email || "-",
    },
    {
      key: "sector",
      label: "Secteur",
      icon: FileText,
      defaultVisible: true,
      sortable: true,
      render: (client) => client.sector || "-",
    },
    {
      key: "city",
      label: "Ville",
      icon: FileText,
      defaultVisible: false,
      sortable: true,
      render: (client) => client.city || "-",
    },
  ];

  const contractColumns: ColumnDef<ClientContract>[] = [
    {
      key: "description",
      label: "Description",
      icon: FileText,
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "startDate",
      label: "Date début",
      icon: Calendar,
      defaultVisible: true,
      sortable: true,
      render: (contract) =>
        new Date(contract.startDate).toLocaleDateString("fr-FR"),
    },
    {
      key: "endDate",
      label: "Date fin",
      icon: Calendar,
      defaultVisible: true,
      sortable: true,
      render: (contract) =>
        contract.endDate
          ? new Date(contract.endDate).toLocaleDateString("fr-FR")
          : "Indéterminée",
    },
    {
      key: "status",
      label: "Statut",
      defaultVisible: true,
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
      label: "Description du cadeau",
      icon: Gift,
      defaultVisible: true,
      sortable: true,
    },
    {
      key: "date",
      label: "Date",
      icon: Calendar,
      defaultVisible: true,
      sortable: true,
      render: (gift) => new Date(gift.date).toLocaleDateString("fr-FR"),
    },
    {
      key: "value",
      label: "Valeur",
      icon: Euro,
      defaultVisible: true,
      sortable: true,
      render: (gift) => (gift.value ? `${gift.value} €` : "-"),
    },
    {
      key: "notes",
      label: "Notes",
      defaultVisible: true,
      render: (gift) => gift.notes || "-",
    },
  ];

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Clients</h1>
          <p className="text-muted-foreground">
            Gestion des dossiers clients, contrats et suivis cadeaux
            sous-traitants
          </p>
        </div>
        <Button onClick={() => setIsNewClientModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nouveau client
        </Button>
      </div>

      {/* Statistiques */}
      <InfoCardContainer>
        <InfoCard
          icon={Users}
          title="Total clients"
          value={clients.length}
          color="gray"
        />
        <InfoCard
          icon={FileCheck}
          title="Contrats actifs"
          value={contracts.filter((c) => c.status === "active").length}
          color="green"
        />
        <InfoCard
          icon={AlertTriangle}
          title="Documents expirés"
          value={documents.filter((d) => d.status === "expired").length}
          color="red"
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
      </InfoCardContainer>

      {/* Liste des clients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Liste des clients
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={clients}
            columns={clientColumns}
            searchKey="name"
            searchPlaceholder="Rechercher un client..."
            onRowClick={handleRowClick}
          />
        </CardContent>
      </Card>

      {/* Modal nouveau client */}
      <Modal
        open={isNewClientModalOpen}
        onOpenChange={setIsNewClientModalOpen}
        type="form"
        title="Nouveau client"
        actions={{
          primary: {
            label: "Ajouter",
            onClick: handleNewClient,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewClientModalOpen(false),
            variant: "outline" as const,
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Nom du client</Label>
            <Input
              id="name"
              value={newClient.name}
              onChange={(e) =>
                setNewClient({ ...newClient, name: e.target.value })
              }
              placeholder="Nom de l'entreprise"
            />
          </div>
          <div>
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              value={newClient.address}
              onChange={(e) =>
                setNewClient({ ...newClient, address: e.target.value })
              }
              placeholder="Adresse de l'entreprise"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">Ville</Label>
              <Input
                id="city"
                value={newClient.city}
                onChange={(e) =>
                  setNewClient({ ...newClient, city: e.target.value })
                }
                placeholder="Ville"
              />
            </div>
            <div>
              <Label htmlFor="postalCode">Code postal</Label>
              <Input
                id="postalCode"
                value={newClient.postalCode}
                onChange={(e) =>
                  setNewClient({ ...newClient, postalCode: e.target.value })
                }
                placeholder="Code postal"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="country">Pays</Label>
            <Input
              id="country"
              value={newClient.country}
              onChange={(e) =>
                setNewClient({ ...newClient, country: e.target.value })
              }
              placeholder="Pays"
            />
          </div>
          <div>
            <Label htmlFor="contactPerson">Personne de contact</Label>
            <Input
              id="contactPerson"
              value={newClient.contactPerson}
              onChange={(e) =>
                setNewClient({ ...newClient, contactPerson: e.target.value })
              }
              placeholder="Nom de la personne de contact"
            />
          </div>
          <div>
            <Label htmlFor="phone">Téléphone</Label>
            <Input
              id="phone"
              value={newClient.phone}
              onChange={(e) =>
                setNewClient({ ...newClient, phone: e.target.value })
              }
              placeholder="Numéro de téléphone"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={newClient.email}
              onChange={(e) =>
                setNewClient({ ...newClient, email: e.target.value })
              }
              placeholder="Adresse email"
            />
          </div>
          <div>
            <Label htmlFor="siret">SIRET</Label>
            <Input
              id="siret"
              value={newClient.siret}
              onChange={(e) =>
                setNewClient({ ...newClient, siret: e.target.value })
              }
              placeholder="Numéro SIRET"
            />
          </div>
          <div>
            <Label htmlFor="sector">Secteur</Label>
            <Input
              id="sector"
              value={newClient.sector}
              onChange={(e) =>
                setNewClient({ ...newClient, sector: e.target.value })
              }
              placeholder="Secteur d'activité"
            />
          </div>
        </div>
      </Modal>

      {/* Modal détails client */}
      <Modal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        type="details"
        title={selectedClient?.name || "Détails client"}
        size="xl"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dossier">Dossier</TabsTrigger>
            <TabsTrigger value="contrats">Contrats</TabsTrigger>
            <TabsTrigger value="cadeaux">Cadeaux</TabsTrigger>
          </TabsList>

          <TabsContent value="dossier" className="space-y-4">
            <div className="space-y-4">
              {/* Informations client */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Informations client
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Adresse
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.address || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Ville
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.city || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Code postal
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.postalCode || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Pays
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.country || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Personne de contact
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.contactPerson || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Téléphone
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.phone || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Email
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.email || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        SIRET
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.siret || "Non spécifié"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Secteur
                      </Label>
                      <p className="text-sm">
                        {selectedClient?.sector || "Non spécifié"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Documents</h3>
                <Button size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Ajouter un document
                </Button>
              </div>

              <div className="space-y-2">
                {selectedClient && (
                  <>
                    {/* Documents requis */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Documents requis
                      </h4>
                      {requiredDocuments.map((docType) => {
                        const existingDoc = getClientDocuments(
                          selectedClient.id,
                        ).find((d) => d.type === docType.type);

                        return (
                          <div
                            key={docType.type}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4" />
                              <div>
                                <p className="font-medium">{docType.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {docType.category}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {existingDoc ? (
                                <>
                                  <Badge
                                    className={
                                      existingDoc.status === "valid"
                                        ? "bg-green-100 text-green-800"
                                        : existingDoc.status === "expiring"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-red-100 text-red-800"
                                    }
                                  >
                                    {existingDoc.status === "valid"
                                      ? "Valide"
                                      : existingDoc.status === "expiring"
                                        ? "À renouveler"
                                        : "Expiré"}
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <Badge variant="destructive">Manquant</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Documents optionnels */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm text-muted-foreground">
                        Documents optionnels
                      </h4>
                      {optionalDocuments.map((docType) => {
                        const existingDoc = getClientDocuments(
                          selectedClient.id,
                        ).find((d) => d.type === docType.type);

                        return (
                          <div
                            key={docType.type}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="w-4 h-4" />
                              <div>
                                <p className="font-medium">{docType.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {docType.category}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {existingDoc ? (
                                <>
                                  <Badge className="bg-green-100 text-green-800">
                                    Disponible
                                  </Badge>
                                  <Button variant="ghost" size="sm">
                                    <Download className="w-4 h-4" />
                                  </Button>
                                </>
                              ) : (
                                <Badge variant="secondary">Non fourni</Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="contrats" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Contrats</h3>
                <Button
                  size="sm"
                  onClick={() => setIsNewContractModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau contrat
                </Button>
              </div>

              {selectedClient && (
                <DataTable
                  data={getClientContracts(selectedClient.id)}
                  columns={contractColumns}
                  searchKey="description"
                  searchPlaceholder="Rechercher un contrat..."
                />
              )}
            </div>
          </TabsContent>

          <TabsContent value="cadeaux" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Suivi des cadeaux</h3>
                <Button size="sm" onClick={() => setIsNewGiftModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nouveau cadeau
                </Button>
              </div>

              {selectedClient && (
                <DataTable
                  data={getClientGifts(selectedClient.id)}
                  columns={giftColumns}
                  searchKey="giftDescription"
                  searchPlaceholder="Rechercher un cadeau..."
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Modal>

      {/* Modal nouveau contrat */}
      <Modal
        open={isNewContractModalOpen}
        onOpenChange={setIsNewContractModalOpen}
        type="form"
        title="Nouveau contrat"
        actions={{
          primary: {
            label: "Ajouter",
            onClick: handleNewContract,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewContractModalOpen(false),
            variant: "outline" as const,
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newContract.description}
              onChange={(e) =>
                setNewContract({ ...newContract, description: e.target.value })
              }
              placeholder="Description du contrat"
            />
          </div>
          <div>
            <Label htmlFor="startDate">Date de début</Label>
            <Input
              id="startDate"
              type="date"
              value={newContract.startDate.toISOString().split("T")[0]}
              onChange={(e) =>
                setNewContract({
                  ...newContract,
                  startDate: new Date(e.target.value),
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="endDate">Date de fin (optionnelle)</Label>
            <Input
              id="endDate"
              type="date"
              value={newContract.endDate?.toISOString().split("T")[0] || ""}
              onChange={(e) =>
                setNewContract({
                  ...newContract,
                  endDate: e.target.value
                    ? new Date(e.target.value)
                    : undefined,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="status">Statut</Label>
            <Select
              value={newContract.status}
              onValueChange={(value: "active" | "expired" | "terminated") =>
                setNewContract({ ...newContract, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="expired">Expiré</SelectItem>
                <SelectItem value="terminated">Résilié</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Modal>

      {/* Modal nouveau cadeau */}
      <Modal
        open={isNewGiftModalOpen}
        onOpenChange={setIsNewGiftModalOpen}
        type="form"
        title="Nouveau cadeau"
        actions={{
          primary: {
            label: "Ajouter",
            onClick: handleNewGift,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsNewGiftModalOpen(false),
            variant: "outline" as const,
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="giftDescription">Description du cadeau</Label>
            <Input
              id="giftDescription"
              value={newGift.giftDescription}
              onChange={(e) =>
                setNewGift({ ...newGift, giftDescription: e.target.value })
              }
              placeholder="Description du cadeau offert"
            />
          </div>
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newGift.date.toISOString().split("T")[0]}
              onChange={(e) =>
                setNewGift({ ...newGift, date: new Date(e.target.value) })
              }
            />
          </div>
          <div>
            <Label htmlFor="value">Valeur (€)</Label>
            <Input
              id="value"
              type="number"
              value={newGift.value || ""}
              onChange={(e) =>
                setNewGift({
                  ...newGift,
                  value: e.target.value
                    ? parseFloat(e.target.value)
                    : undefined,
                })
              }
              placeholder="Valeur en euros"
            />
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={newGift.notes || ""}
              onChange={(e) =>
                setNewGift({ ...newGift, notes: e.target.value })
              }
              placeholder="Notes sur le cadeau..."
              rows={3}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
