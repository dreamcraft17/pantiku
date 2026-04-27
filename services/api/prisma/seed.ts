import bcrypt from "bcryptjs";
import { PrismaClient, UserRole, CampaignStatus, DonationStatus, ProductStatus } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();
const DEMO_MODE = process.env.DEMO_MODE === "true";

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.donation.deleteMany();
  await prisma.impactMetric.deleteMany();
  await prisma.product.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.childProfile.deleteMany();
  await prisma.orphanage.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("Pantiku123!", 10);

  const users = await prisma.user.createManyAndReturn({
    data: [
      { email: "admin@pantiku.id", fullName: "Admin Pantiku", password: passwordHash, role: UserRole.ADMIN },
      { email: "manager.jakarta.utara@pantiku.id", fullName: "Rina Prameswari", password: passwordHash, role: UserRole.ORPHANAGE_MANAGER },
      { email: "manager.jakarta.timur@pantiku.id", fullName: "Dimas Kurniawan", password: passwordHash, role: UserRole.ORPHANAGE_MANAGER },
      { email: "donor.ayu@pantiku.id", fullName: "Ayu Setyaningrum", password: passwordHash, role: UserRole.DONOR },
      { email: "donor.fajar@pantiku.id", fullName: "Fajar Ramadhan", password: passwordHash, role: UserRole.DONOR },
      { email: "donor.nadia@pantiku.id", fullName: "Nadia Putri", password: passwordHash, role: UserRole.DONOR }
    ]
  });

  if (!DEMO_MODE) {
    console.log("DEMO_MODE=false -> skipping demo campaign/product seed data.");
    return;
  }

  const managerUtara = users.find((u) => u.email === "manager.jakarta.utara@pantiku.id")!;
  const managerTimur = users.find((u) => u.email === "manager.jakarta.timur@pantiku.id")!;
  const donors = users.filter((u) => u.role === UserRole.DONOR);

  const orphanageUtara = await prisma.orphanage.create({
    data: {
      name: "Panti Asuh Harapan Utara",
      publicAlias: "Panti Jakarta Utara",
      location: "Jakarta Utara, DKI Jakarta",
      description: "Fokus pada pendidikan vokasi dan kewirausahaan anak binaan.",
      verified: true,
      managerId: managerUtara.id
    }
  });

  const orphanageTimur = await prisma.orphanage.create({
    data: {
      name: "Panti Asuh Cita Timur",
      publicAlias: "Panti Jakarta Timur",
      location: "Jakarta Timur, DKI Jakarta",
      description: "Program pembinaan karakter, literasi digital, dan ekonomi kreatif.",
      verified: true,
      managerId: managerTimur.id
    }
  });

  await prisma.childProfile.createMany({
    data: [
      { orphanageId: orphanageUtara.id, displayCode: "ANAK-JU-001", nameHash: "hju001", age: 10, needsSummary: "Pendampingan belajar matematika dasar." },
      { orphanageId: orphanageUtara.id, displayCode: "ANAK-JU-002", nameHash: "hju002", age: 11, needsSummary: "Dukungan perlengkapan sekolah dan gizi." },
      { orphanageId: orphanageUtara.id, displayCode: "ANAK-JU-003", nameHash: "hju003", age: 12, needsSummary: "Pelatihan keterampilan menjahit dasar." },
      { orphanageId: orphanageUtara.id, displayCode: "ANAK-JU-004", nameHash: "hju004", age: 13, needsSummary: "Kelas penguatan literasi dan numerasi." },
      { orphanageId: orphanageUtara.id, displayCode: "ANAK-JU-005", nameHash: "hju005", age: 14, needsSummary: "Program pengembangan minat kewirausahaan." },
      { orphanageId: orphanageTimur.id, displayCode: "ANAK-JT-001", nameHash: "hjt001", age: 10, needsSummary: "Akses perangkat belajar digital bersama." },
      { orphanageId: orphanageTimur.id, displayCode: "ANAK-JT-002", nameHash: "hjt002", age: 11, needsSummary: "Pelatihan kreativitas kerajinan tangan." },
      { orphanageId: orphanageTimur.id, displayCode: "ANAK-JT-003", nameHash: "hjt003", age: 12, needsSummary: "Pendampingan bahasa Indonesia dan Inggris." },
      { orphanageId: orphanageTimur.id, displayCode: "ANAK-JT-004", nameHash: "hjt004", age: 13, needsSummary: "Kelas dasar pemasaran digital UMKM." },
      { orphanageId: orphanageTimur.id, displayCode: "ANAK-JT-005", nameHash: "hjt005", age: 15, needsSummary: "Persiapan vokasi dan keterampilan kerja." }
    ]
  });

  const campaigns = await prisma.campaign.createManyAndReturn({
    data: [
      {
        orphanageId: orphanageUtara.id,
        title: "Sewing Machine for Productive Skills",
        description: "Pengadaan mesin jahit dan modul pelatihan untuk kelas keterampilan produktif.",
        goalAmount: 35000000,
        collectedAmount: 14500000,
        status: CampaignStatus.ACTIVE,
        isPublic: true,
        isDemo: true
      },
      {
        orphanageId: orphanageUtara.id,
        title: "Baking Oven and Culinary Training",
        description: "Penyediaan oven industri kecil dan pelatihan kuliner untuk unit usaha panti.",
        goalAmount: 42000000,
        collectedAmount: 18000000,
        status: CampaignStatus.ACTIVE,
        isPublic: true,
        isDemo: true
      },
      {
        orphanageId: orphanageTimur.id,
        title: "Digital Literacy Program",
        description: "Program literasi digital, komputer dasar, dan internet aman untuk anak binaan.",
        goalAmount: 30000000,
        collectedAmount: 12000000,
        status: CampaignStatus.ACTIVE,
        isPublic: true,
        isDemo: true
      },
      {
        orphanageId: orphanageTimur.id,
        title: "Creative Craft Production Kit",
        description: "Pengadaan alat produksi kerajinan kreatif untuk mendukung produk marketplace.",
        goalAmount: 27000000,
        collectedAmount: 9000000,
        status: CampaignStatus.ACTIVE,
        isPublic: true,
        isDemo: true
      }
    ]
  });

  await prisma.product.createMany({
    data: [
      { orphanageId: orphanageUtara.id, name: "Tote Bag Batik Jakarta", description: "Tas kain handmade produksi kelas menjahit.", price: 95000, stock: 40, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageUtara.id, name: "Apron Dapur Kain Kanvas", description: "Apron tahan lama hasil program keterampilan.", price: 120000, stock: 30, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageUtara.id, name: "Kue Kering Nastar Premium", description: "Produk kuliner rumahan untuk dukung keberlanjutan panti.", price: 85000, stock: 60, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageUtara.id, name: "Cookies Cokelat Kacang", description: "Kudapan produksi unit kuliner anak binaan.", price: 70000, stock: 55, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageTimur.id, name: "Notebook Daur Ulang A5", description: "Buku catatan dari material ramah lingkungan.", price: 45000, stock: 80, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageTimur.id, name: "Gantungan Kunci Resin", description: "Kerajinan resin kreatif dengan desain lokal.", price: 30000, stock: 100, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageTimur.id, name: "Pouch Serbaguna Motif Etnik", description: "Pouch handmade untuk kebutuhan harian.", price: 50000, stock: 70, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true },
      { orphanageId: orphanageTimur.id, name: "Set Kartu Ucapan Handmade", description: "Kartu ucapan kreatif untuk hadiah dan acara.", price: 40000, stock: 90, status: ProductStatus.ACTIVE, isPublic: true, isDemo: true }
    ]
  });

  await prisma.donation.createMany({
    data: [
      { campaignId: campaigns[0].id, userId: donors[0].id, amount: 500000, status: DonationStatus.PAID, provider: "MOCK", paymentRef: "don-ju-001" },
      { campaignId: campaigns[0].id, userId: donors[1].id, amount: 750000, status: DonationStatus.PAID, provider: "MOCK", paymentRef: "don-ju-002" },
      { campaignId: campaigns[1].id, userId: donors[2].id, amount: 1000000, status: DonationStatus.PAID, provider: "MOCK", paymentRef: "don-ju-003" },
      { campaignId: campaigns[2].id, userId: donors[0].id, amount: 350000, status: DonationStatus.PAID, provider: "MOCK", paymentRef: "don-jt-001" },
      { campaignId: campaigns[3].id, userId: donors[1].id, amount: 450000, status: DonationStatus.PAID, provider: "MOCK", paymentRef: "don-jt-002" },
      { campaignId: campaigns[2].id, userId: donors[2].id, amount: 250000, status: DonationStatus.PENDING, provider: "MOCK", paymentRef: "don-jt-003" }
    ]
  });

  await prisma.impactMetric.createMany({
    data: [
      {
        orphanageId: orphanageUtara.id,
        campaignId: campaigns[0].id,
        metricDate: new Date("2026-03-01T00:00:00.000Z"),
        childrenServed: 28,
        donationTotal: 12500000,
        productRevenue: 6700000,
        notes: "Kelas menjahit berjalan 3 sesi per minggu."
      },
      {
        orphanageId: orphanageUtara.id,
        campaignId: campaigns[1].id,
        metricDate: new Date("2026-03-15T00:00:00.000Z"),
        childrenServed: 24,
        donationTotal: 9800000,
        productRevenue: 5400000,
        notes: "Produksi kue kering meningkat untuk Ramadan bazaar."
      },
      {
        orphanageId: orphanageTimur.id,
        campaignId: campaigns[2].id,
        metricDate: new Date("2026-03-10T00:00:00.000Z"),
        childrenServed: 30,
        donationTotal: 8700000,
        productRevenue: 4100000,
        notes: "Pelatihan digital dasar selesai untuk batch pertama."
      },
      {
        orphanageId: orphanageTimur.id,
        campaignId: campaigns[3].id,
        metricDate: new Date("2026-03-20T00:00:00.000Z"),
        childrenServed: 26,
        donationTotal: 7600000,
        productRevenue: 6200000,
        notes: "Produk kerajinan baru masuk marketplace lokal."
      },
      {
        orphanageId: orphanageUtara.id,
        metricDate: new Date("2026-04-01T00:00:00.000Z"),
        childrenServed: 32,
        donationTotal: 14500000,
        productRevenue: 8900000,
        notes: "Rekap bulanan dampak panti Jakarta Utara."
      },
      {
        orphanageId: orphanageTimur.id,
        metricDate: new Date("2026-04-01T00:00:00.000Z"),
        childrenServed: 31,
        donationTotal: 12000000,
        productRevenue: 7800000,
        notes: "Rekap bulanan dampak panti Jakarta Timur."
      }
    ]
  });

  console.log({
    users: users.length,
    orphanages: 2,
    childrenProfiles: 10,
    campaigns: campaigns.length,
    products: 8,
    donations: 6,
    impactMetrics: 6
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
