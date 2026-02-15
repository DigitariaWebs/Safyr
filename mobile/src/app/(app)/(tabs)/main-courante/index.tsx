import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, MenuButton, Screen, VideoPlayer, VoiceRecorder } from "@/components/ui";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { mockMainCourante } from "@/features/mainCourante/mock";
import type { MainCouranteEvent } from "@/features/mainCourante/types";
import { useTheme } from "@/theme";
import { getMontserratFont } from "@/utils/text-style";

function PriorityPill({ priority }: { priority: MainCouranteEvent["priority"] }) {
  const { colors } = useTheme();
  const style =
    priority === "high"
      ? "bg-destructive/15"
      : priority === "medium"
        ? "bg-warning/15"
        : "bg-muted";
  const label = priority === "high" ? "Urgent" : priority === "medium" ? "Moyen" : "Info";

  return (
    <View className={`rounded-full px-3 py-1 ${style}`}>
      <Text className="text-xs font-medium" style={{ color: colors.foreground }}>{label}</Text>
    </View>
  );
}

export default function MainCouranteListScreen() {
  const { colors } = useTheme();
  
  return (
    <Screen>
      <Header
        title="Main Courante"
        subtitle="Événements & compte-rendus"
        left={<MenuButton />}
        right={
          <Button size="sm" onPress={() => router.push("/(app)/main-courante/new")}>
            <Ionicons name="add-circle-outline" size={18} color={colors.primaryForeground} />
            <Text className="ml-1" style={{ color: colors.primaryForeground }}>Nouveau</Text>
          </Button>
        }
      />

      <FlatList
        data={mockMainCourante}
        keyExtractor={(i) => i.id}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable>
            <Card className="gap-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text className="text-base font-semibold" style={{ color: colors.foreground }}>
                    {item.title}
                  </Text>
                  <Text className="mt-1 text-sm" style={{ color: colors.foreground }}>
                    {item.siteName}
                  </Text>
                </View>
                <PriorityPill priority={item.priority} />
              </View>

              <Text className="text-sm" style={{ color: colors.foreground }}>{item.description}</Text>

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
                      <Ionicons name="image-outline" size={14} color={colors.foreground} />
                      <Text className="text-xs" style={{ color: colors.foreground }}>Photo</Text>
                    </View>
                  )}
                  {item.videoUri && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="videocam-outline" size={14} color={colors.foreground} />
                      <Text className="text-xs" style={{ color: colors.foreground }}>Vidéo</Text>
                    </View>
                  )}
                  {item.audioUri && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="mic-outline" size={14} color={colors.foreground} />
                      <Text className="text-xs" style={{ color: colors.foreground }}>
                        Audio {item.audioDuration ? `(${Math.floor(item.audioDuration / 60)}:${(item.audioDuration % 60).toString().padStart(2, "0")})` : ""}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View className="flex-row justify-between">
                <Text className="text-xs" style={{ color: colors.foreground }}>
                  Statut: {item.status === "open" ? "Ouvert" : "Clôturé"}
                </Text>
                <Text className="text-xs" style={{ color: colors.foreground }}>
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

