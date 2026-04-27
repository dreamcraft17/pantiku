import jwt from "jsonwebtoken";
import { UserRole } from "@prisma/client";
import { env } from "../config/env.js";

export type AuthTokenPayload = {
  sub: string;
  role: UserRole;
};

export function signAccessToken(userId: string, role: UserRole): string {
  const options: jwt.SignOptions = {
    subject: userId,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  };

  return jwt.sign({ role }, env.JWT_SECRET, {
    ...options
  });
}

export function signRefreshToken(userId: string): string {
  return jwt.sign({}, env.JWT_REFRESH_SECRET ?? env.JWT_SECRET, {
    subject: userId,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"]
  });
}

export function verifyAccessToken(token: string): AuthTokenPayload {
  const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  if (!payload.sub || !payload.role) {
    throw new Error("Invalid token payload");
  }

  return {
    sub: payload.sub,
    role: payload.role as UserRole
  };
}

export function verifyRefreshToken(token: string): { sub: string } {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET ?? env.JWT_SECRET) as jwt.JwtPayload;
  if (!payload.sub) throw new Error("Invalid refresh token");
  return { sub: payload.sub };
}
