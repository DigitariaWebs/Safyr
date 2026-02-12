import { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import conditionnel pour expo-av
let Audio: any = null;
let Recording: any = null;

try {
  // @ts-ignore
  const expoAv = require("expo-av");
  Audio = expoAv.Audio;
  Recording = expoAv.Recording;
} catch (e) {
  console.warn("expo-av not installed. Install with: npx expo install expo-av");
}

interface VoiceRecorderProps {
  onRecordingComplete: (uri: string, duration: number) => void;
  onRemove?: () => void;
  existingUri?: string | null;
  className?: string;
}

export function VoiceRecorder({
  onRecordingComplete,
  onRemove,
  existingUri,
  className,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recording, setRecording] = useState<any>(null);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [sound, setSound] = useState<any>(null);
  const [playbackStatus, setPlaybackStatus] = useState<any>(null);
  const durationInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialiser le mode audio
    if (Audio) {
      Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => {});
      }
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, []);

  // Charger le son si une URI existe
  useEffect(() => {
    let isMounted = true;
    let currentSound: any = null;

    async function loadSound() {
      if (!existingUri || !Audio) {
        if (sound) {
          sound.unloadAsync().catch(() => {});
          setSound(null);
        }
        return;
      }

      try {
        // Décharger le son précédent s'il existe
        if (sound) {
          await sound.unloadAsync().catch(() => {});
        }

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: existingUri },
          { shouldPlay: false },
          (status) => {
            if (isMounted) {
              setPlaybackStatus(status);
              if (status.isLoaded) {
                setIsPlaying(status.isPlaying);
                if (status.didJustFinish) {
                  setIsPlaying(false);
                }
              }
            }
          }
        );
        if (isMounted) {
          currentSound = newSound;
          setSound(newSound);
        }
      } catch (error) {
        console.error("Error loading sound:", error);
        if (isMounted) {
          setSound(null);
        }
      }
    }

    loadSound();

    return () => {
      isMounted = false;
      if (currentSound) {
        currentSound.unloadAsync().catch(() => {});
      }
    };
  }, [existingUri]);

  async function startRecording() {
    if (!Recording) {
      Alert.alert(
        "Erreur",
        "expo-av n'est pas installé. Installez-le avec: npx expo install expo-av"
      );
      return;
    }

    try {
      // Demander les permissions
      const permissionResponse = await Audio.requestPermissionsAsync();
      if (permissionResponse.status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Autorisez l'accès au microphone pour enregistrer un message vocal."
        );
        return;
      }

      // Configurer l'enregistrement
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording: newRecording } = await Recording.createAsync(
        Recording.OptionsPresets.HIGH_QUALITY
      );

      setRecording(newRecording);
      setIsRecording(true);
      setDuration(0);

      // Démarrer le timer
      durationInterval.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      await newRecording.startAsync();
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
    }
  }

  async function stopRecording() {
    if (!recording) return;

    try {
      setIsRecording(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      const status = await recording.getStatusAsync();
      const finalDuration = status.durationMillis
        ? Math.floor(status.durationMillis / 1000)
        : duration;

      setRecording(null);
      onRecordingComplete(uri || "", finalDuration);
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Erreur", "Impossible d'arrêter l'enregistrement");
    }
  }

  async function togglePlayback() {
    if (!sound || !existingUri) return;

    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      Alert.alert("Erreur", "Impossible de lire le message vocal");
    }
  }

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Si expo-av n'est pas installé
  if (!Recording || !Audio) {
    return (
      <View className={`rounded-xl border border-border bg-muted p-4 ${className || ""}`}>
        <View className="flex-row items-center gap-3">
          <Ionicons name="mic-outline" size={24} color="#94a3b8" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">
              Message vocal non disponible
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              Installez expo-av pour enregistrer des messages vocaux
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Si un enregistrement existe déjà
  if (existingUri) {
    return (
      <View className={`rounded-xl border border-border bg-card p-4 ${className || ""}`}>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <TouchableOpacity
              onPress={togglePlayback}
              className="rounded-full bg-primary p-3"
            >
              <Ionicons
                name={isPlaying ? "pause" : "play"}
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-sm font-medium text-foreground">
                Message vocal
              </Text>
              <Text className="text-xs text-muted-foreground">
                Appuyez pour écouter
              </Text>
            </View>
          </View>
          {onRemove && (
            <TouchableOpacity
              onPress={onRemove}
              className="rounded-full bg-destructive p-2"
            >
              <Ionicons name="trash-outline" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Interface d'enregistrement
  return (
    <View className={`rounded-xl border border-border bg-card p-4 ${className || ""}`}>
      {isRecording ? (
        <View className="items-center gap-3">
          <View className="flex-row items-center gap-3">
            <View className="rounded-full bg-destructive p-3">
              <Ionicons name="mic" size={24} color="#fff" />
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-foreground">
                {formatDuration(duration)}
              </Text>
              <Text className="text-xs text-muted-foreground">Enregistrement...</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={stopRecording}
            className="rounded-full bg-destructive px-6 py-3"
          >
            <Text className="font-medium text-white">Arrêter</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={startRecording}
          className="flex-row items-center justify-center gap-3 rounded-lg bg-primary px-4 py-3"
        >
          <Ionicons name="mic" size={20} color="#fff" />
          <Text className="font-medium text-white">Enregistrer un message vocal</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
