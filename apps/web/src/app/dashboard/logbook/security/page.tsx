"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Shield,
  Cloud,
  Key,
  FileCheck,
  CheckCircle,
  Users,
} from "lucide-react";
import {
  mockAPIConnections,
  mockSecurityConfigs,
} from "@/data/logbook-security";

export default function SecurityPage() {
  const encryptionConfig = mockSecurityConfigs.find(
    (c) => c.key === "encryption_enabled",
  );
  const auditConfig = mockSecurityConfigs.find(
    (c) => c.key === "audit_log_enabled",
  );
  const backupConfig = mockSecurityConfigs.find(
    (c) => c.key === "auto_backup_enabled",
  );
  const twoFAConfig = mockSecurityConfigs.find(
    (c) => c.key === "two_factor_auth",
  );
  const rgpdConfig = mockSecurityConfigs.find(
    (c) => c.key === "rgpd_compliant",
  );
  const maskingConfig = mockSecurityConfigs.find(
    (c) => c.key === "data_masking_enabled",
  );

  const [encryptionEnabled] = useState(encryptionConfig?.value === true);
  const [auditLogEnabled, setAuditLogEnabled] = useState(
    auditConfig?.value === true,
  );
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(
    backupConfig?.value === true,
  );
  const [twoFAEnabled, setTwoFAEnabled] = useState(twoFAConfig?.value === true);
  const [rgpdCompliant] = useState(rgpdConfig?.value === true);
  const [dataMaskingEnabled, setDataMaskingEnabled] = useState(
    maskingConfig?.value === true,
  );

  const apiConnections = mockAPIConnections;

  const roles = [
    {
      name: "Agent",
      permissions: [
        "Créer événements",
        "Consulter ses événements",
        "Upload médias",
      ],
    },
    {
      name: "Superviseur",
      permissions: [
        "Tout agent",
        "Valider/modifier événements",
        "Commenter",
        "Générer rapports",
      ],
    },
    {
      name: "Client",
      permissions: [
        "Consulter événements de ses sites",
        "Exports PDF",
        "Messagerie",
      ],
    },
    {
      name: "Admin",
      permissions: [
        "Accès complet",
        "Gestion utilisateurs",
        "Configuration",
        "Audit logs",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">
          Sécurité & Technique
        </h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Configuration de la sécurité, chiffrement, API et conformité RGPD
        </p>
      </div>

      {/* Security Settings */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Sécurité des données
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Stockage crypté (AES256)</Label>
              <p className="text-sm text-muted-foreground">
                Toutes les données sont chiffrées avec AES-256
              </p>
            </div>
            <Badge variant={encryptionEnabled ? "default" : "outline"}>
              {encryptionEnabled ? "Actif" : "Inactif"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Journalisation infalsifiable</Label>
              <p className="text-sm text-muted-foreground">
                Toutes les actions sont journalisées et horodatées
              </p>
            </div>
            <Switch
              checked={auditLogEnabled}
              onCheckedChange={setAuditLogEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Sauvegardes automatiques</Label>
              <p className="text-sm text-muted-foreground">
                Sauvegardes quotidiennes automatiques
              </p>
            </div>
            <Switch
              checked={autoBackupEnabled}
              onCheckedChange={setAutoBackupEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Traçabilité complète (audit log)</Label>
              <p className="text-sm text-muted-foreground">
                Historique complet de toutes les modifications
              </p>
            </div>
            <Switch checked={true} disabled />
          </div>
        </CardContent>
      </Card>

      {/* Authentication */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Key className="h-5 w-5" />
            Authentification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Authentification forte (2FA)</Label>
              <p className="text-sm text-muted-foreground">
                Double authentification pour les comptes sensibles
              </p>
            </div>
            <Switch checked={twoFAEnabled} onCheckedChange={setTwoFAEnabled} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Accès par rôle</Label>
              <p className="text-sm text-muted-foreground">
                Gestion fine des permissions par rôle
              </p>
            </div>
            <Badge variant="default">Configuré</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Users className="h-5 w-5" />
            Rôles & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roles.map((role) => (
              <div
                key={role.name}
                className="p-4 border rounded-lg bg-muted/30"
              >
                <h3 className="font-semibold mb-2">{role.name}</h3>
                <ul className="space-y-1">
                  {role.permissions.map((perm, index) => (
                    <li key={index} className="text-sm text-muted-foreground">
                      • {perm}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RGPD Compliance */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Conformité RGPD
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>RGPD compliant</Label>
              <p className="text-sm text-muted-foreground">
                Conformité aux règles de protection des données
              </p>
            </div>
            <Badge variant={rgpdCompliant ? "default" : "outline"}>
              {rgpdCompliant ? "Conforme" : "Non conforme"}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label>Masquage automatique des données sensibles</Label>
              <p className="text-sm text-muted-foreground">
                Masquage automatique des informations personnelles
              </p>
            </div>
            <Switch
              checked={dataMaskingEnabled}
              onCheckedChange={setDataMaskingEnabled}
            />
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">
                  Conformité validée
                </p>
                <p className="text-xs text-muted-foreground">
                  Stockage en Europe • Chiffrement AES256 • Audit logs actifs
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Connections */}
      <Card className="glass-card border-border/40">
        <CardHeader>
          <CardTitle className="text-lg font-light flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Connexions API REST
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiConnections.map((conn) => (
              <div
                key={conn.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">{conn.name}</p>
                  {conn.lastSync && (
                    <p className="text-sm text-muted-foreground">
                      Dernière synchro:{" "}
                      {new Date(conn.lastSync).toLocaleString("fr-FR")}
                    </p>
                  )}
                </div>
                <Badge
                  variant={conn.status === "connected" ? "default" : "outline"}
                >
                  {conn.status === "connected" ? "Connecté" : "En attente"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
