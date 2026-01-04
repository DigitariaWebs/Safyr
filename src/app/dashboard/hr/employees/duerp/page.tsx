"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function DUERPPage() {
  const getGraviteBadge = (gravite: string) => {
    if (gravite === "Grave") {
      return <Badge variant="destructive">{gravite}</Badge>;
    }
    if (gravite === "Moyenne") {
      return <Badge variant="secondary">{gravite}</Badge>;
    }
    return <Badge variant="outline">{gravite}</Badge>;
  };

  const getProbabiliteBadge = (probabilite: string) => {
    if (probabilite === "Moyenne") {
      return <Badge variant="secondary">{probabilite}</Badge>;
    }
    return <Badge variant="outline">{probabilite}</Badge>;
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-3xl font-light tracking-tight">DUERP</h1>
        <p className="mt-2 text-sm font-light text-muted-foreground">
          Document Unique d&apos;Évaluation des Risques Professionnels
        </p>
      </div>

      {/* Agent SSIAP1 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent SSIAP1 en ronde au Palais des Congrès
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Chute de plain-pied
                </TableCell>
                <TableCell>Sols glissants ou encombrés</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation à l&apos;observation des risques, signalisation des
                  zones dangereuses
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Fatigue ou malaise
                </TableCell>
                <TableCell>Travail de nuit ou longue station debout</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Organisation des rondes, pauses régulières
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Agressions physiques
                </TableCell>
                <TableCell>
                  Rencontre avec des personnes malintentionnées
                </TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>
                  Équipement radio, formation à la gestion de conflits
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Incendie</TableCell>
                <TableCell>Détection ou gestion tardive</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation SSIAP, vérification régulière des équipements
                  incendie
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent SSIAP2 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent SSIAP2 au PC Sécurité
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Fatigue visuelle</TableCell>
                <TableCell>Travail prolongé sur écrans</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Aménagement ergonomique du poste, pauses visuelles
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>
                  Gestion simultanée d&apos;alarmes et de communications
                </TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation à la gestion du stress, procédures claires
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Incendie au PC sécurité
                </TableCell>
                <TableCell>Équipement électrique ou erreur humaine</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>
                  Vérification des installations électriques
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Isolement</TableCell>
                <TableCell>Absence de collègues</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Surveillance à distance par supérieur</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent de sécurité Super U */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent de sécurité dans un supermarché (Super U)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Agression physique
                </TableCell>
                <TableCell>
                  Intervention lors d&apos;un vol ou conflit client
                </TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation à la gestion de conflit, équipement de communication
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  TMS (troubles musculosquelettiques)
                </TableCell>
                <TableCell>Surveillance prolongée debout</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Alterner surveillance et déplacements réguliers
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>
                  Intervention répétée ou tension dans l&apos;environnement
                </TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Briefings réguliers et soutien psychologique
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent d'accueil parking */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent d&apos;accueil parking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Agression verbale ou physique
                </TableCell>
                <TableCell>Mécontentement des utilisateurs</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation à la communication et gestion des conflits
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Inhalation de gaz d&apos;échappement
                </TableCell>
                <TableCell>Zone confinée avec véhicules</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Ventilation efficace, port éventuel de masque
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Accident de la circulation
                </TableCell>
                <TableCell>Interaction avec les conducteurs</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Zones piétonnes bien définies</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Isolement</TableCell>
                <TableCell>Travail seul en zone isolée</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Surveillance vidéo et rondes régulières</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent de surveillance piscine */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent de surveillance piscine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Glissade ou chute</TableCell>
                <TableCell>Sols mouillés autour des bassins</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Chaussures antidérapantes, signalisation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Risque de noyade</TableCell>
                <TableCell>Intervention en cas d&apos;accident</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>
                  Formation sauvetage aquatique, PSC1 / PSE1
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Agression physique ou verbale
                </TableCell>
                <TableCell>Gestion de conflits avec usagers</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Formation gestion des conflits, équipement radio
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Fatigue ou insolation
                </TableCell>
                <TableCell>Environnement chaud</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Alternance des postes, hydratation, pauses
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Troubles auditifs</TableCell>
                <TableCell>Bruit ambiant élevé</TableCell>
                <TableCell>{getGraviteBadge("Faible")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Réduction exposition au bruit, pauses</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>Incidents imprévus</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Formation gestion du stress, débriefings</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Contamination chimique
                </TableCell>
                <TableCell>Produits de traitement de l&apos;eau</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Formation, port d&apos;EPI</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent d'intervention sur alarme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent d&apos;intervention sur alarme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Agression physique
                </TableCell>
                <TableCell>Présence d&apos;intrus hostiles</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Équipement de protection, formation conflits
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Accident de la circulation
                </TableCell>
                <TableCell>Déplacements en urgence</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>
                  Conduite défensive, vérification véhicules
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Chute ou glissade</TableCell>
                <TableCell>Site mal éclairé ou accidenté</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Lampe torche, chaussures adaptées</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>Interventions imprévues</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Formation gestion du stress, briefing</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Risques électriques
                </TableCell>
                <TableCell>Installations électriques</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Formation risques électriques</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent événementiel */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent événementiel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">
                  Agression physique ou verbale
                </TableCell>
                <TableCell>Foule ou individus alcoolisés</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Formation conflits, binôme, radio</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Fatigue ou épuisement
                </TableCell>
                <TableCell>Longues heures debout</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Pauses régulières, hydratation</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Écrasement ou blessure
                </TableCell>
                <TableCell>Forte affluence</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Délimitation zones, équipement adapté</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>Situations d&apos;urgence</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Briefing, soutien psychologique</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Troubles auditifs</TableCell>
                <TableCell>Environnement bruyant</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Bouchons d&apos;oreilles</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Incident d&apos;évacuation
                </TableCell>
                <TableCell>Mauvaise gestion de foule</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>
                  Formation évacuation, reconnaissance des lieux
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Agent SSIAP de nuit */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Poste : Agent SSIAP de nuit sur site en bord de plage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Risque identifié</TableHead>
                <TableHead>Cause potentielle</TableHead>
                <TableHead>Gravité</TableHead>
                <TableHead>Probabilité</TableHead>
                <TableHead>Mesures de prévention</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Chute ou glissade</TableCell>
                <TableCell>Sols humides ou sableux</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Chaussures antidérapantes</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Fatigue ou somnolence
                </TableCell>
                <TableCell>Travail de nuit prolongé</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Pauses, repos avant prise de poste</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Agression physique
                </TableCell>
                <TableCell>Individus malintentionnés</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Équipement radio, rondes en binôme</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Exposition aux intempéries
                </TableCell>
                <TableCell>Vent, froid, humidité</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Moyenne")}</TableCell>
                <TableCell>Vêtements adaptés</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Risques incendie</TableCell>
                <TableCell>Déchets inflammables</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Inspection régulière</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Stress</TableCell>
                <TableCell>Isolement ou urgence</TableCell>
                <TableCell>{getGraviteBadge("Moyenne")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Communication avec PC sécurité</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">
                  Noyade ou chute en mer
                </TableCell>
                <TableCell>Déplacement près de l&apos;eau</TableCell>
                <TableCell>{getGraviteBadge("Grave")}</TableCell>
                <TableCell>{getProbabiliteBadge("Faible")}</TableCell>
                <TableCell>Éclairage puissant, zones interdites</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
