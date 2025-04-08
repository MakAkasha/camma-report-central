import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        navigate("/login", { state: { from: location.pathname } });
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Redirect to dashboard if authenticated but not authorized for this route
        navigate("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, navigate, location, allowedRoles, user]);

  // Show nothing while checking authentication
  if (isLoading) {
    return null;
  }

  // If user is authenticated and authorized (if roles specified), render children
  if (isAuthenticated && (!allowedRoles || (user && allowedRoles.includes(user.role)))) {
    return <>{children}</>;
  }

  // Otherwise render nothing
  return null;
};

export default ProtectedRoute;
