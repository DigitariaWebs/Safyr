import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, View, ActionSheetIOS, Platform } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Input, Screen } from "@/components/ui";
import { VideoPlayer } from "@/components/ui/video-player";
import { VoiceRecorder } from "@/components/ui/voice-recorder";
import type { MainCourantePriority } from "@/features/mainCourante/types";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";

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
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioDuration, setAudioDuration] = useState<number>(0);

  const canSubmit = useMemo(() => title.trim().length > 3 && description.trim().length > 8, [
    title,
    description,
  ]);

  async function onSave() {
    if (!canSubmit) return;
    setSaving(true);
    try {
      // MVP mock — replace with API later.
      // En production, vous enverriez photoUri, videoUri et audioUri au backend
      // await uploadMedia(photoUri, videoUri, audioUri);
      // await createMainCouranteEvent({ title, description, siteName, priority, photoUri, videoUri, audioUri, audioDuration });
      
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
      Alert.alert("Permission requise", "Autorisez l'accès à la galerie pour ajouter une photo.");
      return;
    }
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (pick.canceled) return;
    setPhotoUri(pick.assets[0]?.uri ?? null);
    setVideoUri(null); // Clear video if photo is selected
    setAudioUri(null); // Clear audio if photo is selected
  }

  async function onAddVideo() {
    const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!res.granted) {
      Alert.alert("Permission requise", "Autorisez l'accès à la galerie pour ajouter une vidéo.");
      return;
    }
    const pick = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsEditing: true,
      videoMaxDuration: 300, // 5 minutes max
    });
    if (pick.canceled) return;
    setVideoUri(pick.assets[0]?.uri ?? null);
    setPhotoUri(null); // Clear photo if video is selected
    setAudioUri(null); // Clear audio if video is selected
  }

  async function onRecordVideo() {
    // Request camera permissions
    const cameraRes = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraRes.granted) {
      Alert.alert("Permission requise", "Autorisez l'accès à la caméra pour enregistrer une vidéo.");
      return;
    }

    // Request microphone permissions for video recording
    const micRes = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!micRes.granted) {
      Alert.alert("Permission requise", "Autorisez l'accès au microphone pour enregistrer une vidéo.");
      return;
    }

    const record = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      allowsEditing: true,
      videoMaxDuration: 300, // 5 minutes max
    });
    if (record.canceled) return;
    setVideoUri(record.assets[0]?.uri ?? null);
    setPhotoUri(null); // Clear photo if video is selected
    setAudioUri(null); // Clear audio if video is selected
  }

  async function onAddMedia() {
    if (Platform.OS === "ios") {
      // iOS ActionSheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Annuler", "Prendre une photo", "Choisir une photo", "Enregistrer une vidéo", "Choisir une vidéo"],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            // Take photo
            onTakePhoto();
          } else if (buttonIndex === 2) {
            // Choose photo
            onAddPhoto();
          } else if (buttonIndex === 3) {
            // Record video
            onRecordVideo();
          } else if (buttonIndex === 4) {
            // Choose video
            onAddVideo();
          }
        }
      );
    } else {
      // Android Alert
      Alert.alert(
        "Ajouter un média",
        "Choisissez une option",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Prendre une photo", onPress: onTakePhoto },
          { text: "Choisir une photo", onPress: onAddPhoto },
          { text: "Enregistrer une vidéo", onPress: onRecordVideo },
          { text: "Choisir une vidéo", onPress: onAddVideo },
        ]
      );
    }
  }

  async function onTakePhoto() {
    const res = await ImagePicker.requestCameraPermissionsAsync();
    if (!res.granted) {
      Alert.alert("Permission requise", "Autorisez l'accès à la caméra pour prendre une photo.");
      return;
    }
    const pick = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.85,
      allowsEditing: true,
    });
    if (pick.canceled) return;
    setPhotoUri(pick.assets[0]?.uri ?? null);
    setVideoUri(null); // Clear video if photo is selected
    setAudioUri(null); // Clear audio if photo is selected
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
            <Text className="text-sm font-medium text-foreground">Média (Photo / Vidéo)</Text>
            <View className="flex-row gap-2">
              <Button variant="outline" onPress={onAddMedia} className="flex-1">
                <Ionicons name="camera-outline" size={18} />
                <Text className="ml-2">Ajouter un média</Text>
              </Button>
              {(photoUri || videoUri) && (
                <Button
                  variant="outline"
                  onPress={() => {
                    setPhotoUri(null);
                    setVideoUri(null);
                  }}
                >
                  <Ionicons name="trash-outline" size={18} />
                </Button>
              )}
            </View>
            
            {photoUri ? (
              <View className="overflow-hidden rounded-xl border border-border">
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: "100%", height: 180 }}
                  contentFit="cover"
                />
              </View>
            ) : null}

            {videoUri ? (
              <VideoPlayer
                uri={videoUri}
                onRemove={() => setVideoUri(null)}
              />
            ) : null}

            <Text className="text-xs text-muted-foreground">
              MVP: média stocké localement (démo). Étape suivante: upload backend.
            </Text>
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-foreground">Message vocal</Text>
            <VoiceRecorder
              onRecordingComplete={(uri, duration) => {
                setAudioUri(uri);
                setAudioDuration(duration);
                setPhotoUri(null); // Clear photo if audio is selected
                setVideoUri(null); // Clear video if audio is selected
              }}
              onRemove={() => {
                setAudioUri(null);
                setAudioDuration(0);
              }}
              existingUri={audioUri}
            />
          </View>

          <Button onPress={onSave} disabled={!canSubmit || saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </Card>
      </ScrollView>
    </Screen>
  );
}

