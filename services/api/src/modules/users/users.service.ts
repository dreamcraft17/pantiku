import { prisma } from "../../config/db.js";

export const usersService = {
  listUsers() {
    return prisma.user.findMany({
      select: { id: true, email: true, fullName: true, role: true, createdAt: true }
    });
  }
};
