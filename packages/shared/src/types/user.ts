import type { Role } from "../constants/roles.js";

export type User = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
