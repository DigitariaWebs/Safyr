import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Import conditionnel pour expo-av
let Video: any = null;
let useVideoPlayer: any = null;

try {
  // @ts-ignore
  const expoAv = require("expo-av");
  Video = expoAv.Video;
  useVideoPlayer = expoAv.useVideoPlayer;
} catch (e) {
  console.warn("expo-av not installed. Install with: npx expo install expo-av");
}

interface VideoPlayerProps {
  uri: string;
  thumbnailUri?: string;
  onRemove?: () => void;
  className?: string;
}

export function VideoPlayer({ uri, thumbnailUri, onRemove, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  // Si expo-av n'est pas installé, afficher un placeholder avec possibilité d'ouvrir la vidéo
  if (!Video || !useVideoPlayer) {
    return (
      <View className={`relative overflow-hidden rounded-xl border border-border bg-muted ${className || ""}`}>
        <TouchableOpacity
          onPress={() => Linking.openURL(uri).catch(() => {})}
          className="aspect-video items-center justify-center"
        >
          <Ionicons name="videocam-outline" size={48} color="#16a34a" />
          <Text className="mt-2 text-sm font-medium text-foreground">
            Vidéo sélectionnée
          </Text>
          <Text className="mt-1 text-xs text-muted-foreground">
            Appuyez pour ouvrir
          </Text>
          <Text className="mt-1 text-xs text-muted-foreground">
            Installez expo-av pour la lecture intégrée
          </Text>
        </TouchableOpacity>
        {onRemove && (
          <TouchableOpacity
            onPress={onRemove}
            className="absolute right-2 top-2 rounded-full bg-destructive p-2"
          >
            <Ionicons name="close" size={16} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  // Utiliser le hook useVideoPlayer
  const player = useVideoPlayer(uri, (player) => {
    player.loop = false;
  });

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View className={`relative overflow-hidden rounded-xl border border-border bg-black ${className || ""}`}>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={togglePlayPause}
        className="aspect-video"
      >
        <Video
          player={player}
          style={{ width: "100%", height: "100%" }}
          contentFit="contain"
          nativeControls={false}
          onLoadStart={() => setIsLoading(true)}
          onLoad={() => setIsLoading(false)}
        />
        
        {isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/50">
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {!isLoading && (
          <View className="absolute inset-0 items-center justify-center bg-black/20">
            <View className="rounded-full bg-white/20 p-4">
              <Ionicons
                name={player.playing ? "pause" : "play"}
                size={32}
                color="#fff"
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute right-2 top-2 rounded-full bg-destructive p-2"
        >
          <Ionicons name="close" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
