"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageSquare, Save } from "lucide-react";

interface NotificationSettings {
  pushEnabled: boolean;
  smsEnabled: boolean;
  emailEnabled: boolean;
  automaticAlerts: {
    expiredCertifications: boolean;
    upcomingTraining: boolean;
    absenceRequests: boolean;
    disciplinaryActions: boolean;
    contractExpiry: boolean;
  };
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    pushEnabled: true,
    smsEnabled: false,
    emailEnabled: true,
    automaticAlerts: {
      expiredCertifications: true,
      upcomingTraining: true,
      absenceRequests: true,
      disciplinaryActions: true,
      contractExpiry: true,
    },
  });

  const [testMessage, setTestMessage] = useState({
    title: "",
    body: "",
  });

  const handleSaveSettings = () => {
    alert("Paramètres de notification enregistrés avec succès!");
  };

  const handleSendTestNotification = () => {
    if (!testMessage.title || !testMessage.body) {
      alert("Veuillez remplir le titre et le message");
      return;
    }
    alert("Notification de test envoyée!");
    setTestMessage({ title: "", body: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notifications & SMS</h1>
        <p className="text-muted-foreground">
          Configuration des notifications push et SMS vers les employés
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Paramètres de notification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Channel Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications Push</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications dans l&apos;application mobile
                  </p>
                </div>
                <Switch
                  checked={settings.pushEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, pushEnabled: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoi de SMS (option payante)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">Option</Badge>
                  <Switch
                    checked={settings.smsEnabled}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smsEnabled: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notifications Email</Label>
                  <p className="text-sm text-muted-foreground">
                    Envoi automatique d&apos;emails
                  </p>
                </div>
                <Switch
                  checked={settings.emailEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailEnabled: checked })
                  }
                />
              </div>
            </div>

            {/* Automatic Alerts */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="font-semibold">Alertes automatiques</h3>

              <div className="flex items-center justify-between">
                <Label>Certifications expirées</Label>
                <Switch
                  checked={settings.automaticAlerts.expiredCertifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      automaticAlerts: {
                        ...settings.automaticAlerts,
                        expiredCertifications: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Formations à venir</Label>
                <Switch
                  checked={settings.automaticAlerts.upcomingTraining}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      automaticAlerts: {
                        ...settings.automaticAlerts,
                        upcomingTraining: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Demandes d&apos;absence</Label>
                <Switch
                  checked={settings.automaticAlerts.absenceRequests}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      automaticAlerts: {
                        ...settings.automaticAlerts,
                        absenceRequests: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Actions disciplinaires</Label>
                <Switch
                  checked={settings.automaticAlerts.disciplinaryActions}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      automaticAlerts: {
                        ...settings.automaticAlerts,
                        disciplinaryActions: checked,
                      },
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label>Expiration de contrat</Label>
                <Switch
                  checked={settings.automaticAlerts.contractExpiry}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      automaticAlerts: {
                        ...settings.automaticAlerts,
                        contractExpiry: checked,
                      },
                    })
                  }
                />
              </div>
            </div>

            <Button onClick={handleSaveSettings} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les paramètres
            </Button>
          </CardContent>
        </Card>

        {/* Test Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Envoyer une notification de test
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Titre</Label>
              <Input
                id="title"
                value={testMessage.title}
                onChange={(e) =>
                  setTestMessage({ ...testMessage, title: e.target.value })
                }
                placeholder="Titre de la notification..."
              />
            </div>

            <div>
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={testMessage.body}
                onChange={(e) =>
                  setTestMessage({ ...testMessage, body: e.target.value })
                }
                placeholder="Contenu du message..."
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label>Canaux activés</Label>
              <div className="flex gap-2">
                {settings.pushEnabled && (
                  <Badge variant="default">Push</Badge>
                )}
                {settings.smsEnabled && (
                  <Badge variant="secondary">SMS</Badge>
                )}
                {settings.emailEnabled && (
                  <Badge variant="outline">Email</Badge>
                )}
                {!settings.pushEnabled && !settings.smsEnabled && !settings.emailEnabled && (
                  <Badge variant="destructive">Aucun canal activé</Badge>
                )}
              </div>
            </div>

            <Button
              onClick={handleSendTestNotification}
              className="w-full"
              variant="outline"
            >
              <Bell className="h-4 w-4 mr-2" />
              Envoyer la notification de test
            </Button>

            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                La notification sera envoyée uniquement à votre compte pour tester le système.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


