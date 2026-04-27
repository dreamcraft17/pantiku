import { prisma } from "../../config/db.js";
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

export const impactService = {
  async getImpactSummary() {
    const cacheKey = "impact:summary";
    const cached = await cacheService.get<Record<string, number>>(cacheKey);
    if (cached) return cached;

    const [donations, campaigns, children, orphanages, orders] = await Promise.all([
      prisma.donation.aggregate({ _sum: { amount: true }, where: { status: "PAID" } }),
      prisma.campaign.count(),
      prisma.childProfile.count(),
      prisma.orphanage.count(),
      prisma.orderItem.aggregate({ _sum: { quantity: true }, where: { order: { status: "PAID" } } })
    ]);

    const result = {
      totalChildren: children,
      totalOrphanages: orphanages,
      totalCampaigns: campaigns,
      totalProductsSold: Number(orders._sum.quantity ?? 0),
      totalDonations: Number(donations._sum.amount ?? 0),
      // Backward-compatible keys for existing clients.
      total_children_supported: children,
      total_orphanages: orphanages,
      total_campaigns: campaigns,
      total_products_sold: Number(orders._sum.quantity ?? 0),
      total_donations_amount: Number(donations._sum.amount ?? 0)
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
