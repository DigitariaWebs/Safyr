import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OtpType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

interface OtpEmailProps {
  otp: string;
  type: OtpType;
  expiresInMinutes: number;
}

function getTitle(type: OtpType) {
  if (type === "email-verification") return "Vérification de votre e-mail";
  if (type === "forget-password") return "Réinitialisation de mot de passe";
  if (type === "change-email") return "Changement d'adresse e-mail";
  return "Connexion à Safyr";
}

export function OtpEmail({ otp, type, expiresInMinutes }: OtpEmailProps) {
  return (
    <Html lang="fr">
      <Head />
      <Preview>Votre code de vérification Safyr</Preview>
      <Body
        style={{
          backgroundColor: "#0f172a",
          fontFamily: "sans-serif",
          color: "#e2e8f0",
        }}
      >
        <Container style={{ padding: "32px", maxWidth: "560px" }}>
          <Heading style={{ color: "#22d3ee" }}>{getTitle(type)}</Heading>
          <Text>Utilisez ce code pour continuer :</Text>
          <Section
            style={{
              margin: "24px 0",
              borderRadius: "10px",
              backgroundColor: "#1e293b",
              border: "1px solid #334155",
              padding: "18px",
            }}
          >
            <Text
              style={{
                margin: 0,
                letterSpacing: "0.3em",
                textAlign: "center",
                fontSize: "28px",
                fontWeight: 700,
                color: "#22d3ee",
              }}
            >
              {otp}
            </Text>
          </Section>
          <Text style={{ fontSize: "14px", color: "#94a3b8" }}>
            Ce code expire dans {expiresInMinutes} minutes. Si vous n&apos;êtes
            pas à l&apos;origine de cette demande, ignorez cet e-mail.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OtpEmail;
