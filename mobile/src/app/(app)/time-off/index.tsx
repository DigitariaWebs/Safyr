import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Screen } from "@/components/ui";
import { mockTimeOff } from "@/features/timeoff/mock";
import { getTimeOffRequests, seedTimeOffIfEmpty } from "@/features/timeoff/timeoff.storage";
import type { TimeOffRequest } from "@/features/timeoff/types";

function labelForType(t: TimeOffRequest["type"]) {
  switch (t) {
    case "paid":
      return "Payé";
    case "unpaid":
      return "Sans solde";
    case "sick":
      return "Maladie";
    case "other":
    default:
      return "Autre";
  }
}

function labelForStatus(s: TimeOffRequest["status"]) {
  switch (s) {
    case "approved":
      return "Approuvé";
    case "rejected":
      return "Refusé";
    case "pending":
    default:
      return "En attente";
  }
}

export default function TimeOffScreen() {
  const [items, setItems] = useState<TimeOffRequest[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await seedTimeOffIfEmpty(mockTimeOff);
      const next = await getTimeOffRequests();
      if (mounted) setItems(next);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Screen>
      <Header
        title="Congés"
        subtitle="Historique & demandes"
        right={
          <View className="flex-row gap-2">
            <Button size="sm" onPress={() => router.push("/(app)/time-off/new")}>
              + Demander
            </Button>
            <Button variant="ghost" size="sm" onPress={() => router.back()}>
              Fermer
            </Button>
          </View>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-3">
          {items.map((r) => {
            const start = new Date(r.startIso);
            const end = new Date(r.endIso);
            return (
              <Card key={r.id} className="gap-2">
                <View className="flex-row items-center justify-between">
                  <Text className="text-base font-semibold text-foreground">
                    {labelForType(r.type)} • {labelForStatus(r.status)}
                  </Text>
                  <Text className="text-xs text-muted-foreground">
                    {new Date(r.createdAtIso).toLocaleDateString()}
                  </Text>
                </View>
                <Text className="text-sm text-muted-foreground">
                  {start.toLocaleDateString()} → {end.toLocaleDateString()}
                </Text>
                {r.reason ? (
                  <Text className="text-sm text-muted-foreground">{r.reason}</Text>
                ) : null}
              </Card>
            );
          })}
        </View>
      </ScrollView>
    </Screen>
  );
}

