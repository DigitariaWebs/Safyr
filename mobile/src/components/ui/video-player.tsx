import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { Video as VideoIcon, Play, Pause, X } from "lucide-react-native";

// Import conditionnel pour expo-av
let VideoComponent: React.ComponentType<Record<string, unknown>> | null = null;
let useVideoPlayerHook:
  | ((
      uri: string,
      setup: (player: { loop: boolean }) => void,
    ) => { playing: boolean; play: () => void; pause: () => void })
  | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const expoAv = require("expo-av");
  VideoComponent = expoAv.Video;
  useVideoPlayerHook = expoAv.useVideoPlayer;
} catch {
  // expo-av not installed
}

interface VideoPlayerProps {
  uri: string;
  onRemove?: () => void;
  className?: string;
}

function VideoPlayerFallback({ uri, onRemove, className }: VideoPlayerProps) {
  return (
    <View
      className={`relative overflow-hidden rounded-xl border border-border bg-muted ${className ?? ""}`}
    >
      <TouchableOpacity
        onPress={() => Linking.openURL(uri).catch(() => {})}
        className="aspect-video items-center justify-center"
      >
        <VideoIcon size={48} color="#34d399" />
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
          <X size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

function VideoPlayerWithAv({ uri, onRemove, className }: VideoPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const player = useVideoPlayerHook!(uri, (p) => {
    p.loop = false;
  });

  const Video = VideoComponent!;

  const togglePlayPause = () => {
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <View
      className={`relative overflow-hidden rounded-xl border border-border bg-black ${className ?? ""}`}
    >
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
              {player.playing ? (
                <Pause size={32} color="#fff" />
              ) : (
                <Play size={32} color="#fff" />
              )}
            </View>
          </View>
        )}
      </TouchableOpacity>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          className="absolute right-2 top-2 rounded-full bg-destructive p-2"
        >
          <X size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export function VideoPlayer(props: VideoPlayerProps) {
  if (!VideoComponent || !useVideoPlayerHook) {
    return <VideoPlayerFallback {...props} />;
  }
  return <VideoPlayerWithAv {...props} />;
}
