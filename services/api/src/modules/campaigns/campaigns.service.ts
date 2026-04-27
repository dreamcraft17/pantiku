import { CampaignStatus, OrphanageVerificationStatus, UserRole } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import { donationsService } from "../donations/donations.service.js";
import { canCreateCampaign } from "../../utils/permissions.js";

type Actor = { userId: string; role: UserRole };

export const campaignsService = {
  list(includeDemo = false) {
    const shouldIncludeDemo = env.DEMO_MODE && includeDemo;
    return prisma.campaign.findMany({
      where: {
        isPublic: true,
        status: CampaignStatus.ACTIVE,
        ...(shouldIncludeDemo ? {} : { isDemo: false })
      },
      include: { orphanage: { select: { publicAlias: true, location: true } } }
    });
  },

  getById(id: string, includeDemo = false) {
    const shouldIncludeDemo = env.DEMO_MODE && includeDemo;
    return prisma.campaign.findFirst({
      where: { id, isPublic: true, ...(shouldIncludeDemo ? {} : { isDemo: false }) },
      include: { orphanage: { select: { publicAlias: true, location: true } } }
    });
  },

  async create(input: { orphanageId: string; title: string; description: string; goalAmount: number; isPublic: boolean }, actor: Actor) {
    if (!canCreateCampaign(actor.role)) throw new ApiError("Forbidden", 403, "FORBIDDEN");

    if (actor.role === UserRole.ORPHANAGE_MANAGER) {
      const own = await prisma.orphanage.findFirst({
        where: { id: input.orphanageId, managerId: actor.userId }
      });
      if (!own) throw new ApiError("Cannot create campaign for another orphanage", 403, "FORBIDDEN");
      if (own.verificationStatus !== OrphanageVerificationStatus.VERIFIED) {
        throw new ApiError("Akun panti sedang menunggu verifikasi. Kamu bisa melengkapi profil panti terlebih dahulu.", 403, "ORPHANAGE_NOT_VERIFIED");
      }
    }

    return prisma.campaign.create({
      data: {
        ...input,
        status: input.isPublic ? CampaignStatus.ACTIVE : CampaignStatus.DRAFT,
        isDemo: false
      }
    });
  },

  donate(campaignId: string, donorId: string, amount: number) {
    return donationsService.donate(campaignId, donorId, amount);
  }
};
