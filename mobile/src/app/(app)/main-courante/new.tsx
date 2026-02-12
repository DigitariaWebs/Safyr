import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, Screen } from "@/components/ui";
import type { MainCourantePriority } from "@/features/mainCourante/types";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";

function PriorityOption({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: MainCourantePriority;
  selected: boolean;
  onSelect: (v: MainCourantePriority) => void;
}) {
  const base =
    value === "high"
      ? "border-destructive"
      : value === "medium"
        ? "border-warning"
        : "border-border";
  return (
    <Button
      variant={selected ? "secondary" : "outline"}
      size="sm"
      onPress={() => onSelect(value)}
      className={`flex-1 ${selected ? "" : base}`}
    >
      {label}
    </Button>
  );
}

export default function CreateMainCouranteEventScreen() {
  const [title, setTitle] = useState("");
  const [siteName, setSiteName] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<MainCourantePriority>("low");
  const [saving, setSaving] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  const canSubmit = useMemo(() => title.trim().length > 3 && description.trim().length > 8, [
    title,
    description,
  ]);

  async function onSave() {
    if (!canSubmit) return;
    setSaving(true);
    try {
      // MVP mock — replace with API later.
      await new Promise((r) => setTimeout(r, 600));
      Alert.alert("Enregistré", "Événement ajouté à la main courante (démo).");
      router.back();
    } finally {
      setSaving(false);
    }
  }

  async function onAddPhoto() {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      Alert.alert("Permission requise", "Autorisez l’accès à la galerie pour ajouter une photo.");
      return;
    }
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (pick.canceled) return;
    setPhotoUri(pick.assets[0]?.uri ?? null);
  }

  return (
    <Screen>
      <Header
        title="Nouvel événement"
        subtitle="Main Courante"
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <ScrollView contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}>
        <Card className="gap-4">
          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Titre</Text>
            <Input value={title} onChangeText={setTitle} placeholder="Ex: Ronde effectuée" />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Site</Text>
            <Input
              value={siteName}
              onChangeText={setSiteName}
              placeholder="Ex: Siège • Paris"
            />
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Priorité</Text>
            <View className="flex-row gap-2">
              <PriorityOption
                label="Info"
                value="low"
                selected={priority === "low"}
                onSelect={setPriority}
              />
              <PriorityOption
                label="Moyen"
                value="medium"
                selected={priority === "medium"}
                onSelect={setPriority}
              />
              <PriorityOption
                label="Urgent"
                value="high"
                selected={priority === "high"}
                onSelect={setPriority}
              />
            </View>
          </View>

          <View>
            <Text className="mb-2 text-sm font-medium text-foreground">Description</Text>
            <Input
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez la situation, actions, personnes, consignes…"
              multiline
              textAlignVertical="top"
              containerClassName="h-32 items-start"
              className="h-full"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Photo / note</Text>
            <Button variant="outline" onPress={onAddPhoto}>
              {photoUri ? "Modifier la photo" : "Ajouter une photo"}
            </Button>
            {photoUri ? (
              <View className="overflow-hidden rounded-xl border border-border">
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: "100%", height: 180 }}
                  contentFit="cover"
                />
              </View>
            ) : null}
            <Text className="text-xs text-muted-foreground">
              MVP: photo stockée localement (démo). Étape suivante: upload backend.
            </Text>
          </View>

          <Button onPress={onSave} disabled={!canSubmit || saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}

