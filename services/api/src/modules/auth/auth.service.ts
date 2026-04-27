import bcrypt from "bcryptjs";
import { OrphanageVerificationStatus, UserRole } from "@prisma/client";
import { prisma } from "../../config/db.js";
import { ApiError } from "../../utils/api-error.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../../utils/jwt.js";
import { LoginInput, RefreshInput, RegisterInput } from "./auth.types.js";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

async function issueTokenPair(userId: string, role: UserRole) {
  const accessToken = signAccessToken(userId, role);
  const refreshToken = signRefreshToken(userId);
  const tokenHash = await bcrypt.hash(refreshToken, 10);

  await prisma.refreshToken.create({
    data: {
      userId,
      tokenHash,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
    }
  });

  return { accessToken, refreshToken };
}

async function buildAuthUserPayload(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
      role: true,
      orphanages: {
        select: { verificationStatus: true },
        take: 1
      }
    }
  });
  if (!user) throw new ApiError("User not found", 404, "USER_NOT_FOUND");

  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    orphanageVerificationStatus: user.orphanages[0]?.verificationStatus
  };
}

export const authService = {
  async register(input: RegisterInput) {
    const existing = await prisma.user.findUnique({ where: { email: input.email } });
    if (existing) {
      throw new ApiError("Email already registered", 409, "EMAIL_TAKEN");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const role = input.accountType;
      const fullName = role === UserRole.ORPHANAGE_MANAGER ? input.managerName : input.fullName;
      if (!fullName) {
        throw new ApiError("Nama wajib diisi", 400, "INVALID_REGISTER_PAYLOAD");
      }

      const createdUser = await tx.user.create({
        data: {
          email: input.email,
          password: passwordHash,
          fullName,
          phone: input.phone,
          skills: input.skills,
          city: input.city,
          role
        }
      });

      if (role === UserRole.ORPHANAGE_MANAGER) {
        await tx.orphanage.create({
          data: {
            name: input.orphanageName!,
            publicAlias: input.orphanageName!,
            description: "Profil panti sedang dalam proses verifikasi oleh tim Pantiku.",
            location: `${input.city}, ${input.province}`,
            managerId: createdUser.id,
            verificationStatus: OrphanageVerificationStatus.PENDING,
            verified: false,
            address: input.address,
            city: input.city,
            province: input.province,
            contactPhone: input.contactPhone,
            estimatedChildrenCount: input.estimatedChildrenCount
          }
        });
      }

      return createdUser;
    });

    const tokens = await issueTokenPair(user.id, user.role);
    const authUser = await buildAuthUserPayload(user.id);
    return {
      ...tokens,
      user: authUser,
      message:
        user.role === UserRole.ORPHANAGE_MANAGER
          ? "Pendaftaran panti berhasil dikirim. Tim Pantiku akan melakukan verifikasi sebelum campaign dapat dibuat."
          : "Registrasi berhasil."
    };
  },

  async login(input: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });
    if (!user) throw new ApiError("Invalid credentials", 401, "INVALID_CREDENTIALS");

    const valid = await bcrypt.compare(input.password, user.password);
    if (!valid) throw new ApiError("Invalid credentials", 401, "INVALID_CREDENTIALS");

    const tokens = await issueTokenPair(user.id, user.role);
    const authUser = await buildAuthUserPayload(user.id);
    return {
      ...tokens,
      user: authUser
    };
  },

  async refresh(input: RefreshInput) {
    const payload = verifyRefreshToken(input.refreshToken);
    const rows = await prisma.refreshToken.findMany({
      where: {
        userId: payload.sub,
        revokedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: true }
    });

    let matchedTokenId: string | null = null;
    let userRole: string | null = null;
    for (const row of rows) {
      const ok = await bcrypt.compare(input.refreshToken, row.tokenHash);
      if (ok) {
        matchedTokenId = row.id;
        userRole = row.user.role;
        break;
      }
    }

    if (!matchedTokenId || !userRole) {
      throw new ApiError("Invalid refresh token", 401, "INVALID_REFRESH_TOKEN");
    }

    await prisma.refreshToken.update({
      where: { id: matchedTokenId },
      data: { revokedAt: new Date() }
    });

    const tokens = await issueTokenPair(payload.sub, userRole as UserRole);
    return tokens;
  },

  async me(userId: string) {
    return buildAuthUserPayload(userId);
  },

  async logout(refreshToken: string) {
    const payload = verifyRefreshToken(refreshToken);
    const rows = await prisma.refreshToken.findMany({
      where: { userId: payload.sub, revokedAt: null, expiresAt: { gt: new Date() } }
    });

    for (const row of rows) {
      const ok = await bcrypt.compare(refreshToken, row.tokenHash);
      if (ok) {
        await prisma.refreshToken.update({
          where: { id: row.id },
          data: { revokedAt: new Date() }
        });
        break;
      }
    }

    return { success: true };
  }
};
