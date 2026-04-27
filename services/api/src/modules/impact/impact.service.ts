import { prisma } from "../../config/db.js";
import { OrphanageVerificationStatus, CampaignStatus, DonationStatus, OrderStatus } from "@prisma/client";
import { env } from "../../config/env.js";
import { cacheService } from "../../services/cache/cache.service.js";

const IMPACT_CACHE_TTL_MS = 60_000;

const IMPACT_STORIES = [
  {
    title: "Dari Mesin Jahit ke Produk Siap Jual",
    description:
      "Program pelatihan menjahit membantu peserta menguasai pola dasar hingga quality control produk. Dalam beberapa minggu, karya pertama sudah mulai dipasarkan.",
    orphanageName: "Panti Berdaya Jakarta Utara",
    impact: "5 anak belajar keterampilan menjahit"
  },
  {
    title: "Kelas Kuliner Menjadi Unit Produksi",
    description:
      "Dukungan alat dan bahan pelatihan membuat kelas kuliner berkembang menjadi unit produksi kudapan mingguan yang dikelola bersama mentor.",
    orphanageName: "Panti Tumbuh Jakarta Timur",
    impact: "8 anak terlibat dalam produksi dan pengemasan"
  },
  {
    title: "Literasi Digital untuk Masa Depan Kerja",
    description:
      "Melalui akses perangkat dan modul belajar, peserta membangun kebiasaan belajar digital, presentasi proyek, serta kolaborasi tim secara terarah.",
    orphanageName: "Panti Mandiri Jakarta Selatan",
    impact: "6 anak menuntaskan kelas literasi digital dasar"
  }
] as const;

export async function invalidateImpactCache() {
  await cacheService.delByPrefix("impact:");
}

type ImpactSummaryValues = {
  totalChildren: number;
  totalOrphanages: number;
  totalCampaigns: number;
  totalProductsSold: number;
  totalDonationsAmount: number;
};

type ImpactSummaryResponse = {
  mode: "real" | "demo";
  isDemo: boolean;
  summary: ImpactSummaryValues;
  message: string | null;
};

function hasRealImpactData(summary: ImpactSummaryValues) {
  return (
    summary.totalChildren > 0 ||
    summary.totalOrphanages > 0 ||
    summary.totalCampaigns > 0 ||
    summary.totalProductsSold > 0 ||
    summary.totalDonationsAmount > 0
  );
}

async function getRealImpactSummary(): Promise<ImpactSummaryValues> {
  const [children, orphanages, campaigns, paidOrders, paidDonations] = await Promise.all([
    prisma.childProfile.count(),
    prisma.orphanage.count({
      where: { verificationStatus: OrphanageVerificationStatus.VERIFIED },
    }),
    prisma.campaign.count({
      where: {
        isDemo: false,
        status: { in: [CampaignStatus.ACTIVE, CampaignStatus.FUNDED, CampaignStatus.COMPLETED] },
      },
    }),
    prisma.orderItem.aggregate({
      _sum: { quantity: true },
      where: {
        order: { status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] } },
        product: { isDemo: false },
      },
    }),
    prisma.donation.aggregate({
      _sum: { amount: true },
      where: {
        status: DonationStatus.PAID,
        campaign: { isDemo: false },
      },
    }),
  ]);

  return {
    totalChildren: children,
    totalOrphanages: orphanages,
    totalCampaigns: campaigns,
    totalProductsSold: Number(paidOrders._sum.quantity ?? 0),
    totalDonationsAmount: Number(paidDonations._sum.amount ?? 0),
  };
}

async function getDemoImpactSummary(): Promise<ImpactSummaryResponse> {
  const [demoCampaigns, demoProducts] = await Promise.all([
    prisma.campaign.findMany({
      where: { isDemo: true, status: { in: [CampaignStatus.ACTIVE, CampaignStatus.FUNDED, CampaignStatus.COMPLETED] } },
      select: { id: true, orphanageId: true },
    }),
    prisma.product.findMany({
      where: { isDemo: true },
      select: { id: true, orphanageId: true },
    }),
  ]);

  const demoCampaignIds = demoCampaigns.map((item) => item.id);
  const demoProductIds = demoProducts.map((item) => item.id);
  const demoOrphanageIds = Array.from(new Set([...demoCampaigns.map((item) => item.orphanageId), ...demoProducts.map((item) => item.orphanageId)]));

  if (!demoCampaignIds.length && !demoProductIds.length) {
    return {
      mode: "demo",
      isDemo: true,
      summary: {
        totalChildren: 0,
        totalOrphanages: 0,
        totalCampaigns: 0,
        totalProductsSold: 0,
        totalDonationsAmount: 0,
      },
      message: "Angka ini adalah simulasi untuk kebutuhan demonstrasi.",
    };
  }

  const [children, paidOrders, paidDonations] = await Promise.all([
    demoOrphanageIds.length ? prisma.childProfile.count({ where: { orphanageId: { in: demoOrphanageIds } } }) : 0,
    demoProductIds.length
      ? prisma.orderItem.aggregate({
          _sum: { quantity: true },
          where: {
            productId: { in: demoProductIds },
            order: { status: { in: [OrderStatus.PAID, OrderStatus.COMPLETED] } },
          },
        })
      : { _sum: { quantity: 0 } },
    demoCampaignIds.length
      ? prisma.donation.aggregate({
          _sum: { amount: true },
          where: {
            campaignId: { in: demoCampaignIds },
            status: DonationStatus.PAID,
          },
        })
      : { _sum: { amount: 0 } },
  ]);

  return {
    mode: "demo",
    isDemo: true,
    summary: {
      totalChildren: children,
      totalOrphanages: demoOrphanageIds.length,
      totalCampaigns: demoCampaignIds.length,
      totalProductsSold: Number(paidOrders._sum.quantity ?? 0),
      totalDonationsAmount: Number(paidDonations._sum.amount ?? 0),
    },
    message: "Angka ini adalah simulasi untuk kebutuhan demonstrasi.",
  };
}

export const impactService = {
  async getImpactSummary() {
    const cacheKey = "impact:summary";
    const cached = await cacheService.get<ImpactSummaryResponse>(cacheKey);
    if (cached) return cached;

    const realSummary = await getRealImpactSummary();
    const result: ImpactSummaryResponse =
      env.DEMO_MODE && !hasRealImpactData(realSummary)
        ? await getDemoImpactSummary()
        : {
            mode: "real",
            isDemo: false,
            summary: realSummary,
            message: null,
          };

    await cacheService.set(cacheKey, result, IMPACT_CACHE_TTL_MS);
    return result;
  },

  async getOrphanageImpact(orphanageId: string) {
    const cacheKey = `impact:orphanage:${orphanageId}`;
    const cached = await cacheService.get<Record<string, number | string>>(cacheKey);
    if (cached) return cached;

    const [campaigns, donations, productsSold, children] = await Promise.all([
      prisma.campaign.count({ where: { orphanageId } }),
      prisma.donation.aggregate({
        _sum: { amount: true },
        where: { campaign: { orphanageId }, status: "PAID" }
      }),
      prisma.orderItem.aggregate({
        _sum: { quantity: true },
        where: { product: { orphanageId }, order: { status: "PAID" } }
      }),
      prisma.childProfile.count({ where: { orphanageId } })
    ]);

    const result = {
      orphanageId,
      totalChildren: children,
      totalOrphanages: 1,
      totalCampaigns: campaigns,
      totalProductsSold: Number(productsSold._sum.quantity ?? 0),
      totalDonations: Number(donations._sum.amount ?? 0),
      // Backward-compatible keys for existing clients.
      total_children_supported: children,
      total_orphanages: 1,
      total_campaigns: campaigns,
      total_products_sold: Number(productsSold._sum.quantity ?? 0),
      total_donations_amount: Number(donations._sum.amount ?? 0)
    };

    await cacheService.set(cacheKey, result, IMPACT_CACHE_TTL_MS);
    return result;
  },

  // Backward-compatible aliases.
  summary() {
    return this.getImpactSummary();
  },
  orphanageImpact(orphanageId: string) {
    return this.getOrphanageImpact(orphanageId);
  },
  async getImpactStories() {
    const cacheKey = "impact:stories";
    const cached = await cacheService.get<typeof IMPACT_STORIES>(cacheKey);
    if (cached) return cached;

    await cacheService.set(cacheKey, IMPACT_STORIES, IMPACT_CACHE_TTL_MS);
    return IMPACT_STORIES;
  }
};
