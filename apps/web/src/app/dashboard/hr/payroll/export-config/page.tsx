"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  Upload,
  Check,
  Settings as SettingsIcon,
} from "lucide-react";

interface ExportConfig {
  software: "silae" | "sage" | "cegid" | "paie_rh_net" | "custom";
  format: "csv" | "xlsx" | "xml" | "json" | "txt";
  autoExport: boolean;
  exportDay: number; // jour du mois
  exportTime: string;
  includeVariables: boolean;
  includeAbsences: boolean;
  includeExpenses: boolean;
  includeHours: boolean;
  ftpEnabled: boolean;
  ftpHost?: string;
  ftpUser?: string;
  ftpPassword?: string;
  ftpPath?: string;
  emailNotification: boolean;
  emailRecipients?: string;
}

const softwareOptions = [
  { value: "silae", label: "Silae" },
  { value: "sage", label: "Sage Paie" },
  { value: "cegid", label: "Cegid" },
  { value: "paie_rh_net", label: "Paie RH Net" },
  { value: "custom", label: "Format personnalisé" },
];

export default function ExportConfigPage() {
  const [config, setConfig] = useState<ExportConfig>({
    software: "silae",
    format: "xlsx",
    autoExport: true,
    exportDay: 25,
    exportTime: "18:00",
    includeVariables: true,
    includeAbsences: true,
    includeExpenses: true,
    includeHours: true,
    ftpEnabled: false,
    emailNotification: true,
    emailRecipients: "comptabilite@exemple.fr, rh@exemple.fr",
  });

  const [lastExport, setLastExport] = useState<{
    date: string;
    records: number;
    status: "success" | "error";
  }>({
    date: "2024-12-25T18:00:00",
    records: 45,
    status: "success",
  });

  const handleSaveConfig = () => {
    alert("Configuration d'export enregistrée avec succès!");
  };

  const handleManualExport = () => {
    alert("Export manuel lancé... Fichier en cours de génération.");
    setLastExport({
      date: new Date().toISOString(),
      records: 45,
      status: "success",
    });
  };

  const handleTestConnection = () => {
    if (!config.ftpEnabled) {
      alert("FTP non activé");
      return;
    }
    alert("Test de connexion FTP... Connexion réussie!");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export vers Logiciels de Paie</h1>
        <p className="text-muted-foreground">
          Configuration de l&apos;export automatique vers Silae, Sage et autres
          logiciels de paie
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Configuration de l&apos;export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Software Selection */}
            <div>
              <Label htmlFor="software">Logiciel de paie</Label>
              <Select
                value={config.software}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    software: value as ExportConfig["software"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {softwareOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Format Selection */}
            <div>
              <Label htmlFor="format">Format de fichier</Label>
              <Select
                value={config.format}
                onValueChange={(value) =>
                  setConfig({
                    ...config,
                    format: value as ExportConfig["format"],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="xlsx">Excel (.xlsx)</SelectItem>
                  <SelectItem value="csv">CSV (.csv)</SelectItem>
                  <SelectItem value="xml">XML (.xml)</SelectItem>
                  <SelectItem value="json">JSON (.json)</SelectItem>
                  <SelectItem value="txt">Texte (.txt)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Auto Export Settings */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Export automatique</Label>
                  <p className="text-sm text-muted-foreground">
                    Export programmé chaque mois
                  </p>
                </div>
                <Switch
                  checked={config.autoExport}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, autoExport: checked })
                  }
                />
              </div>

              {config.autoExport && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="exportDay">Jour du mois</Label>
                      <Input
                        id="exportDay"
                        type="number"
                        min="1"
                        max="31"
                        value={config.exportDay}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            exportDay: parseInt(e.target.value) || 1,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="exportTime">Heure</Label>
                      <Input
                        id="exportTime"
                        type="time"
                        value={config.exportTime}
                        onChange={(e) =>
                          setConfig({ ...config, exportTime: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Data Inclusion */}
            <div className="space-y-3 pt-4 border-t">
              <Label>Données à inclure</Label>

              <div className="flex items-center justify-between">
                <Label className="font-normal">Variables de paie</Label>
                <Switch
                  checked={config.includeVariables}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeVariables: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="font-normal">Absences</Label>
                <Switch
                  checked={config.includeAbsences}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeAbsences: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="font-normal">Notes de frais</Label>
                <Switch
                  checked={config.includeExpenses}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeExpenses: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="font-normal">Heures travaillées</Label>
                <Switch
                  checked={config.includeHours}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, includeHours: checked })
                  }
                />
              </div>
            </div>

            <Button onClick={handleSaveConfig} className="w-full">
              Enregistrer la configuration
            </Button>
          </CardContent>
        </Card>

        {/* FTP & Notifications */}
        <div className="space-y-6">
          {/* FTP Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Transfert FTP (Optionnel)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Activer le transfert FTP</Label>
                  <p className="text-sm text-muted-foreground">
                    Upload automatique vers serveur FTP
                  </p>
                </div>
                <Switch
                  checked={config.ftpEnabled}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, ftpEnabled: checked })
                  }
                />
              </div>

              {config.ftpEnabled && (
                <div className="space-y-3 pt-2">
                  <div>
                    <Label htmlFor="ftpHost">Serveur FTP</Label>
                    <Input
                      id="ftpHost"
                      placeholder="ftp.exemple.fr"
                      value={config.ftpHost || ""}
                      onChange={(e) =>
                        setConfig({ ...config, ftpHost: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpUser">Utilisateur</Label>
                    <Input
                      id="ftpUser"
                      value={config.ftpUser || ""}
                      onChange={(e) =>
                        setConfig({ ...config, ftpUser: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpPassword">Mot de passe</Label>
                    <Input
                      id="ftpPassword"
                      type="password"
                      value={config.ftpPassword || ""}
                      onChange={(e) =>
                        setConfig({ ...config, ftpPassword: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="ftpPath">Chemin distant</Label>
                    <Input
                      id="ftpPath"
                      placeholder="/paie/imports/"
                      value={config.ftpPath || ""}
                      onChange={(e) =>
                        setConfig({ ...config, ftpPath: e.target.value })
                      }
                    />
                  </div>

                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    className="w-full"
                  >
                    Tester la connexion
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications Email</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notification par email</Label>
                <Switch
                  checked={config.emailNotification}
                  onCheckedChange={(checked) =>
                    setConfig({ ...config, emailNotification: checked })
                  }
                />
              </div>

              {config.emailNotification && (
                <div>
                  <Label htmlFor="emailRecipients">
                    Destinataires (séparés par des virgules)
                  </Label>
                  <Input
                    id="emailRecipients"
                    value={config.emailRecipients || ""}
                    onChange={(e) =>
                      setConfig({ ...config, emailRecipients: e.target.value })
                    }
                    placeholder="email1@exemple.fr, email2@exemple.fr"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Last Export Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dernier export</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Date:</span>
                <span className="text-sm font-medium">
                  {new Date(lastExport.date).toLocaleString("fr-FR")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Enregistrements:</span>
                <span className="text-sm font-medium">
                  {lastExport.records}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Statut:</span>
                <Badge
                  variant={
                    lastExport.status === "success" ? "default" : "destructive"
                  }
                >
                  {lastExport.status === "success" ? (
                    <>
                      <Check className="h-3 w-3 mr-1" />
                      Réussi
                    </>
                  ) : (
                    "Échec"
                  )}
                </Badge>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleManualExport}
              >
                <Download className="h-4 w-4 mr-2" />
                Export manuel maintenant
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
