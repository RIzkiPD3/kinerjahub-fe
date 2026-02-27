import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { hasRole } from "@/lib/role-helpers";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string | string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  console.log("ProtectedRoute - isAuthenticated:", isAuthenticated);

  if (!isAuthenticated) {
    console.log("User not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(user, allowedRoles)) {
    console.log("User does not have required roles, redirecting to dashboard");
    // You could also redirect to an "Access Denied" page
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
