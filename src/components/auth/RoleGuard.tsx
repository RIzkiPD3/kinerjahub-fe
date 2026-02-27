import React from "react";
import { useAuth } from "@/hooks/use-auth";
import { hasRole } from "@/lib/role-helpers";

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: string | string[];
    fallback?: React.ReactNode;
}

/**
 * RoleGuard component to conditionally render children based on user roles.
 */
const RoleGuard = ({ children, allowedRoles, fallback = null }: RoleGuardProps) => {
    const { user } = useAuth();

    if (!hasRole(user, allowedRoles)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
};

export default RoleGuard;
