import { UserRole } from "@prisma/client";

// User management is limited to administrators.
export const canManageUsers = (role: UserRole) => role === UserRole.ADMIN;

// Orphanage management is allowed for admin and orphanage manager roles.
export const canManageOrphanage = (role: UserRole) =>
  role === UserRole.ADMIN || role === UserRole.ORPHANAGE_MANAGER;

// Campaign creation follows orphanage management permissions.
export const canCreateCampaign = (role: UserRole) => canManageOrphanage(role);

// Product creation follows orphanage management permissions.
export const canCreateProduct = (role: UserRole) => canManageOrphanage(role);

// Donation is available for donor and admin roles.
export const canDonate = (role: UserRole) => role === UserRole.DONOR || role === UserRole.ADMIN;

// Order creation is available for donor and admin roles.
export const canCreateOrder = (role: UserRole) => role === UserRole.DONOR || role === UserRole.ADMIN;

// Admin dashboard is restricted to administrators.
export const canViewAdminDashboard = (role: UserRole) => role === UserRole.ADMIN;

// Impact dashboard is available to all authenticated roles.
export const canViewImpactDashboard = (_role: UserRole) => true;
