import { PrismaPg } from "@prisma/adapter-pg";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../generated/prisma/client";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const SEED_ORG = {
  slug: "prodige-securite",
  name: "Prodige Securite",
  siret: "12345678900010",
  ape: "8010Z",
  address: "1 rue de la Sécurité, 75001 Paris",
  email: "prodigesecurite@gmail.com",
  phone: "+33749664004",
};

const SEED_OWNERS = [
  {
    email: "prodigesecurite@gmail.com",
    name: "chaffa belarbi",
    username: "chaffa",
  },
  {
    email: "khalil3cheddadi@gmail.com",
    name: "khalil cheddadi",
    username: "khalil",
  },
];

const SEED_REPRESENTATIVE = {
  firstName: "chaffa",
  lastName: "belarbi",
  email: "prodigesecurite@gmail.com",
  phone: "+33749664004",
  position: "Gérant",
};

type RequirementSeed = {
  type: string;
  name: string;
  category: string;
  isRequired: boolean;
  hasExpiry: boolean;
};

const DOCUMENT_REQUIREMENTS: RequirementSeed[] = [
  // Required
  {
    type: "cni_dirigeant",
    name: "CNI du dirigeant",
    category: "dirigeant",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "carte_pro_dirigeant",
    name: "Carte pro CNAPS du dirigeant",
    category: "dirigeant",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "carte_pro_entreprise",
    name: "Carte pro CNAPS de l'entreprise",
    category: "entreprise",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "kbis",
    name: "Kbis",
    category: "entreprise",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "urssaf",
    name: "Attestation de vigilance URSSAF",
    category: "attestations",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "fiscale",
    name: "Attestation de régularité Fiscale",
    category: "attestations",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "assurance_rc",
    name: "Attestation d'assurance RC PRO",
    category: "attestations",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "rib",
    name: "RIB",
    category: "bancaire",
    isRequired: true,
    hasExpiry: false,
  },
  // Optional
  {
    type: "statuts",
    name: "Statuts",
    category: "juridique",
    isRequired: false,
    hasExpiry: false,
  },
  {
    type: "pv_ag",
    name: "PV Assemblée Générale",
    category: "juridique",
    isRequired: false,
    hasExpiry: false,
  },
];

const ORG_TARGET = "ORGANIZATION";

const TABLES_IN_TRUNCATE_ORDER = [
  "document",
  "document_requirement",
  "twoFactor",
  "invitation",
  "member",
  "session",
  "account",
  "verification",
  "organization",
  "representative",
  "user",
];

async function resetDatabase(): Promise<void> {
  const list = TABLES_IN_TRUNCATE_ORDER.map((t) => `"${t}"`).join(", ");
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE;`,
  );
  console.log(`Truncated ${TABLES_IN_TRUNCATE_ORDER.length} tables.`);
}

async function main(): Promise<void> {
  await resetDatabase();

  const users = await Promise.all(
    SEED_OWNERS.map((owner) =>
      prisma.user.create({
        data: {
          id: randomUUID(),
          email: owner.email,
          name: owner.name,
          username: owner.username,
          displayUsername: owner.username,
          emailVerified: true,
          updatedAt: new Date(),
        },
      }),
    ),
  );

  const rep = await prisma.representative.create({
    data: SEED_REPRESENTATIVE,
  });

  const org = await prisma.organization.create({
    data: {
      id: randomUUID(),
      slug: SEED_ORG.slug,
      name: SEED_ORG.name,
      siret: SEED_ORG.siret,
      ape: SEED_ORG.ape,
      address: SEED_ORG.address,
      email: SEED_ORG.email,
      phone: SEED_ORG.phone,
      representativeId: rep.id,
      createdAt: new Date(),
    },
  });

  await prisma.member.createMany({
    data: users.map((u) => ({
      id: randomUUID(),
      organizationId: org.id,
      userId: u.id,
      role: "owner",
      createdAt: new Date(),
    })),
  });

  await prisma.documentRequirement.createMany({
    data: DOCUMENT_REQUIREMENTS.map((req) => ({
      name: req.name,
      type: req.type,
      category: req.category,
      targetType: ORG_TARGET,
      isRequired: req.isRequired,
      hasExpiry: req.hasExpiry,
    })),
  });

  console.log("Seed complete:");
  console.log(`  org:    ${org.id} (${org.slug})`);
  console.log(`  owners: ${users.map((u) => u.email).join(", ")}`);
  console.log(`  document requirements: ${DOCUMENT_REQUIREMENTS.length}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  });
