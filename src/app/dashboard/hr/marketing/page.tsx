"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, ColumnDef } from "@/components/ui/DataTable";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
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
import { Plus, Calendar, TrendingUp, Mail, Share2 } from "lucide-react";
import {
  mockSocialPosts,
  mockEmailAutoReplies,
  mockCRMCustomers,
  type SocialPost,
  type EmailAutoReply,
  type CRMCustomer,
} from "@/data/hr-marketing";

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState<"posts" | "emails" | "crm">("posts");
  const [posts, setPosts] = useState<SocialPost[]>(mockSocialPosts);
  const [autoReplies] = useState<EmailAutoReply[]>(mockEmailAutoReplies);
  const [crmCustomers] = useState<CRMCustomer[]>(mockCRMCustomers);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedItem, setSelectedItem] = useState<SocialPost | EmailAutoReply | CRMCustomer | null>(null);
  const [formData, setFormData] = useState({
    platform: "LinkedIn" as SocialPost["platform"],
    content: "",
    scheduledDate: "",
    scheduledTime: "",
  });

  const postColumns: ColumnDef<SocialPost>[] = [
    {
      key: "platform",
      label: "Plateforme",
      render: (post) => {
        const variants: Record<string, "default" | "secondary" | "outline"> = {
          LinkedIn: "default",
          Facebook: "secondary",
          Instagram: "outline",
        };
        return <Badge variant={variants[post.platform]}>{post.platform}</Badge>;
      },
    },
    {
      key: "content",
      label: "Contenu",
      render: (post) => (
        <span className="text-sm line-clamp-2">{post.content}</span>
      ),
    },
    {
      key: "scheduledDate",
      label: "Date de publication",
      render: (post) =>
        new Date(post.scheduledDate).toLocaleString("fr-FR"),
    },
    {
      key: "status",
      label: "Statut",
      render: (post) => {
        const variants: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
          "Planifié": "outline",
          "Publié": "default",
          "Échec": "destructive",
        };
        return <Badge variant={variants[post.status]}>{post.status}</Badge>;
      },
    },
    {
      key: "performance",
      label: "Performance",
      render: (post) =>
        post.performance ? (
          <span className="text-sm font-semibold text-green-600">
            {post.performance.engagement}% engagement
          </span>
        ) : (
          "-"
        ),
    },
  ];

  const handleCreatePost = () => {
    setFormData({
      platform: "LinkedIn",
      content: "",
      scheduledDate: "",
      scheduledTime: "",
    });
    setIsPostModalOpen(true);
  };

  const handleSavePost = () => {
    const now = new Date().toISOString();
    const newPost: SocialPost = {
      id: (posts.length + 1).toString(),
      platform: formData.platform,
      content: formData.content,
      scheduledDate: `${formData.scheduledDate}T${formData.scheduledTime}:00`,
      status: "Planifié",
      createdAt: now,
      updatedAt: now,
    };
    setPosts([...posts, newPost]);
    setIsPostModalOpen(false);
  };

  const handleRowClick = (item: SocialPost | EmailAutoReply | CRMCustomer) => {
    setSelectedItem(item);
    setIsViewModalOpen(true);
  };

  const totalEngagement = posts
    .filter((p) => p.performance)
    .reduce((sum, p) => sum + (p.performance?.engagement || 0), 0);
  const averageEngagement = posts.filter((p) => p.performance).length > 0
    ? totalEngagement / posts.filter((p) => p.performance).length
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing RH</h1>
        <p className="text-muted-foreground">
          Gestion des publications sociales, réponses automatiques emails, CRM clients
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <Button
          variant={activeTab === "posts" ? "default" : "ghost"}
          onClick={() => setActiveTab("posts")}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Publications Sociales
        </Button>
        <Button
          variant={activeTab === "emails" ? "default" : "ghost"}
          onClick={() => setActiveTab("emails")}
        >
          <Mail className="h-4 w-4 mr-2" />
          Réponses Automatiques
        </Button>
        <Button
          variant={activeTab === "crm" ? "default" : "ghost"}
          onClick={() => setActiveTab("crm")}
        >
          <TrendingUp className="h-4 w-4 mr-2" />
          CRM Clients
        </Button>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <>
          <div className="flex justify-between items-center">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publications planifiées</CardTitle>
                  <Calendar className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.status === "Planifié").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Publications publiées</CardTitle>
                  <Share2 className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {posts.filter((p) => p.status === "Publié").length}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Engagement moyen</CardTitle>
                  <TrendingUp className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{averageEngagement.toFixed(1)}%</div>
                </CardContent>
              </Card>
            </div>
            <Button onClick={handleCreatePost}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle publication
            </Button>
          </div>

          <DataTable
            data={posts}
            columns={postColumns}
            searchKey="content"
            searchPlaceholder="Rechercher une publication..."
            onRowClick={handleRowClick}
          />
        </>
      )}

      {/* Emails Tab */}
      {activeTab === "emails" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Réponses Automatiques</h2>
            <Button onClick={() => setIsEmailModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle règle
            </Button>
          </div>
          <div className="space-y-3">
            {autoReplies.map((reply) => (
              <Card key={reply.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{reply.trigger}</h3>
                      <p className="text-sm text-muted-foreground">{reply.subject}</p>
                    </div>
                    <Badge variant={reply.isActive ? "default" : "outline"}>
                      {reply.isActive ? "Actif" : "Inactif"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* CRM Tab */}
      {activeTab === "crm" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Gestion CRM Clients</h2>
            <Button onClick={() => setIsEmailModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un client
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {crmCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{customer.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">{customer.email}</p>
                  <Badge variant="secondary">{customer.status}</Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Dernier contact: {new Date(customer.lastContact).toLocaleDateString("fr-FR")}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      <Modal
        open={isPostModalOpen}
        onOpenChange={setIsPostModalOpen}
        type="form"
        title="Nouvelle publication"
        size="lg"
        actions={{
          primary: {
            label: "Planifier",
            onClick: handleSavePost,
          },
          secondary: {
            label: "Annuler",
            onClick: () => setIsPostModalOpen(false),
            variant: "outline",
          },
        }}
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="platform">Plateforme</Label>
            <Select
              value={formData.platform}
              onValueChange={(value) =>
                setFormData({ ...formData, platform: value as SocialPost["platform"] })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Facebook">Facebook</SelectItem>
                <SelectItem value="Instagram">Instagram</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="content">Contenu</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Votre message..."
              rows={6}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime">Heure</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}

