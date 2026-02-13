import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Header, Screen } from "@/components/ui";
import { mockPayslip } from "@/features/payroll/mock";

function formatMoney(amount: number) {
  return amount.toLocaleString(undefined, { style: "currency", currency: "EUR" });
}

export default function PayrollScreen() {
  const p = mockPayslip;
  return (
    <Screen>
      <Header
        title="Paie"
        subtitle={`Bulletin • ${p.periodLabel}`}
        right={
          <Button variant="ghost" size="sm" onPress={() => router.back()}>
            Fermer
          </Button>
        }
      />

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <View className="gap-3">
          <Card className="gap-2">
            <Text className="text-base font-semibold text-foreground">Résumé</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Heures</Text>
              <Text className="text-sm font-semibold text-foreground">{p.hours} h</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Brut</Text>
              <Text className="text-sm font-semibold text-foreground">{formatMoney(p.gross)}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-sm text-muted-foreground">Net à payer</Text>
              <Text className="text-sm font-semibold text-foreground">{formatMoney(p.net)}</Text>
            </View>
          </Card>

          <Card className="gap-2">
            <Text className="text-base font-semibold text-foreground">Détails</Text>
            {p.lines.map((l) => (
              <View key={l.label} className="flex-row items-center justify-between py-1">
                <Text className="text-sm text-muted-foreground">{l.label}</Text>
                <Text className="text-sm font-semibold text-foreground">{formatMoney(l.amount)}</Text>
              </View>
            ))}
            <Text className="mt-2 text-xs text-muted-foreground">
              MVP: données mock. Étape suivante: récupération backend + téléchargement PDF.
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Screen>
  );
}

