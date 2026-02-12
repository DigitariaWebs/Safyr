import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, Screen } from "@/components/ui";
import { getSession } from "@/features/auth/auth.storage";

// Imports conditionnels pour expo-file-system et expo-sharing
let FileSystem: any = null;
let Sharing: any = null;

try {
  // @ts-ignore
  FileSystem = require("expo-file-system");
} catch (e) {
  console.warn("expo-file-system not installed");
}

try {
  // @ts-ignore
  Sharing = require("expo-sharing");
} catch (e) {
  console.warn("expo-sharing not installed");
}

interface ScheduleDocument {
  id: string;
  title: string;
  description: string;
  month?: string;
  year?: string;
}

export default function ScheduleScreen() {
  const [loading, setLoading] = useState<string | null>(null);
  const [session, setSession] = useState<{ userId: string; fullName: string } | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    const currentSession = await getSession();
    setSession(currentSession);
  }

  async function downloadSchedule(month?: string, year?: string) {
    if (!session) {
      Alert.alert("Erreur", "Session introuvable");
      return;
    }

    const loadingKey = `schedule-${month || "all"}-${year || "all"}`;
    setLoading(loadingKey);

    try {
      const currentDate = new Date();
      const fileName = `Emploi_du_temps_${month || currentDate.toLocaleString("fr-FR", { month: "long" })}_${year || currentDate.getFullYear()}.pdf`;

      // En production, remplacer par un appel API réel
      /*
      const API_BASE_URL = "https://api.safyr.com";
      const response = await fetch(
        `${API_BASE_URL}/api/documents/schedule?userId=${session.userId}&month=${month || ""}&year=${year || ""}`,
        {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors du téléchargement");
      }

      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64Data = reader.result?.toString().split(",")[1];
        if (!base64Data) return;

        const fileUri = FileSystem.documentDirectory + fileName;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: `Télécharger ${fileName}`,
          });
        } else {
          Alert.alert("Succès", `Fichier sauvegardé: ${fileUri}`);
        }
      };
      */

      // Simulation pour MVP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const modulesAvailable = FileSystem && Sharing;
      let isAvailable = false;
      
      if (modulesAvailable) {
        try {
          if (typeof Sharing.isAvailableAsync === "function") {
            isAvailable = await Sharing.isAvailableAsync();
          }
        } catch (e) {
          console.warn("Sharing module not available:", e);
        }
      }

      if (modulesAvailable && isAvailable && FileSystem.documentDirectory) {
        const fileUri = FileSystem.documentDirectory + fileName;
        
        try {
          await Sharing.shareAsync(fileUri, {
            mimeType: "application/pdf",
            dialogTitle: `Télécharger ${fileName}`,
          });
          
          Alert.alert("Succès", `Le fichier ${fileName} est prêt à être partagé`);
        } catch (shareError) {
          console.error("Share error:", shareError);
          Alert.alert(
            "Information",
            `En production, le fichier ${fileName} sera téléchargé depuis le serveur.`
          );
        }
      } else {
        Alert.alert(
          "Téléchargement",
          `Le fichier ${fileName} sera téléchargé.\n\nPour activer le téléchargement réel, installez:\n\nnpx expo install expo-file-system expo-sharing\n\nPuis configurez l'appel API vers votre backend.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("Error downloading schedule:", error);
      Alert.alert("Erreur", "Impossible de télécharger l'emploi du temps. Vérifiez votre connexion.");
    } finally {
      setLoading(null);
    }
  }

  const scheduleDocuments: ScheduleDocument[] = [
    {
      id: "schedule-current",
      title: "Emploi du temps actuel",
      description: "Télécharger l'emploi du temps du mois en cours",
    },
    {
      id: "schedule-last-month",
      title: "Emploi du temps du mois dernier",
      description: "Télécharger l'emploi du temps du mois précédent",
    },
    {
      id: "schedule-custom",
      title: "Emploi du temps personnalisé",
      description: "Sélectionner une période spécifique",
    },
  ];

  return (
    <Screen>
      <Header
        title="Emploi du temps"
        subtitle="Télécharger en PDF"
        left={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Retour
          </Button>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="gap-4">
          <Card className="gap-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="calendar-outline" size={24} color="#16a34a" />
              <Text className="text-lg font-semibold text-foreground">Mes emplois du temps</Text>
            </View>
            <Text className="text-sm text-muted-foreground">
              Téléchargez votre emploi du temps au format PDF
            </Text>

            <View className="gap-3">
              {scheduleDocuments.map((doc) => (
                <View key={doc.id} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium text-foreground">{doc.title}</Text>
                      <Text className="mt-1 text-sm text-muted-foreground">{doc.description}</Text>
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => downloadSchedule(doc.month, doc.year)}
                      disabled={loading !== null}
                    >
                      {loading === `schedule-${doc.month || "all"}-${doc.year || "all"}` ? (
                        <ActivityIndicator size="small" />
                      ) : (
                        <>
                          <Ionicons name="download-outline" size={16} />
                          <Text className="ml-1">PDF</Text>
                        </>
                      )}
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          </Card>

          <Card className="gap-2">
            <Text className="text-sm font-medium text-foreground">Information</Text>
            <Text className="text-xs text-muted-foreground">
              Les emplois du temps sont générés au format PDF et peuvent être partagés ou sauvegardés sur votre appareil.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
