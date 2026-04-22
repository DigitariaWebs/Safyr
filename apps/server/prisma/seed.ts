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
  slug: "safyr-demo",
  name: "Safyr Demo",
  siret: "12345678900010",
  ape: "8010Z",
  address: "1 rue de la Sécurité, 75001 Paris",
};

const SEED_OWNER = {
  email: "khalil3cheddadi@gmail.com",
  name: "Propriétaire Démo",
  username: "owner",
};

async function main(): Promise<void> {
  const user = await prisma.user.upsert({
    where: { email: SEED_OWNER.email },
    update: {},
    create: {
      id: randomUUID(),
      email: SEED_OWNER.email,
      name: SEED_OWNER.name,
      username: SEED_OWNER.username,
      displayUsername: SEED_OWNER.username,
      emailVerified: true,
      updatedAt: new Date(),
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: SEED_ORG.slug },
    update: {},
    create: {
      id: randomUUID(),
      slug: SEED_ORG.slug,
      name: SEED_ORG.name,
      siret: SEED_ORG.siret,
      ape: SEED_ORG.ape,
      address: SEED_ORG.address,
      createdAt: new Date(),
    },
  });

  const existingMember = await prisma.member.findFirst({
    where: { organizationId: org.id, userId: user.id },
  });
  if (!existingMember) {
    await prisma.member.create({
      data: {
        id: randomUUID(),
        organizationId: org.id,
        userId: user.id,
        role: "owner",
        createdAt: new Date(),
      },
    });
  }

  console.log("Seed complete:");
  console.log(`  org:   ${org.id} (${org.slug})`);
  console.log(`  owner: ${user.email}`);
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
