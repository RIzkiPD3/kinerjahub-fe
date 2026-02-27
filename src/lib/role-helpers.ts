import { type User } from "@/context/auth-context";

/**
 * Checks if a user has a specific role.
 */
export const hasRole = (user: User | null, allowedRoles: string | string[]) => {
    if (!user || !user.role) return false;

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    return roles.includes(user.role);
};

/**
 * Checks if a user is an admin.
 */
export const isAdmin = (user: User | null) => {
    return user?.role === "admin";
};

/**
 * Checks if a user is a coordinator.
 */
export const isCoordinator = (user: User | null) => {
    return user?.role === "koordinator";
};

/**
 * Checks if a user is staff.
 */
export const isStaff = (user: User | null) => {
    return user?.role === "staff";
};
