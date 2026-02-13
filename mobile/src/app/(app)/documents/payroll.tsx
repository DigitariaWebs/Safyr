import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, Screen } from "@/components/ui";
import { getSession } from "@/features/auth/auth.storage";
import { useTheme } from "@/theme";

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

interface PayrollDocument {
  id: string;
  title: string;
  description: string;
  month?: string;
  year?: string;
}

export default function PayrollScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const [session, setSession] = useState<{ userId: string; fullName: string } | null>(null);

  useEffect(() => {
    loadSession();
  }, []);

  async function loadSession() {
    const currentSession = await getSession();
    setSession(currentSession);
  }

  async function downloadPayroll(month?: string, year?: string) {
    if (!session) {
      Alert.alert("Erreur", "Session introuvable");
      return;
    }

    const loadingKey = `payroll-${month || "all"}-${year || "all"}`;
    setLoading(loadingKey);

    try {
      const currentDate = new Date();
      const fileName = month && year
        ? `Bulletin_Salaire_${month}_${year}.pdf`
        : `Archives_Bulletins_Salaire_${year || currentDate.getFullYear()}.pdf`;

      // En production, remplacer par un appel API réel
      /*
      const API_BASE_URL = "https://api.safyr.com";
      const response = await fetch(
        `${API_BASE_URL}/api/documents/payroll?userId=${session.userId}&month=${month || ""}&year=${year || ""}`,
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
      console.error("Error downloading payroll:", error);
      Alert.alert("Erreur", "Impossible de télécharger le bulletin de salaire. Vérifiez votre connexion.");
    } finally {
      setLoading(null);
    }
  }

  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString("fr-FR", { month: "long" });
  const currentYear = currentDate.getFullYear().toString();
  const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    .toLocaleString("fr-FR", { month: "long" });
  const lastYear = currentDate.getMonth() === 0 
    ? (currentDate.getFullYear() - 1).toString() 
    : currentYear;

  const payrollDocuments: PayrollDocument[] = [
    {
      id: "payroll-current",
      title: "Bulletin de salaire actuel",
      description: "Télécharger le bulletin de salaire du mois en cours",
      month: currentMonth,
      year: currentYear,
    },
    {
      id: "payroll-last-month",
      title: "Bulletin de salaire du mois dernier",
      description: "Télécharger le bulletin de salaire du mois précédent",
      month: lastMonth,
      year: lastYear,
    },
    {
      id: "payroll-archives",
      title: "Archives bulletins de salaire",
      description: "Télécharger tous les bulletins de salaire disponibles (archives BS)",
    },
  ];

  return (
    <Screen>
      <Header
        title="Bulletins de salaire"
        subtitle="Télécharger en PDF (Archives BS)"
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
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
              <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>Mes bulletins de salaire</Text>
            </View>
            <Text className="text-sm" style={{ color: colors.foreground }}>
              Téléchargez vos bulletins de salaire (archives BS) au format PDF
            </Text>

            <View className="gap-3">
              {payrollDocuments.map((doc) => (
                <View key={doc.id} className="gap-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-medium" style={{ color: colors.foreground }}>{doc.title}</Text>
                      <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>{doc.description}</Text>
                      {doc.month && doc.year && (
                        <Text className="mt-1 text-xs" style={{ color: colors.foreground }}>
                          {doc.month} {doc.year}
                        </Text>
                      )}
                    </View>
                    <Button
                      variant="outline"
                      size="sm"
                      onPress={() => downloadPayroll(doc.month, doc.year)}
                      disabled={loading !== null}
                    >
                      {loading === `payroll-${doc.month || "all"}-${doc.year || "all"}` ? (
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
            <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Information</Text>
            <Text className="text-xs text-muted-foreground">
              Les bulletins de salaire sont générés au format PDF et peuvent être partagés ou sauvegardés sur votre appareil. Conservez vos archives BS pour vos démarches administratives.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
