export const ROLES = ["ADMIN", "ORPHANAGE_MANAGER", "DONOR", "VOLUNTEER"] as const;

export type Role = (typeof ROLES)[number];
