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

type EmployeeSeed = {
  email: string;
  name: string;
  username?: string;
  role: "owner" | "agent";
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: Date;
  birthPlace: string;
  nationality: string;
  gender: "male" | "female" | "other";
  civilStatus: "single" | "married" | "divorced" | "widowed" | "civil-union";
  children: number;
  socialSecurityNumber: string;
  employeeNumber: string;
  hireDate: Date;
  position: string;
  contractType: "CDI" | "CDD" | "INTERIM" | "APPRENTICESHIP" | "INTERNSHIP";
  workSchedule: "full-time" | "part-time";
  status: "active" | "inactive" | "suspended" | "terminated";
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  bankDetails: { iban: string; bic: string; bankName: string };
};

const SEED_OWNERS: EmployeeSeed[] = [
  {
    email: "prodigesecurite@gmail.com",
    name: "Chaffa Belarbi",
    username: "chaffa",
    role: "owner",
    firstName: "Chaffa",
    lastName: "Belarbi",
    phone: "+33749664004",
    birthDate: new Date("1982-03-12"),
    birthPlace: "Alger",
    nationality: "Française",
    gender: "male",
    civilStatus: "married",
    children: 2,
    socialSecurityNumber: "182037599123456",
    employeeNumber: "OWN001",
    hireDate: new Date("2018-01-05"),
    position: "Gérant",
    contractType: "CDI",
    workSchedule: "full-time",
    status: "active",
    address: {
      street: "1 rue de la Sécurité",
      city: "Paris",
      postalCode: "75001",
      country: "France",
    },
    bankDetails: {
      iban: "FR7630006000011234567890111",
      bic: "BNPAFRPPXXX",
      bankName: "BNP Paribas",
    },
  },
  {
    email: "khalil3cheddadi@gmail.com",
    name: "Khalil Cheddadi",
    username: "khalil",
    role: "owner",
    firstName: "Khalil",
    lastName: "Cheddadi",
    phone: "+33612345601",
    birthDate: new Date("1990-07-22"),
    birthPlace: "Casablanca",
    nationality: "Française",
    gender: "male",
    civilStatus: "single",
    children: 0,
    socialSecurityNumber: "190077599223412",
    employeeNumber: "OWN002",
    hireDate: new Date("2020-06-10"),
    position: "Directeur technique",
    contractType: "CDI",
    workSchedule: "full-time",
    status: "active",
    address: {
      street: "10 avenue de l'Opéra",
      city: "Paris",
      postalCode: "75009",
      country: "France",
    },
    bankDetails: {
      iban: "FR7630006000011234567890222",
      bic: "SOGEFRPPXXX",
      bankName: "Société Générale",
    },
  },
];

const SEED_AGENTS: EmployeeSeed[] = [
  {
    email: "marie.dupont@prodige-securite.fr",
    name: "Marie Dupont",
    role: "agent",
    firstName: "Marie",
    lastName: "Dupont",
    phone: "+33612345602",
    birthDate: new Date("1995-04-18"),
    birthPlace: "Lyon",
    nationality: "Française",
    gender: "female",
    civilStatus: "single",
    children: 0,
    socialSecurityNumber: "295046901234523",
    employeeNumber: "EMP101",
    hireDate: new Date("2023-03-01"),
    position: "Agent de sécurité",
    contractType: "CDI",
    workSchedule: "full-time",
    status: "active",
    address: {
      street: "25 rue Bellecour",
      city: "Lyon",
      postalCode: "69002",
      country: "France",
    },
    bankDetails: {
      iban: "FR7612345678901234567890333",
      bic: "CRLYFRPPXXX",
      bankName: "Crédit Lyonnais",
    },
  },
  {
    email: "thomas.martin@prodige-securite.fr",
    name: "Thomas Martin",
    role: "agent",
    firstName: "Thomas",
    lastName: "Martin",
    phone: "+33612345603",
    birthDate: new Date("1988-11-02"),
    birthPlace: "Marseille",
    nationality: "Française",
    gender: "male",
    civilStatus: "married",
    children: 1,
    socialSecurityNumber: "188111301234578",
    employeeNumber: "EMP102",
    hireDate: new Date("2022-09-15"),
    position: "Chef d'équipe",
    contractType: "CDI",
    workSchedule: "full-time",
    status: "active",
    address: {
      street: "48 La Canebière",
      city: "Marseille",
      postalCode: "13001",
      country: "France",
    },
    bankDetails: {
      iban: "FR7620041010050500013M02606",
      bic: "PSSTFRPPXXX",
      bankName: "La Banque Postale",
    },
  },
  {
    email: "sophie.leroy@prodige-securite.fr",
    name: "Sophie Leroy",
    role: "agent",
    firstName: "Sophie",
    lastName: "Leroy",
    phone: "+33612345604",
    birthDate: new Date("1999-06-25"),
    birthPlace: "Toulouse",
    nationality: "Française",
    gender: "female",
    civilStatus: "single",
    children: 0,
    socialSecurityNumber: "299063101234590",
    employeeNumber: "EMP103",
    hireDate: new Date("2024-01-10"),
    position: "Agent SSIAP",
    contractType: "CDD",
    workSchedule: "part-time",
    status: "active",
    address: {
      street: "12 place du Capitole",
      city: "Toulouse",
      postalCode: "31000",
      country: "France",
    },
    bankDetails: {
      iban: "FR7610107001011234567890123",
      bic: "BDFEFRPPXXX",
      bankName: "Banque Populaire",
    },
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

const MEMBER_DOCUMENT_REQUIREMENTS: RequirementSeed[] = [
  {
    type: "id_card",
    name: "Carte d'identité",
    category: "identite",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "health_card",
    name: "Carte Vitale",
    category: "identite",
    isRequired: true,
    hasExpiry: false,
  },
  {
    type: "cv",
    name: "CV",
    category: "recrutement",
    isRequired: false,
    hasExpiry: false,
  },
  {
    type: "proof_address",
    name: "Justificatif de domicile",
    category: "identite",
    isRequired: true,
    hasExpiry: true,
  },
  {
    type: "dpae",
    name: "DPAE",
    category: "contrat",
    isRequired: true,
    hasExpiry: false,
  },
  {
    type: "due",
    name: "DUE",
    category: "contrat",
    isRequired: false,
    hasExpiry: false,
  },
  {
    type: "carte_pro_member",
    name: "Carte professionnelle CNAPS",
    category: "certification",
    isRequired: true,
    hasExpiry: true,
  },
];

const ORG_TARGET = "ORGANIZATION";
const MEMBER_TARGET = "MEMBER";

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

  const allSeeds: EmployeeSeed[] = [...SEED_OWNERS, ...SEED_AGENTS];

  for (const s of allSeeds) {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email: s.email,
        name: s.name,
        username: s.username,
        displayUsername: s.username,
        emailVerified: true,
        updatedAt: new Date(),
      },
    });

    await prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: org.id,
        userId: user.id,
        role: s.role,
        createdAt: new Date(),
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
        phone: s.phone,
        birthDate: s.birthDate,
        birthPlace: s.birthPlace,
        nationality: s.nationality,
        gender: s.gender,
        civilStatus: s.civilStatus,
        children: s.children,
        socialSecurityNumber: s.socialSecurityNumber,
        employeeNumber: s.employeeNumber,
        hireDate: s.hireDate,
        position: s.position,
        contractType: s.contractType,
        workSchedule: s.workSchedule,
        status: s.status,
        addressRecord: { create: s.address },
        bankDetails: { create: s.bankDetails },
      },
    });
  }

  await prisma.documentRequirement.createMany({
    data: [
      ...DOCUMENT_REQUIREMENTS.map((req) => ({
        name: req.name,
        type: req.type,
        category: req.category,
        targetType: ORG_TARGET,
        isRequired: req.isRequired,
        hasExpiry: req.hasExpiry,
      })),
      ...MEMBER_DOCUMENT_REQUIREMENTS.map((req) => ({
        name: req.name,
        type: req.type,
        category: req.category,
        targetType: MEMBER_TARGET,
        isRequired: req.isRequired,
        hasExpiry: req.hasExpiry,
      })),
    ],
  });

  console.log("Seed complete:");
  console.log(`  org:    ${org.id} (${org.slug})`);
  console.log(`  owners: ${SEED_OWNERS.map((o) => o.email).join(", ")}`);
  console.log(`  agents: ${SEED_AGENTS.map((a) => a.email).join(", ")}`);
  console.log(
    `  document requirements: ${DOCUMENT_REQUIREMENTS.length + MEMBER_DOCUMENT_REQUIREMENTS.length} (org: ${DOCUMENT_REQUIREMENTS.length}, member: ${MEMBER_DOCUMENT_REQUIREMENTS.length})`,
  );
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
