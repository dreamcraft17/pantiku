// User management is restricted to admin users.
bool canManageUsers(String? role) => role == 'ADMIN';

// Orphanage operations are allowed for admin and orphanage manager.
bool canManageOrphanage(String? role) => role == 'ADMIN' || role == 'ORPHANAGE_MANAGER';

// Campaign creation follows orphanage management permission.
bool canCreateCampaign(String? role) => canManageOrphanage(role);

// Product creation follows orphanage management permission.
bool canCreateProduct(String? role) => canManageOrphanage(role);

// Donation actions are available for donor and admin.
bool canDonate(String? role) => role == 'DONOR' || role == 'ADMIN';

// Order creation is available for donor and admin.
bool canCreateOrder(String? role) => role == 'DONOR' || role == 'ADMIN';

// Admin dashboard is reserved for administrators.
bool canViewAdminDashboard(String? role) => role == 'ADMIN';

// Impact dashboard can be accessed by all signed-in roles.
bool canViewImpactDashboard(String? role) => role != null && role.isNotEmpty;
