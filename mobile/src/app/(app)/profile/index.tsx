import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, Screen } from "@/components/ui";
import { getSession, setSession, type Session } from "@/features/auth/auth.storage";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSessionState] = useState<Session | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const currentSession = await getSession();
      if (currentSession) {
        setSessionState(currentSession);
        setFullName(currentSession.fullName);
        // Email and phone would come from a user profile API in production
        // For now, we'll use placeholder or empty values
        setEmail("");
        setPhone("");
      } else {
        // No session, redirect to login
        router.replace("/(auth)/login");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      Alert.alert("Erreur", "Impossible de charger le profil");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!fullName.trim()) {
      Alert.alert("Erreur", "Le nom complet est requis");
      return;
    }

    if (!session) {
      Alert.alert("Erreur", "Session introuvable");
      return;
    }

    setSaving(true);
    try {
      // Update session with new fullName
      const updatedSession: Session = {
        ...session,
        fullName: fullName.trim(),
      };
      await setSession(updatedSession);
      setSessionState(updatedSession);

      // In production, you would also update email/phone via API
      // await updateUserProfile({ email, phone });

      Alert.alert("Succès", "Profil mis à jour avec succès", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.error("Error saving profile:", error);
      Alert.alert("Erreur", "Impossible de sauvegarder le profil");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Screen>
        <Header title="Profil" subtitle="Chargement..." />
      </Screen>
    );
  }

  return (
    <Screen>
      <Header
        title="Mon profil"
        subtitle="Informations personnelles"
        left={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Retour
          </Button>
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 32 }}>
          <View className="gap-4">
            <Card className="gap-4">
            <Text className="text-base font-semibold text-foreground">Informations personnelles</Text>

            <View className="gap-3">
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Nom complet *</Text>
                <Input
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Prénom Nom"
                  autoCapitalize="words"
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Email</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@exemple.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  editable={false}
                  className="opacity-60"
                />
                <Text className="mt-1 text-xs text-muted-foreground">
                  L'email ne peut pas être modifié depuis l'application mobile
                </Text>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Téléphone</Text>
                <Input
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+33 6 12 34 56 78"
                  keyboardType="phone-pad"
                />
                <Text className="mt-1 text-xs text-muted-foreground">
                  MVP: cette information sera synchronisée avec le serveur
                </Text>
              </View>
            </View>
          </Card>

          <Card className="gap-2">
            <Text className="text-base font-semibold text-foreground">Informations de compte</Text>
            <View className="gap-2">
              <View className="flex-row justify-between">
                <Text className="text-sm text-muted-foreground">Identifiant</Text>
                <Text className="text-sm font-medium text-foreground">{session?.userId}</Text>
              </View>
            </View>
          </Card>

          <View className="gap-3 pt-2">
            <Button onPress={handleSave} disabled={saving || !fullName.trim()}>
              {saving ? "Enregistrement..." : "Enregistrer les modifications"}
            </Button>
            <Button variant="outline" onPress={() => router.back()}>
              Annuler
            </Button>
          </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
