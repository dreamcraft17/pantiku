import { UserRole } from "@prisma/client";

export type AccountType = Exclude<UserRole, "ADMIN">;

export type RegisterInput = {
  accountType: AccountType;
  email: string;
  password: string;
  fullName?: string;
  managerName?: string;
  phone?: string;
  skills?: string;
  city?: string;
  orphanageName?: string;
  address?: string;
  province?: string;
  contactPhone?: string;
  estimatedChildrenCount?: number;
};

export type LoginInput = {
  email: string;
  password: string;
};

export type RefreshInput = {
  refreshToken: string;
};

export type GoogleLoginInput = {
  idToken: string;
};

export type ClerkLoginInput = {
  email: string;
  name: string;
  clerkId: string;
};
