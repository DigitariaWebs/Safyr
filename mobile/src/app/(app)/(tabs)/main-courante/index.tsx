import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Screen, VideoPlayer, VoiceRecorder } from "@/components/ui";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { mockMainCourante } from "@/features/mainCourante/mock";
import type { MainCouranteEvent } from "@/features/mainCourante/types";

function PriorityPill({ priority }: { priority: MainCouranteEvent["priority"] }) {
  const style =
    priority === "high"
      ? "bg-destructive/15"
      : priority === "medium"
        ? "bg-warning/15"
        : "bg-muted";
  const label = priority === "high" ? "Urgent" : priority === "medium" ? "Moyen" : "Info";

  return (
    <View className={`rounded-full px-3 py-1 ${style}`}>
      <Text className="text-xs font-medium text-foreground">{label}</Text>
    </View>
  );
}

export default function MainCouranteListScreen() {
  return (
    <Screen>
      <Header
        title="Main Courante"
        subtitle="Événements & compte-rendus"
        right={<Button size="sm" onPress={() => router.push("/(app)/main-courante/new")}>+ Nouveau</Button>}
      />

      <FlatList
        data={mockMainCourante}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable>
            <Card className="gap-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-foreground">
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm text-muted-foreground">
                    {item.siteName}
                  </Text>
                </View>
                <PriorityPill priority={item.priority} />
              </View>

              <Text className="text-sm text-foreground/90">{item.description}</Text>

              {/* Afficher la photo si présente */}
              {item.photoUri && (
                <View className="overflow-hidden rounded-xl border border-border">
                  <Image
                    source={{ uri: item.photoUri }}
                    style={{ width: "100%", height: 180 }}
                    contentFit="cover"
                  />
                </View>
              )}

              {/* Afficher la vidéo si présente */}
              {item.videoUri && (
                <VideoPlayer uri={item.videoUri} />
              )}

              {/* Afficher le message vocal si présent */}
              {item.audioUri && (
                <VoiceRecorder
                  existingUri={item.audioUri}
                />
              )}

              {/* Indicateur de média */}
              {(item.photoUri || item.videoUri || item.audioUri) && (
                <View className="flex-row items-center gap-2">
                  {item.photoUri && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="image-outline" size={14} color="#94a3b8" />
                      <Text className="text-xs text-muted-foreground">Photo</Text>
                    </View>
                  )}
                  {item.videoUri && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="videocam-outline" size={14} color="#94a3b8" />
                      <Text className="text-xs text-muted-foreground">Vidéo</Text>
                    </View>
                  )}
                  {item.audioUri && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="mic-outline" size={14} color="#94a3b8" />
                      <Text className="text-xs text-muted-foreground">
                        Audio {item.audioDuration ? `(${Math.floor(item.audioDuration / 60)}:${(item.audioDuration % 60).toString().padStart(2, "0")})` : ""}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View className="flex-row justify-between">
                <Text className="text-xs text-muted-foreground">
                  Statut: {item.status === "open" ? "Ouvert" : "Clôturé"}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {new Date(item.createdAtIso).toLocaleString()}
                </Text>
              </View>
            </Card>
          </Pressable>
        )}
      />
    </Screen>
  );
}

