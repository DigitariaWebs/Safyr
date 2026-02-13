import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Screen } from "@/components/ui";
import { mockShifts } from "@/features/schedule/mock";
import { formatHours, workedMinutesForShift } from "@/features/schedule/utils";

export default function ScheduleScreen() {
  const totalMinutes = mockShifts.reduce((acc, s) => acc + workedMinutesForShift(s), 0);

  return (
    <Screen>
      <Header
        title="Emploi du temps"
        subtitle={`Heures prévues: ${formatHours(totalMinutes)}`}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-3">
          {mockShifts.map((s) => {
            const worked = workedMinutesForShift(s);
            const start = new Date(s.startIso);
            const end = new Date(s.endIso);
            return (
              <Card key={s.id} className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-foreground">{s.siteName}</Text>
                  <Text className="text-sm text-muted-foreground">{formatHours(worked)}</Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {start.toLocaleDateString()} • {start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} →{" "}
                  {end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  Pause: {s.breakMinutes} min
                </Text>
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

