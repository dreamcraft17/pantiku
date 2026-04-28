import bcrypt from "bcryptjs";
import { OrphanageVerificationStatus, PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();
const DEFAULT_PASSWORD = "password123";

type SeedUserInput = {
  email: string;
  fullName: string;
  role: UserRole;
  city?: string;
  phone?: string;
  skills?: string;
};

const seedUsers: SeedUserInput[] = [
  {
    email: "donor@test.com",
    fullName: "Donor Tester",
    role: UserRole.DONOR,
    city: "Jakarta",
  },
  {
    email: "panti@test.com",
    fullName: "Manager Panti Tester",
    role: UserRole.ORPHANAGE_MANAGER,
    city: "Bandung",
    phone: "081200000001",
  },
  {
    email: "volunteer@test.com",
    fullName: "Volunteer Tester",
    role: UserRole.VOLUNTEER,
    city: "Surabaya",
    skills: "Mentoring, Desain, Public Speaking",
  },
  {
    email: "admin@test.com",
    fullName: "Admin Tester",
    role: UserRole.ADMIN,
    city: "Jakarta",
  },
];

async function upsertSeedUser(input: SeedUserInput, passwordHash: string) {
  return prisma.user.upsert({
    where: { email: input.email },
    update: {
      fullName: input.fullName,
      role: input.role,
      password: passwordHash,
      city: input.city,
      phone: input.phone,
      skills: input.skills,
    },
    create: {
      email: input.email,
      fullName: input.fullName,
      role: input.role,
      password: passwordHash,
      city: input.city,
      phone: input.phone,
      skills: input.skills,
    },
  });
}

async function seedVerifiedOrphanageProfile(managerId: string) {
  const existing = await prisma.orphanage.findFirst({
    where: {
      managerId,
      publicAlias: "Panti Test",
    },
  });

  if (existing) {
    await prisma.orphanage.update({
      where: { id: existing.id },
      data: {
        name: "Panti Test Pantiku",
        publicAlias: "Panti Test",
        location: "Bandung",
        description: "Profil panti untuk QA/testing lokal Pantiku.",
        verified: true,
        verificationStatus: OrphanageVerificationStatus.VERIFIED,
      },
    });
    return existing.id;
  }

  const orphanage = await prisma.orphanage.create({
    data: {
      managerId,
      name: "Panti Test Pantiku",
      publicAlias: "Panti Test",
      location: "Bandung",
      description: "Profil panti untuk QA/testing lokal Pantiku.",
      verified: true,
      verificationStatus: OrphanageVerificationStatus.VERIFIED,
      city: "Bandung",
      province: "Jawa Barat",
      contactPhone: "081200000001",
      estimatedChildrenCount: 25,
    },
  });

  return orphanage.id;
}

async function main() {
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);
  const createdUsers = [];

  for (const seedUser of seedUsers) {
    const user = await upsertSeedUser(seedUser, passwordHash);
    createdUsers.push(user);
  }

  const orphanageManager = createdUsers.find((user) => user.role === UserRole.ORPHANAGE_MANAGER);
  let orphanageId: string | null = null;

  if (orphanageManager) {
    orphanageId = await seedVerifiedOrphanageProfile(orphanageManager.id);
  }

  console.log("Pantiku user seeding completed.");
  console.log(
    JSON.stringify(
      {
        usersSeeded: createdUsers.length,
        defaultPassword: DEFAULT_PASSWORD,
        orphanageProfileSeeded: Boolean(orphanageId),
        orphanageId,
      },
      null,
      2
    )
  );
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
