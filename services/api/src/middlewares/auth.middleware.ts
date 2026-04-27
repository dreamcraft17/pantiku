import { NextFunction, Request, Response } from "express";
import { UserRole } from "@prisma/client";
import { verifyAccessToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return errorResponse(res, "Unauthorized", 401, "UNAUTHORIZED");
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    req.user = { userId: payload.sub, role: payload.role };
    next();
  } catch {
    return errorResponse(res, "Invalid token", 401, "INVALID_TOKEN");
  }
}

export function requireRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401, "UNAUTHORIZED");
    }

    if (!roles.includes(req.user.role)) {
      return errorResponse(res, "Forbidden", 403, "FORBIDDEN");
    }

    next();
  };
}

export function requireRole(role: UserRole) {
  return requireRoles(role);
}

export function requirePermission(permissionFn: (role: UserRole) => boolean) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return errorResponse(res, "Unauthorized", 401, "UNAUTHORIZED");
    }
    if (!permissionFn(req.user.role)) {
      return errorResponse(res, "Forbidden", 403, "FORBIDDEN");
    }
    next();
  };
}
