import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, Screen } from "@/components/ui";
import { createTimeOffRequest } from "@/features/timeoff/timeoff.storage";
import { useNotifications } from "@/features/notifications/NotificationsContext";

export default function NewTimeOffScreen() {
  const { push } = useNotifications();
  const [type, setType] = useState<"paid" | "unpaid" | "sick" | "other">("paid");
  const [startIso, setStartIso] = useState("");
  const [endIso, setEndIso] = useState("");
  const [reason, setReason] = useState("");
  const [saving, setSaving] = useState(false);

  const canSubmit = useMemo(() => startIso.trim().length >= 10 && endIso.trim().length >= 10, [
    startIso,
    endIso,
  ]);

  async function onSubmit() {
    if (!canSubmit) return;
    setSaving(true);
    try {
      const created = await createTimeOffRequest({
        type,
        startIso: new Date(startIso).toISOString(),
        endIso: new Date(endIso).toISOString(),
        reason: reason.trim() || undefined,
      });
      await push({
        title: "Demande de congé envoyée",
        message: `Votre demande (${created.type}) du ${new Date(created.startIso).toLocaleDateString()} au ${new Date(created.endIso).toLocaleDateString()} est en attente.`,
        level: "info",
        source: "timeoff",
      });
      Alert.alert("Demande envoyée", "Votre demande a été enregistrée (démo).");
      router.back();
    } catch {
      Alert.alert("Erreur", "Impossible d’enregistrer la demande.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Screen>
      <Header
        title="Demander un congé"
        subtitle="Formulaire (MVP)"
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Card className="gap-4">
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Type</Text>
            <View className="flex-row gap-2">
              <Button
                size="sm"
                variant={type === "paid" ? "secondary" : "outline"}
                onPress={() => setType("paid")}
                className="flex-1"
              >
                Payé
              </Button>
              <Button
                size="sm"
                variant={type === "unpaid" ? "secondary" : "outline"}
                onPress={() => setType("unpaid")}
                className="flex-1"
              >
                Sans solde
              </Button>
            </View>
            <View className="flex-row gap-2 mt-2">
              <Button
                size="sm"
                variant={type === "sick" ? "secondary" : "outline"}
                onPress={() => setType("sick")}
                className="flex-1"
              >
                Maladie
              </Button>
              <Button
                size="sm"
                variant={type === "other" ? "secondary" : "outline"}
                onPress={() => setType("other")}
                className="flex-1"
              >
                Autre
              </Button>
            </View>
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Début (YYYY-MM-DD)</Text>
            <Input value={startIso} onChangeText={setStartIso} placeholder="2026-01-30" />
          </View>
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Fin (YYYY-MM-DD)</Text>
            <Input value={endIso} onChangeText={setEndIso} placeholder="2026-02-02" />
          </View>
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Motif (optionnel)</Text>
            <Input
              value={reason}
              onChangeText={setReason}
              placeholder="Ex: congé planifié"
              multiline
              textAlignVertical="top"
              containerClassName="h-24 items-start"
              className="h-full"
            />
          </View>

          <Button onPress={onSubmit} disabled={!canSubmit || saving}>
            {saving ? "Envoi..." : "Envoyer la demande"}
          </Button>

          <Text className="text-xs text-muted-foreground">
            MVP: saisie manuelle des dates. Étape suivante: date picker + validation RH/manager.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  );
}

