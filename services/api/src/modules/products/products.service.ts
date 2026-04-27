import { OrphanageVerificationStatus, UserRole } from "@prisma/client";
import { env } from "../../config/env.js";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import { canCreateProduct } from "../../utils/permissions.js";

type Actor = { userId: string; role: UserRole };

export const productsService = {
  list(includeDemo = false) {
    const shouldIncludeDemo = env.DEMO_MODE && includeDemo;
    return prisma.product.findMany({
      where: { isPublic: true, ...(shouldIncludeDemo ? {} : { isDemo: false }) },
      include: { orphanage: { select: { publicAlias: true, location: true } } }
    });
  },

  getById(id: string, includeDemo = false) {
    const shouldIncludeDemo = env.DEMO_MODE && includeDemo;
    return prisma.product.findFirst({
      where: { id, isPublic: true, ...(shouldIncludeDemo ? {} : { isDemo: false }) },
      include: { orphanage: { select: { publicAlias: true, location: true } } }
    });
  },

  async create(input: { orphanageId: string; name: string; description: string; price: number; stock: number; isPublic: boolean }, actor: Actor) {
    if (!canCreateProduct(actor.role)) throw new ApiError("Forbidden", 403, "FORBIDDEN");

    if (actor.role === UserRole.ORPHANAGE_MANAGER) {
      const own = await prisma.orphanage.findFirst({
        where: { id: input.orphanageId, managerId: actor.userId }
      });
      if (!own) throw new ApiError("Cannot create product for another orphanage", 403, "FORBIDDEN");
      if (own.verificationStatus !== OrphanageVerificationStatus.VERIFIED) {
        throw new ApiError("Akun panti sedang menunggu verifikasi. Kamu bisa melengkapi profil panti terlebih dahulu.", 403, "ORPHANAGE_NOT_VERIFIED");
      }
    }

    return prisma.product.create({ data: { ...input, isDemo: false } });
  }
};
