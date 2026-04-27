import { OrphanageVerificationStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import { canManageOrphanage } from "../../utils/permissions.js";

type Actor = { userId: string; role: UserRole };

export const orphanagesService = {
  list(actor?: Actor) {
    if (actor?.role === UserRole.ADMIN) return prisma.orphanage.findMany();
    return prisma.orphanage.findMany({
      where: { verificationStatus: OrphanageVerificationStatus.VERIFIED },
      select: { id: true, publicAlias: true, location: true, description: true, verified: true, verificationStatus: true }
    });
  },

  async getById(id: string, actor?: Actor) {
    if (actor?.role === UserRole.ADMIN) {
      return prisma.orphanage.findUnique({ where: { id } });
    }
    if (actor?.role === UserRole.ORPHANAGE_MANAGER) {
      return prisma.orphanage.findFirst({
        where: { id, OR: [{ managerId: actor.userId }, { verificationStatus: OrphanageVerificationStatus.VERIFIED }] }
      });
    }
    return prisma.orphanage.findFirst({
      where: { id, verificationStatus: OrphanageVerificationStatus.VERIFIED },
      select: { id: true, publicAlias: true, location: true, description: true, verified: true, verificationStatus: true }
    });
  },

  create(
    data: {
      name: string;
      publicAlias: string;
      location: string;
      description: string;
      address?: string;
      city?: string;
      province?: string;
      contactPhone?: string;
      estimatedChildrenCount?: number;
    },
    actor: Actor
  ) {
    if (!canManageOrphanage(actor.role)) {
      throw new ApiError("Forbidden", 403, "FORBIDDEN");
    }
    return prisma.orphanage.create({
      data: { ...data, managerId: actor.userId, verificationStatus: OrphanageVerificationStatus.PENDING, verified: false }
    });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      publicAlias: string;
      location: string;
      description: string;
      address: string;
      city: string;
      province: string;
      contactPhone: string;
      estimatedChildrenCount: number;
    }>,
    actor: Actor
  ) {
    const orphanage = await prisma.orphanage.findUnique({ where: { id } });
    if (!orphanage) throw new ApiError("Orphanage not found", 404, "ORPHANAGE_NOT_FOUND");

    if (actor.role === UserRole.ADMIN || (actor.role === UserRole.ORPHANAGE_MANAGER && orphanage.managerId === actor.userId)) {
      return prisma.orphanage.update({ where: { id }, data });
    }
    throw new ApiError("Cannot update another orphanage", 403, "FORBIDDEN");
  },

  async getMine(actor: Actor) {
    if (actor.role !== UserRole.ORPHANAGE_MANAGER) throw new ApiError("Forbidden", 403, "FORBIDDEN");
    const orphanage = await prisma.orphanage.findFirst({ where: { managerId: actor.userId } });
    if (!orphanage) throw new ApiError("Orphanage profile not found", 404, "ORPHANAGE_NOT_FOUND");
    return orphanage;
  },

  async updateMine(
    data: Partial<{
      name: string;
      publicAlias: string;
      location: string;
      description: string;
      address: string;
      city: string;
      province: string;
      contactPhone: string;
      estimatedChildrenCount: number;
    }>,
    actor: Actor
  ) {
    const orphanage = await this.getMine(actor);
    return prisma.orphanage.update({ where: { id: orphanage.id }, data });
  },

  async verify(orphanageId: string) {
    return prisma.orphanage.update({
      where: { id: orphanageId },
      data: { verificationStatus: OrphanageVerificationStatus.VERIFIED, verified: true }
    });
  },

  async reject(orphanageId: string) {
    return prisma.orphanage.update({
      where: { id: orphanageId },
      data: { verificationStatus: OrphanageVerificationStatus.REJECTED, verified: false }
    });
  }
};
