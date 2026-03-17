import { FlatList, Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import {
  Button,
  Card,
  Header,
  MenuButton,
  Screen,
  VideoPlayer,
  VoiceRecorder,
} from "@/components/ui";
import { Image } from "expo-image";
import {
  PlusCircle,
  Image as ImageIcon,
  Video,
  Mic,
} from "lucide-react-native";
import { mockMainCourante } from "@/features/mainCourante/mock";
import type { MainCouranteEvent } from "@/features/mainCourante/types";
import { useTheme } from "@/theme";
import { getBodyFont } from "@/utils/fonts";

function PriorityPill({
  priority,
}: {
  priority: MainCouranteEvent["priority"];
}) {
  const { colors } = useTheme();
  const style =
    priority === "high"
      ? "bg-destructive/15"
      : priority === "medium"
        ? "bg-warning/15"
        : "bg-muted";
  const label =
    priority === "high" ? "Urgent" : priority === "medium" ? "Moyen" : "Info";

  return (
    <View className={`rounded-full px-3 py-1 ${style}`}>
      <Text
        className="text-xs font-medium"
        style={{ color: colors.foreground }}
      >
        {label}
      </Text>
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
          <Button
            size="sm"
            onPress={() => router.push("/(app)/main-courante/new")}
          >
            <PlusCircle size={18} color={colors.primaryForeground} />
            <Text className="ml-1" style={{ color: colors.primaryForeground }}>
              Nouveau
            </Text>
          </Button>
        }
      />

      <FlatList
        data={mockMainCourante}
        keyExtractor={(i) => i.id}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
        ListEmptyComponent={
          <Card className="items-center gap-2 mt-4">
            <Text
              style={{
                fontSize: 14,
                color: colors.mutedForeground,
                fontFamily: getBodyFont("400"),
              }}
            >
              Aucun événement enregistré
            </Text>
          </Card>
        }
        ItemSeparatorComponent={() => <View className="h-3" />}
        renderItem={({ item }) => (
          <Pressable>
            <Card className="gap-3">
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text
                    numberOfLines={1}
                    className="text-base font-semibold"
                    style={{ color: colors.foreground }}
                  >
                    {item.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="mt-1 text-sm"
                    style={{ color: colors.foreground }}
                  >
                    {item.siteName}
                  </Text>
                </View>
                <PriorityPill priority={item.priority} />
              </View>

              <Text
                numberOfLines={2}
                className="text-sm"
                style={{ color: colors.foreground }}
              >
                {item.description}
              </Text>

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
              {item.videoUri && <VideoPlayer uri={item.videoUri} />}

              {/* Afficher le message vocal si présent */}
              {item.audioUri && (
                <VoiceRecorder
                  existingUri={item.audioUri}
                  onRecordingComplete={() => {}}
                />
              )}

              {/* Indicateur de média */}
              {(item.photoUri || item.videoUri || item.audioUri) && (
                <View className="flex-row items-center gap-2">
                  {item.photoUri && (
                    <View className="flex-row items-center gap-1">
                      <ImageIcon size={14} color={colors.foreground} />
                      <Text
                        className="text-xs"
                        style={{ color: colors.foreground }}
                      >
                        Photo
                      </Text>
                    </View>
                  )}
                  {item.videoUri && (
                    <View className="flex-row items-center gap-1">
                      <Video size={14} color={colors.foreground} />
                      <Text
                        className="text-xs"
                        style={{ color: colors.foreground }}
                      >
                        Vidéo
                      </Text>
                    </View>
                  )}
                  {item.audioUri && (
                    <View className="flex-row items-center gap-1">
                      <Mic size={14} color={colors.foreground} />
                      <Text
                        className="text-xs"
                        style={{ color: colors.foreground }}
                      >
                        Audio{" "}
                        {item.audioDuration
                          ? `(${Math.floor(item.audioDuration / 60)}:${(item.audioDuration % 60).toString().padStart(2, "0")})`
                          : ""}
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
