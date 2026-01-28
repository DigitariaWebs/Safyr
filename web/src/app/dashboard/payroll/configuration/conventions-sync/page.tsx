"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  RefreshCw,
  Search,
  ExternalLink,
  CheckCircle,
  XCircle,
  Info,
  Download,
  AlertTriangle,
} from "lucide-react";
import { useConventionSearch } from "@/hooks/useConvention";
import { PayrollConvention } from "@/data/payroll-conventions";
import { getLegifranceURL } from "@/services/legifrance-api";

export default function ConventionsSyncPage() {
  const [searchIDCC, setSearchIDCC] = useState("");
  const [searchResults, setSearchResults] = useState<PayrollConvention[]>([]);
  const [syncHistory, setSyncHistory] = useState<
    Array<{ idcc: string; status: "success" | "error"; timestamp: Date; message: string }>
  >([]);

  const { search, searching, searchError } = useConventionSearch();

  const handleSearchConvention = async () => {
    if (!searchIDCC.trim()) return;

    const result = await search(searchIDCC.trim());
    if (result) {
      setSearchResults([result, ...searchResults.filter((r) => r.idcc !== result.idcc)]);
      setSyncHistory([
        {
          idcc: searchIDCC,
          status: "success",
          timestamp: new Date(),
          message: `Convention ${result.name} récupérée avec succès`,
        },
        ...syncHistory,
      ]);
    } else {
      setSyncHistory([
        {
          idcc: searchIDCC,
          status: "error",
          timestamp: new Date(),
          message: searchError || "Convention non trouvée",
        },
        ...syncHistory,
      ]);
    }
  };

  const handleBulkSync = async () => {
    const commonIDCCs = ["1351", "3199", "4127", "1486", "2098"];

    for (const idcc of commonIDCCs) {
      const result = await search(idcc);
      if (result) {
        setSearchResults((prev) => [result, ...prev.filter((r) => r.idcc !== idcc)]);
        setSyncHistory((prev) => [
          {
            idcc,
            status: "success",
            timestamp: new Date(),
            message: `${result.name} synchronisée`,
          },
          ...prev,
        ]);
      }
    }
  };

  const handleExportConventions = () => {
    const dataStr = JSON.stringify(searchResults, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `conventions-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Synchronisation Conventions Collectives</h1>
        <p className="text-muted-foreground">
          Récupération automatique des conventions depuis la base officielle Légifrance
        </p>
      </div>

      {/* Info Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          Les données sont récupérées depuis l&apos;API officielle data.gouv.fr et Légifrance.
          Les conventions sont enrichies avec les paramètres spécifiques au secteur de la sécurité.
        </AlertDescription>
      </Alert>

      {/* Search Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Rechercher une Convention</h2>
            <Button onClick={handleBulkSync} variant="outline" disabled={searching}>
              <RefreshCw className={`h-4 w-4 mr-2 ${searching ? "animate-spin" : ""}`} />
              Synchroniser Conventions Courantes
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="search-idcc">IDCC</Label>
              <Input
                id="search-idcc"
                placeholder="Ex: 1351, 3199, 4127..."
                value={searchIDCC}
                onChange={(e) => setSearchIDCC(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearchConvention()}
                disabled={searching}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearchConvention} disabled={searching || !searchIDCC}>
                <Search className="h-4 w-4 mr-2" />
                Rechercher
              </Button>
            </div>
          </div>

          {searchError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{searchError}</AlertDescription>
            </Alert>
          )}
        </div>
      </Card>

      {/* Results Section */}
      {searchResults.length > 0 && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Conventions Récupérées ({searchResults.length})
              </h2>
              <Button onClick={handleExportConventions} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter JSON
              </Button>
            </div>

            <div className="space-y-3">
              {searchResults.map((convention) => (
                <div
                  key={convention.idcc}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{convention.name}</h3>
                        <Badge variant={convention.status === "Active" ? "default" : "secondary"}>
                          {convention.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">IDCC:</span>{" "}
                          <span className="font-medium">{convention.idcc}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Brochure JO:</span>{" "}
                          <span className="font-medium">{convention.brochureJO || "N/A"}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Secteur:</span>{" "}
                          <span className="font-medium">{convention.sector}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Taux minimum:</span>{" "}
                          <span className="font-medium">{convention.minimumWage.toFixed(2)} €/h</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        {convention.nightBonus > 0 && (
                          <Badge variant="outline">Nuit: {convention.nightBonus}%</Badge>
                        )}
                        {convention.sundayBonus > 0 && (
                          <Badge variant="outline">Dimanche: {convention.sundayBonus}%</Badge>
                        )}
                        {convention.holidayBonus > 0 && (
                          <Badge variant="outline">Férié: {convention.holidayBonus}%</Badge>
                        )}
                        {convention.panierAmount && (
                          <Badge variant="outline">Panier: {convention.panierAmount} €</Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        window.open(
                          getLegifranceURL(convention.idcc, convention.brochureJO),
                          "_blank"
                        )
                      }
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Sync History */}
      {syncHistory.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Historique de Synchronisation</h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {syncHistory.map((entry, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg text-sm"
              >
                <div className="flex items-center gap-3">
                  {entry.status === "success" ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">IDCC {entry.idcc}</p>
                    <p className="text-muted-foreground text-xs">{entry.message}</p>
                  </div>
                </div>
                <span className="text-muted-foreground text-xs">
                  {entry.timestamp.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* API Status */}
      <Card className="p-6 bg-muted/50">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-semibold">Configuration API</h3>
            <p className="text-sm text-muted-foreground">
              L&apos;intégration utilise l&apos;API publique data.gouv.fr pour récupérer les conventions.
              Les données sont enrichies localement avec les paramètres spécifiques du secteur.
            </p>
            <div className="mt-3 space-y-1 text-xs">
              <p>
                <span className="font-medium">Source principale:</span>{" "}
                <a
                  href="https://www.data.gouv.fr/fr/datasets/conventions-collectives-nationales/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  data.gouv.fr
                </a>
              </p>
              <p>
                <span className="font-medium">API alternative:</span>{" "}
                <a
                  href="https://siret2idcc.fabrique.social.gouv.fr/api/v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  API Conventions Collectives
                </a>
              </p>
              <p>
                <span className="font-medium">Cache:</span> 24 heures
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Common IDCCs Reference */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">IDCCs Courantes - Secteur Sécurité</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { idcc: "1351", name: "Prévention et Sécurité" },
            { idcc: "3199", name: "Gardiennage et Surveillance" },
            { idcc: "4127", name: "Sûreté Aéroportuaire" },
            { idcc: "1486", name: "Bureaux d'études techniques" },
            { idcc: "2098", name: "Agences générales d'assurances" },
            { idcc: "3173", name: "Particuliers employeurs" },
          ].map((item) => (
            <button
              key={item.idcc}
              onClick={() => {
                setSearchIDCC(item.idcc);
              }}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors text-left"
            >
              <p className="font-medium">IDCC {item.idcc}</p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}
