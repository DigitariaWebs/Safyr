import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, Screen } from "@/components/ui";
import { getSession } from "@/features/auth/auth.storage";
import {
  clearProfile,
  defaultProfileFromSession,
  getProfile,
  upsertProfile,
  type AgentProfile,
} from "@/features/profile/profile.storage";
import { useEffect, useMemo, useState } from "react";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AgentProfile | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [siteName, setSiteName] = useState("");
  const [badgeId, setBadgeId] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const session = await getSession();
        if (!session) {
          router.replace("/(auth)/login");
          return;
        }
        const stored = await getProfile();
        const base = stored ?? { ...(defaultProfileFromSession(session) as any), updatedAtIso: "" };
        if (!mounted) return;
        setProfile(stored);
        setFullName(base.fullName ?? "");
        setEmail(base.email ?? "");
        setPhone(base.phone ?? "");
        setSiteName(base.siteName ?? "");
        setBadgeId(base.badgeId ?? "");
        setEmergencyContactName(base.emergencyContactName ?? "");
        setEmergencyContactPhone(base.emergencyContactPhone ?? "");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canSave = useMemo(() => fullName.trim().length >= 3, [fullName]);

  async function onSave() {
    if (!canSave) return;
    await upsertProfile({
      fullName: fullName.trim(),
      email: email.trim() || undefined,
      phone: phone.trim() || undefined,
      siteName: siteName.trim() || undefined,
      badgeId: badgeId.trim() || undefined,
      emergencyContactName: emergencyContactName.trim() || undefined,
      emergencyContactPhone: emergencyContactPhone.trim() || undefined,
    });
    Alert.alert("Profil mis à jour", "Vos informations ont été enregistrées.");
  }

  async function onReset() {
    Alert.alert("Réinitialiser", "Supprimer le profil local et repartir du profil par défaut ?", [
      { text: "Annuler", style: "cancel" },
      {
        text: "Confirmer",
        style: "destructive",
        onPress: async () => {
          await clearProfile();
          Alert.alert("OK", "Profil local supprimé. Rouvrez l’écran pour recharger le défaut.");
          router.back();
        },
      },
    ]);
  }

  return (
    <Screen>
      <Header
        title="Profil"
        subtitle={loading ? "Chargement…" : profile ? "Synchronisé (local)" : "Par défaut (démo)"}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-4">
          <Card className="gap-4">
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Nom complet</Text>
              <Input value={fullName} onChangeText={setFullName} placeholder="Ex: Khadidja ..." />
            </View>
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="prenom.nom@entreprise.com"
              />
            </View>
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Téléphone</Text>
              <Input value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+33 ..." />
            </View>
          </Card>

          <Card className="gap-4">
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Site</Text>
              <Input value={siteName} onChangeText={setSiteName} placeholder="Ex: Siège • Paris" />
            </View>
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Badge / matricule</Text>
              <Input value={badgeId} onChangeText={setBadgeId} placeholder="agent_001" />
            </View>
          </Card>

          <Card className="gap-4">
            <Text className="text-base font-semibold text-foreground">Contact d’urgence</Text>
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Nom</Text>
              <Input value={emergencyContactName} onChangeText={setEmergencyContactName} placeholder="Nom du contact" />
            </View>
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground">Téléphone</Text>
              <Input
                value={emergencyContactPhone}
                onChangeText={setEmergencyContactPhone}
                keyboardType="phone-pad"
                placeholder="+33 ..."
              />
            </View>
          </Card>

          <Button onPress={onSave} disabled={!canSave}>
            Enregistrer
          </Button>

          <Button variant="outline" onPress={onReset}>
            Réinitialiser le profil local
          </Button>
        </View>
      </ScrollView>
    </Screen>
  );
}

