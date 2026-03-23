import { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Mic, Play, Pause, Trash2 } from "lucide-react-native";

// Import conditionnel pour expo-audio
let expoAudio: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  expoAudio = require("expo-audio");
} catch {
  console.warn(
    "expo-audio not installed. Install with: npx expo install expo-audio",
  );
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
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const durationInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const recorderRef = useRef<any>(null);
  const playerRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    // Initialiser le mode audio
    if (expoAudio) {
      expoAudio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });
    }

    return () => {
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
      }
      if (playerRef.current) {
        playerRef.current.release();
        playerRef.current = null;
      }
    };
  }, []);

  // Charger le son si une URI existe
  useEffect(() => {
    if (!existingUri || !expoAudio) {
      if (playerRef.current) {
        playerRef.current.release();
        playerRef.current = null;
      }
      setIsPlaying(false);
      return;
    }

    // Créer un player pour l'URI existante
    if (playerRef.current) {
      playerRef.current.release();
    }

    const player = expoAudio.createAudioPlayer(existingUri);
    playerRef.current = player;

    // Écouter les changements de statut
    const subscription = player.addListener(
      "playbackStatusUpdate",
      (status: { playing?: boolean; didJustFinish?: boolean }) => {
        if (status.playing !== undefined) {
          setIsPlaying(status.playing);
        }
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      },
    );

    return () => {
      subscription?.remove();
      if (playerRef.current === player) {
        player.release();
        playerRef.current = null;
      }
    };
  }, [existingUri]);

  const startRecording = useCallback(async () => {
    if (!expoAudio) {
      Alert.alert(
        "Erreur",
        "expo-audio n'est pas installé. Installez-le avec: npx expo install expo-audio",
      );
      return;
    }

    try {
      // Demander les permissions
      const permissionResponse =
        await expoAudio.requestRecordingPermissionsAsync();
      if (permissionResponse.status !== "granted") {
        Alert.alert(
          "Permission requise",
          "Autorisez l'accès au microphone pour enregistrer un message vocal.",
        );
        return;
      }

      // Configurer le mode audio pour l'enregistrement
      await expoAudio.setAudioModeAsync({
        allowsRecording: true,
        playsInSilentMode: true,
      });

      // Créer et préparer le recorder
      const recorder = new expoAudio.AudioModule.AudioRecorder();
      await recorder.prepareToRecordAsync(
        expoAudio.RecordingPresets.HIGH_QUALITY,
      );
      recorderRef.current = recorder;

      setIsRecording(true);
      setDuration(0);

      // Démarrer le timer
      durationInterval.current = setInterval(() => {
        setDuration((prev: number) => prev + 1);
      }, 1000);

      recorder.record();
    } catch (error) {
      console.error("Error starting recording:", error);
      Alert.alert("Erreur", "Impossible de démarrer l'enregistrement");
    }
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;

    try {
      setIsRecording(false);
      if (durationInterval.current) {
        clearInterval(durationInterval.current);
        durationInterval.current = null;
      }

      await recorder.stop();
      const uri = recorder.uri;
      const finalDuration = recorder.currentDuration
        ? Math.floor(recorder.currentDuration / 1000)
        : duration;

      recorderRef.current = null;
      onRecordingComplete(uri || "", finalDuration);
    } catch (error) {
      console.error("Error stopping recording:", error);
      Alert.alert("Erreur", "Impossible d'arrêter l'enregistrement");
    }
  }, [duration, onRecordingComplete]);

  const togglePlayback = useCallback(async () => {
    const player = playerRef.current;
    if (!player || !existingUri) return;

    try {
      if (isPlaying) {
        player.pause();
      } else {
        player.play();
      }
    } catch (error) {
      console.error("Error toggling playback:", error);
      Alert.alert("Erreur", "Impossible de lire le message vocal");
    }
  }, [isPlaying, existingUri]);

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  // Si expo-audio n'est pas installé
  if (!expoAudio) {
    return (
      <View
        className={`rounded-xl border border-border bg-muted p-4 ${className || ""}`}
      >
        <View className="flex-row items-center gap-3">
          <Mic size={24} color="#94a3b8" />
          <View className="flex-1">
            <Text className="text-sm font-medium text-foreground">
              Message vocal non disponible
            </Text>
            <Text className="mt-1 text-xs text-muted-foreground">
              Installez expo-audio pour enregistrer des messages vocaux
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Si un enregistrement existe déjà
  if (existingUri) {
    return (
      <View
        className={`rounded-xl border border-border bg-card p-4 ${className || ""}`}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3 flex-1">
            <TouchableOpacity
              onPress={togglePlayback}
              className="rounded-full bg-primary p-3"
            >
              {isPlaying ? (
                <Pause size={20} color="#fff" />
              ) : (
                <Play size={20} color="#fff" />
              )}
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
              <Trash2 size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // Interface d'enregistrement
  return (
    <View
      className={`rounded-xl border border-border bg-card p-4 ${className || ""}`}
    >
      {isRecording ? (
        <View className="items-center gap-3">
          <View className="flex-row items-center gap-3">
            <View className="rounded-full bg-destructive p-3">
              <Mic size={24} color="#fff" />
            </View>
            <View className="items-center">
              <Text className="text-lg font-semibold text-foreground">
                {formatDuration(duration)}
              </Text>
              <Text className="text-xs text-muted-foreground">
                Enregistrement...
              </Text>
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
          <Mic size={20} color="#fff" />
          <Text className="font-medium text-white">
            Enregistrer un message vocal
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
