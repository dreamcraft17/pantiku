import { UserRole } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import crypto from "crypto";
import { canManageOrphanage } from "../../utils/permissions.js";

type Actor = { userId: string; role: UserRole };

async function assertManagerOwnership(orphanageId: string, actor: Actor) {
  if (actor.role === UserRole.ADMIN) return;
  const own = await prisma.orphanage.findFirst({ where: { id: orphanageId, managerId: actor.userId } });
  if (!own) throw new ApiError("Forbidden", 403, "FORBIDDEN");
}

export const childrenService = {
  async create(orphanageId: string, data: { displayCode: string; fullName: string; age: number; needsSummary: string }, actor: Actor) {
    if (!canManageOrphanage(actor.role)) throw new ApiError("Forbidden", 403, "FORBIDDEN");
    await assertManagerOwnership(orphanageId, actor);
    return prisma.childProfile.create({
      data: {
        orphanageId,
        displayCode: data.displayCode,
        nameHash: crypto.createHash("sha256").update(data.fullName).digest("hex"),
        age: data.age,
        needsSummary: data.needsSummary
      }
    });
  },

  async listByOrphanage(orphanageId: string, actor?: Actor) {
    const base = await prisma.childProfile.findMany({ where: { orphanageId } });
    if (!actor || actor.role === UserRole.DONOR || actor.role === UserRole.VOLUNTEER) {
      return base.map((x) => ({
        id: x.id,
        displayCode: x.displayCode,
        age: x.age,
        needsSummary: x.needsSummary,
        createdAt: x.createdAt
      }));
    }
    return base;
  }
};
