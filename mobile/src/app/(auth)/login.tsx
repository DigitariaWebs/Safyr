import { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import { router } from "expo-router";
import { Button, Card, Input, Screen } from "@/components/ui";
import { setSession } from "@/features/auth/auth.storage";
import { getMontserratFont } from "@/utils/text-style";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => email.trim().length > 3 && password.length > 2, [
    email,
    password,
  ]);

  async function onSubmit() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      // MVP mock auth — replace with real API later.
      await new Promise((r) => setTimeout(r, 700));
      await setSession({ userId: "agent_001", fullName: "Agent Demo" });
      router.replace("/(app)/(tabs)");
    } catch (e) {
      Alert.alert("Connexion impossible", "Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen contentClassName="flex-1 px-4">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-3xl font-semibold text-foreground" style={{ fontFamily: getMontserratFont("600") }}>Safyr</Text>
            <Text className="mt-2 text-sm text-muted-foreground" style={{ fontFamily: getMontserratFont("400") }}>
              Connectez-vous à votre espace agent
            </Text>
          </View>

          <Card className="gap-4">
            <View>
              <Text className="mb-2 text-sm font-medium text-foreground" style={{ fontFamily: getMontserratFont("500") }}>Email</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                placeholder="prenom.nom@entreprise.com"
                returnKeyType="next"
              />
            </View>

            <View>
              <Text className="mb-2 text-sm font-medium text-foreground" style={{ fontFamily: getMontserratFont("500") }}>Mot de passe</Text>
              <Input
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={onSubmit}
              />
            </View>

            <Button
              onPress={onSubmit}
              disabled={!canSubmit || loading}
              className="mt-2"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </Button>

            <Text className="text-xs text-muted-foreground" style={{ fontFamily: getMontserratFont("400") }}>
              Mode démo: entrez n'importe quel email + mot de passe.
            </Text>
          </Card>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

