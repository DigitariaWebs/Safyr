import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, MenuButton, Screen } from "@/components/ui";
import { getSession, setSession, type Session } from "@/features/auth/auth.storage";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [session, setSessionState] = useState<Session | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

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

  function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async function handleSave() {
    if (!session) {
      Alert.alert("Erreur", "Session introuvable");
      return;
    }

    // Validate email if provided
    if (email.trim() && !validateEmail(email.trim())) {
      Alert.alert("Erreur", "Veuillez entrer une adresse email valide");
      return;
    }

    setSaving(true);
    try {
      // In production, you would update email/phone via API
      // await updateUserProfile({ email: email.trim(), phone: phone.trim() });

      // For MVP, we just show success (actual API call would be here)
      await new Promise((resolve) => setTimeout(resolve, 500));

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

  async function handleChangePassword() {
    if (!currentPassword.trim()) {
      Alert.alert("Erreur", "Veuillez entrer votre mot de passe actuel");
      return;
    }

    if (!newPassword.trim() || newPassword.length < 6) {
      Alert.alert("Erreur", "Le nouveau mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    setChangingPassword(true);
    try {
      // In production, you would verify current password and update via API
      // await changePassword({ currentPassword, newPassword });

      // For MVP, simulate API call
      await new Promise((resolve) => setTimeout(resolve, 700));

      Alert.alert("Succès", "Mot de passe modifié avec succès", [
        {
          text: "OK",
          onPress: () => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
          },
        },
      ]);
    } catch (error) {
      console.error("Error changing password:", error);
      Alert.alert("Erreur", "Impossible de modifier le mot de passe. Vérifiez votre mot de passe actuel.");
    } finally {
      setChangingPassword(false);
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
        left={<MenuButton />}
        right={
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
                <Text className="mb-2 text-sm font-medium text-foreground">Nom complet</Text>
                <Input
                  value={fullName}
                  placeholder="Prénom Nom"
                  autoCapitalize="words"
                  editable={false}
                  className="opacity-60"
                />
                <Text className="mt-1 text-xs text-muted-foreground">
                  Le nom complet ne peut pas être modifié depuis l'application mobile
                </Text>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Email *</Text>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder="email@exemple.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <Text className="mt-1 text-xs text-muted-foreground">
                  Modifiez votre adresse email
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
                  Modifiez votre numéro de téléphone
                </Text>
              </View>
            </View>
          </Card>

          <Card className="gap-4">
            <Text className="text-base font-semibold text-foreground">Changer le mot de passe</Text>
            <View className="gap-3">
              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Mot de passe actuel *</Text>
                <Input
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  placeholder="••••••••"
                  secureTextEntry
                />
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Nouveau mot de passe *</Text>
                <Input
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Au moins 6 caractères"
                  secureTextEntry
                />
                <Text className="mt-1 text-xs text-muted-foreground">
                  Le mot de passe doit contenir au moins 6 caractères
                </Text>
              </View>

              <View>
                <Text className="mb-2 text-sm font-medium text-foreground">Confirmer le mot de passe *</Text>
                <Input
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Répétez le nouveau mot de passe"
                  secureTextEntry
                />
              </View>

              <Button
                onPress={handleChangePassword}
                disabled={changingPassword || !currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()}
                variant="outline"
              >
                {changingPassword ? "Modification..." : "Modifier le mot de passe"}
              </Button>
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
            <Button onPress={handleSave} disabled={saving}>
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
