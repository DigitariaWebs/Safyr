import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface MagicLinkEmailProps {
  url: string;
  expiresInMinutes: number;
}

export function MagicLinkEmail({ url, expiresInMinutes }: MagicLinkEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre lien de connexion Safyr</Preview>
      <Body
        style={{
          backgroundColor: "#0f172a",
          fontFamily: "sans-serif",
          color: "#e2e8f0",
        }}
      >
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ color: "#22d3ee" }}>Connexion à Safyr</Heading>
          <Text>Cliquez sur le bouton ci-dessous pour vous connecter.</Text>
          <Section style={{ margin: "24px 0" }}>
            <Button
              href={url}
              style={{
                backgroundColor: "#22d3ee",
                color: "#0f172a",
                padding: "12px 24px",
                borderRadius: "8px",
                fontWeight: 600,
              }}
            >
              Se connecter
            </Button>
          </Section>
          <Text style={{ fontSize: "14px", color: "#94a3b8" }}>
            Ce lien expire dans {expiresInMinutes} minutes. Si vous n'avez pas
            demandé cette connexion, ignorez cet email.
          </Text>
          <Text
            style={{
              fontSize: "12px",
              color: "#64748b",
              wordBreak: "break-all",
            }}
          >
            {url}
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default MagicLinkEmail;
