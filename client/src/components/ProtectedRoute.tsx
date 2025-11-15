import { useEffect } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type Role = "user" | "seller" | "admin";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: Role;
  requireAuth?: boolean;
}

/**
 * ProtectedRoute Component
 * 
 * Protects routes based on authentication and role requirements.
 * 
 * @param children - The content to render if access is granted
 * @param requiredRole - The minimum role required (user < seller < admin)
 * @param requireAuth - Whether authentication is required (default: true)
 * 
 * Examples:
 * - <ProtectedRoute>...</ProtectedRoute> - Requires login (any role)
 * - <ProtectedRoute requiredRole="seller">...</ProtectedRoute> - Requires seller or admin role
 * - <ProtectedRoute requiredRole="admin">...</ProtectedRoute> - Requires admin role only
 */
export function ProtectedRoute({ 
  children, 
  requiredRole,
  requireAuth = true
}: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !isAuthenticated) {
      toast.error("กรุณาเข้าสู่ระบบก่อน");
      setLocation("/");
      return;
    }

    // Check role requirements
    if (requiredRole && user) {
      const roleHierarchy: Record<Role, number> = {
        user: 1,
        seller: 2,
        admin: 3,
      };

      const userRoleLevel = roleHierarchy[user.role as Role] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        toast.error("คุณไม่มีสิทธิ์เข้าถึงหน้านี้");
        setLocation("/");
        return;
      }
    }
  }, [loading, isAuthenticated, user, requiredRole, requireAuth, setLocation]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังตรวจสอบสิทธิ์...</p>
        </div>
      </div>
    );
  }

  // Check authentication
  if (requireAuth && !isAuthenticated) {
    return null;
  }

  // Check role
  if (requiredRole && user) {
    const roleHierarchy: Record<Role, number> = {
      user: 1,
      seller: 2,
      admin: 3,
    };

    const userRoleLevel = roleHierarchy[user.role as Role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      return null;
    }
  }

  return <>{children}</>;
}

/**
 * RequireGuest Component
 * 
 * Redirects authenticated users away from guest-only pages (e.g., login page)
 */
export function RequireGuest({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
