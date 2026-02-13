import { useState, useEffect } from "react";
import { Alert, ScrollView, Text, View, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Button, Card, Header, MenuButton, Screen } from "@/components/ui";
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

interface DocumentHistory {
  id: string;
  type: "schedule" | "payroll";
  title: string;
  month?: string;
  year?: string;
  downloadedAt: string;
}

export default function DocumentsScreen() {
  const { colors } = useTheme();
  const [loading, setLoading] = useState<string | null>(null);
  const [session, setSession] = useState<{ userId: string; fullName: string } | null>(null);
  const [scheduleHistory, setScheduleHistory] = useState<DocumentHistory[]>([]);
  const [payrollHistory, setPayrollHistory] = useState<DocumentHistory[]>([]);

  useEffect(() => {
    loadSession();
    loadHistory();
  }, []);

  async function loadSession() {
    const currentSession = await getSession();
    setSession(currentSession);
  }

  async function loadHistory() {
    // En production, charger l'historique depuis l'API ou le stockage local
    // Pour le MVP, on simule avec des données
    const currentDate = new Date();
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    
    setScheduleHistory([
      {
        id: "schedule-1",
        type: "schedule",
        title: "Emploi du temps",
        month: currentDate.toLocaleString("fr-FR", { month: "long" }),
        year: currentDate.getFullYear().toString(),
        downloadedAt: new Date().toLocaleDateString("fr-FR"),
      },
      {
        id: "schedule-2",
        type: "schedule",
        title: "Emploi du temps",
        month: lastMonth.toLocaleString("fr-FR", { month: "long" }),
        year: lastMonth.getFullYear().toString(),
        downloadedAt: lastMonth.toLocaleDateString("fr-FR"),
      },
    ]);

    setPayrollHistory([
      {
        id: "payroll-1",
        type: "payroll",
        title: "Bulletin de salaire",
        month: currentDate.toLocaleString("fr-FR", { month: "long" }),
        year: currentDate.getFullYear().toString(),
        downloadedAt: new Date().toLocaleDateString("fr-FR"),
      },
      {
        id: "payroll-2",
        type: "payroll",
        title: "Bulletin de salaire",
        month: lastMonth.toLocaleString("fr-FR", { month: "long" }),
        year: lastMonth.getFullYear().toString(),
        downloadedAt: lastMonth.toLocaleDateString("fr-FR"),
      },
    ]);
  }

  async function downloadPDF(type: "schedule" | "payroll", month?: string, year?: string) {
    if (!session) {
      Alert.alert("Erreur", "Session introuvable");
      return;
    }

    const loadingKey = `${type}-${month || "current"}-${year || "current"}`;
    setLoading(loadingKey);

    try {
      const currentDate = new Date();
      const fileName = type === "schedule"
        ? `Emploi_du_temps_${month || currentDate.toLocaleString("fr-FR", { month: "long" })}_${year || currentDate.getFullYear()}.pdf`
        : `Bulletin_Salaire_${month || "all"}_${year || currentDate.getFullYear()}.pdf`;

      // En production, remplacer par un appel API réel
      /*
      const API_BASE_URL = "https://api.safyr.com";
      const response = await fetch(
        `${API_BASE_URL}/api/documents/${type}?userId=${session.userId}&month=${month || ""}&year=${year || ""}`,
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

        // Ajouter à l'historique
        const newDoc: DocumentHistory = {
          id: `${type}-${Date.now()}`,
          type,
          title: type === "schedule" ? "Emploi du temps" : "Bulletin de salaire",
          month,
          year,
          downloadedAt: new Date().toLocaleDateString("fr-FR"),
        };
        
        if (type === "schedule") {
          setScheduleHistory([newDoc, ...scheduleHistory]);
        } else {
          setPayrollHistory([newDoc, ...payrollHistory]);
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

      // Ajouter à l'historique après téléchargement
      const newDoc: DocumentHistory = {
        id: `${type}-${Date.now()}`,
        type,
        title: type === "schedule" ? "Emploi du temps" : "Bulletin de salaire",
        month: month || new Date().toLocaleString("fr-FR", { month: "long" }),
        year: year || new Date().getFullYear().toString(),
        downloadedAt: new Date().toLocaleDateString("fr-FR"),
      };
      
      if (type === "schedule") {
        setScheduleHistory([newDoc, ...scheduleHistory]);
      } else {
        setPayrollHistory([newDoc, ...payrollHistory]);
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      Alert.alert("Erreur", "Impossible de télécharger le document. Vérifiez votre connexion.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Screen>
      <Header
        title="Mes documents"
        subtitle="Téléchargements PDF"
        left={<MenuButton />}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Retour
          </Button>
        }
      />

      <ScrollView 
        className="flex-1 px-4" 
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        <View className="gap-4">
          {/* Section Emploi du temps */}
          <Card className="gap-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="calendar-outline" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>Emploi du temps</Text>
                <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>
                  Téléchargez votre emploi du temps au format PDF
                </Text>
              </View>
            </View>

            <Button
              variant="default"
              onPress={() => downloadPDF("schedule")}
              disabled={loading !== null}
              className="w-full"
            >
              {loading?.startsWith("schedule") ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color={colors.primaryForeground} />
                  <Text className="ml-2" style={{ color: colors.primaryForeground }}>Télécharger l'emploi du temps actuel</Text>
                </>
              )}
            </Button>

            {/* Historique emploi du temps */}
            {scheduleHistory.length > 0 && (
              <View className="mt-4 gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Historique</Text>
                <View className="gap-2">
                  {scheduleHistory.map((doc) => (
                    <View
                      key={doc.id}
                      className="flex-row items-center justify-between rounded-lg border p-3"
                      style={{ 
                        borderColor: colors.primary,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-medium" style={{ color: colors.foreground }}>{doc.title}</Text>
                        <Text className="mt-1 text-xs" style={{ color: colors.foreground }}>
                          {doc.month} {doc.year}
                        </Text>
                        <Text className="mt-1 text-xs" style={{ color: colors.foreground }}>
                          Téléchargé le {doc.downloadedAt}
                        </Text>
                      </View>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => downloadPDF("schedule", doc.month, doc.year)}
                        disabled={loading !== null}
                      >
                        {loading === `schedule-${doc.month || "current"}-${doc.year || "current"}` ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Ionicons name="download-outline" size={16} />
                        )}
                      </Button>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>

          {/* Section Bulletins de salaire */}
          <Card className="gap-4">
            <View className="flex-row items-center gap-3">
              <Ionicons name="document-text-outline" size={24} color={colors.primary} />
              <View className="flex-1">
                <Text className="text-lg font-semibold" style={{ color: colors.foreground }}>Bulletins de salaire</Text>
                <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>
                  Téléchargez vos bulletins de salaire (archives BS) au format PDF
                </Text>
              </View>
            </View>

            <Button
              variant="default"
              onPress={() => downloadPDF("payroll")}
              disabled={loading !== null}
              className="w-full"
            >
              {loading?.startsWith("payroll") ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color={colors.primaryForeground} />
                  <Text className="ml-2" style={{ color: colors.primaryForeground }}>Télécharger le bulletin de salaire actuel</Text>
                </>
              )}
            </Button>

            {/* Historique bulletins de salaire */}
            {payrollHistory.length > 0 && (
              <View className="mt-4 gap-2">
                <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Historique</Text>
                <View className="gap-2">
                  {payrollHistory.map((doc) => (
                    <View
                      key={doc.id}
                      className="flex-row items-center justify-between rounded-lg border p-3"
                      style={{ 
                        borderColor: colors.primary,
                        backgroundColor: colors.surface,
                      }}
                    >
                      <View className="flex-1">
                        <Text className="text-sm font-medium" style={{ color: colors.foreground }}>{doc.title}</Text>
                        <Text className="mt-1 text-xs" style={{ color: colors.foreground }}>
                          {doc.month} {doc.year}
                        </Text>
                        <Text className="mt-1 text-xs" style={{ color: colors.foreground }}>
                          Téléchargé le {doc.downloadedAt}
                        </Text>
                      </View>
                      <Button
                        variant="outline"
                        size="sm"
                        onPress={() => downloadPDF("payroll", doc.month, doc.year)}
                        disabled={loading !== null}
                      >
                        {loading === `payroll-${doc.month || "current"}-${doc.year || "current"}` ? (
                          <ActivityIndicator size="small" />
                        ) : (
                          <Ionicons name="download-outline" size={16} />
                        )}
                      </Button>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </Card>

          <Card className="gap-2">
            <Text className="text-sm font-medium" style={{ color: colors.foreground }}>Information</Text>
            <Text className="text-xs" style={{ color: colors.foreground }}>
              Les documents sont générés au format PDF et peuvent être partagés ou sauvegardés sur votre appareil. L'historique conserve les documents que vous avez téléchargés.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}
