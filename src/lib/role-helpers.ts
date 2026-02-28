import { type User } from "@/context/auth-context";

/**
 * Checks if a user has a specific role.
 */
export const hasRole = (user: User | null, allowedRoles: string | string[]) => {
    if (!user || !user.role) return false;

    // Handle if role is still an object (fallback)
    const userRole = (typeof user.role === "object"
        ? (user.role as any).name
        : user.role
    ).toLowerCase();

    const roles = (Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]).map(
        (r) => r.toLowerCase()
    );
    return roles.includes(userRole);
};

/**
 * Checks if a user is an admin.
 */
export const isAdmin = (user: User | null) => {
    if (!user || !user.role) return false;
    const roleName = typeof user.role === "object" ? (user.role as any).name : user.role;
    return roleName.toLowerCase() === "admin";
};

/**
 * Checks if a user is a coordinator.
 */
export const isCoordinator = (user: User | null) => {
    if (!user || !user.role) return false;
    const roleName = typeof user.role === "object" ? (user.role as any).name : user.role;
    return roleName.toLowerCase() === "koordinator";
};

/**
 * Checks if a user is staff.
 */
export const isStaff = (user: User | null) => {
    if (!user || !user.role) return false;
    const roleName = typeof user.role === "object" ? (user.role as any).name : user.role;
    return roleName.toLowerCase() === "staff";
};
